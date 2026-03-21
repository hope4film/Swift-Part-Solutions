import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const { url, anonKey } = window.__SPS_SUPABASE__ || {};
const supabase = url && anonKey ? createClient(url, anonKey) : null;

const form       = document.getElementById('waitlist-form');
const submitBtn  = document.getElementById('submit-btn');
const msgBox     = document.getElementById('form-message');

const REQUIRED_FIELDS = ['first_name', 'last_name', 'email', 'field_type'];

function showMessage(text, isError = false) {
  msgBox.textContent = text;
  msgBox.className = `text-sm rounded px-4 py-3 ${isError ? 'bg-red-900/60 text-red-300' : 'bg-green-900/60 text-green-300'}`;
  msgBox.classList.remove('hidden');
}

function hideMessage() {
  msgBox.classList.add('hidden');
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setLoading(on) {
  submitBtn.disabled = on;
  submitBtn.textContent = on ? 'Submitting…' : 'Join the Waitlist';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideMessage();

  const data = Object.fromEntries(new FormData(form));

  for (const key of REQUIRED_FIELDS) {
    if (!data[key]?.trim()) {
      showMessage('Please fill out all required fields.', true);
      document.getElementById(key)?.focus();
      return;
    }
  }

  if (!validateEmail(data.email)) {
    showMessage('Please enter a valid email address.', true);
    document.getElementById('email')?.focus();
    return;
  }

  if (!form.consent.checked) {
    showMessage('Please agree to receive SPS updates to continue.', true);
    return;
  }

  const payload = {
    first_name:              data.first_name.trim(),
    last_name:               data.last_name.trim(),
    email:                   data.email.trim().toLowerCase(),
    field_type:              data.field_type,
    display_name:            data.display_name?.trim() || null,
    company_name:            data.company_name?.trim() || null,
    phone:                   data.phone?.trim() || null,
    biggest_parts_headache:  data.biggest_parts_headache?.trim() || null,
    consent:                 true,
  };

  if (!supabase) {
    console.log('Supabase not configured — payload:', payload);
    showMessage('Supabase is not configured yet. Check the console for the submitted data.', true);
    return;
  }

  setLoading(true);

  try {
    const { error } = await supabase.from('waitlist_signups').insert([payload]);

    if (error) {
      if (error.code === '23505') {
        showMessage("That email is already on the waitlist — you're all set!", false);
      } else {
        console.error('Supabase insert error:', error);
        showMessage('Something went wrong. Please try again.', true);
      }
    } else {
      showMessage("You're on the list! We'll be in touch when SPS is ready.", false);
      form.reset();
    }
  } catch (err) {
    console.error('Network error:', err);
    showMessage('Could not reach the server. Check your connection and try again.', true);
  } finally {
    setLoading(false);
  }
});
