# Cursor Prompt — Build SPS Waitlist Landing Page

You are helping me build a **public waitlist landing page** for my app **Swift Part Solutions (SPS)**.

This page is **not the main app**. It is a separate, simple, public-facing marketing page meant to:

1. explain what SPS is in plain language
2. capture early interest
3. collect waitlist signups
4. optionally showcase a free demo tool (TXV Builder)
5. feel blue-collar, practical, and trustworthy — not corporate or fluffy

---

# Project Context

SPS = **Swift Part Solutions**

It is an HVACR-focused app being built to help techs:
- identify parts faster
- reduce frustration around part sourcing
- organize part info
- streamline quote requests
- save commonly used parts
- work from the field without the usual phone/email chaos

The broader SPS architecture uses:
- Next.js / TypeScript frontend
- FastAPI backend
- Supabase
- OpenAI
- OCR / image handling

But this landing page should be kept **simple and fast to launch**.

---

# Primary Goal of This Page

The main goal is to collect **early access / waitlist signups**.

I want users to feel:
- “This is built for guys like me.”
- “This solves a real headache.”
- “I should sign up now so I can try it early.”

This page is speaking primarily to the **technician pain point**, not the corporate ROI pain point.

Do **not** make the messaging about:
- saving companies millions
- increasing enterprise efficiency
- reducing labor cost
- maximizing shareholder value

Instead, make it about:
- jobsite frustration
- hold music
- messy notes
- miscommunication
- scrolling through old photos
- thumb-typing emails on a phone
- wasting time tracking down parts

This should feel relatable, practical, blue-collar, and real.

---

# Build Decision

I want this to be something I can host quickly via **GitHub Pages** on my domain:

- `swiftpartsolutions.com`
- probably at `/waitlist`

Because of that, build this page as a **static front-end page** with a clean structure that can be deployed simply.

You can choose whichever of these is most practical for quick deployment:
- plain HTML/CSS/JS
- static Next.js export if appropriate
- simple React page if truly lightweight

But optimize for **easy GitHub Pages deployment**.

If using a framework would complicate GitHub Pages unnecessarily, prefer a simpler static implementation.

---

# Data Capture / Backend Strategy

The waitlist data should be stored in **Supabase**, because I already use Supabase and may later migrate these users into real SPS accounts.

Please structure this landing page so that the form is ready to submit to Supabase.

## Important business intent
These are not just newsletter emails.
I want these users to effectively become **pre-launch SPS accounts** or at least account candidates.

So the form should capture the core information I may want for future onboarding.

---

# Suggested Waitlist Fields

Use these fields in the form:

Required:
- first_name
- last_name
- email
- display_name or username (optional if you think this should wait until later)
- company_name (optional)
- field_type

`field_type` options:
- Residential HVAC
- Commercial HVAC
- Refrigeration
- Supply House
- Other

Optional:
- phone
- biggest_parts_headache (short textarea)

Also include a required consent checkbox like:
- “I agree to receive SPS updates and early access emails.”

---

# Recommended Supabase Direction

Please build with the assumption that I may do one of these:

## Option A — separate waitlist table
A dedicated `waitlist_signups` table

## Option B — pre-account strategy
Create records that can later map into `auth.users` + `profiles`

I want the implementation to stay practical.
So in the code and explanation, recommend the **best short-term approach**.

My instinct is:
- start with a `waitlist_signups` table in Supabase
- keep it clean and easy
- later migrate approved users into real accounts

Unless you strongly think a different approach is better.

---

# Existing SPS Schema Context

My current `profiles` table already includes:
- `id`
- `user_id`
- `display_name`
- `preferred_supplier`
- `tier`
- `referral_code`
- timestamps

I am thinking I may later add things like:
- waitlist / pending status
- tier options such as free / test / paid
- maybe boolean flags for early access / beta

Do **not** break my existing SPS architecture.
If you recommend schema additions, keep them minimal and clearly separated from the main app.

---

# Messaging / Copy To Use

Use this as the core landing page copy direction.

## Hero
**Part sourcing on the go.**  
**Snap it. Search it. Save it. Quote it.**

**You’ve got better things to do than sit on hold, scroll through a million photos, and thumb out emails on a job site just to chase dead ends.**

**SPS is being built to help techs find parts faster and keep the job moving.**

Primary CTA button:
**Get Early Access**

Small supporting text under CTA can say something like:
- Join the waitlist for beta access, launch updates, and early pricing when SPS goes live.

## What SPS Can Do
Use these bullets:
- Find parts faster with smarter search
- Automatically identify parts from photos
- Easily find specs and dimensions
- Streamline quote requests
- Save parts for future jobs
- Understand HVACR lingo

## Tone rules
The tone should be:
- blue-collar
- clear
- grounded
- useful
- not salesy
- not startup cringe
- not corporate buzzword-heavy

Avoid words like:
- revolutionize
- synergy
- leverage
- paradigm
- seamless ecosystem
- disruptive innovation

---

# Free Offer / Demo Section

I also want to test the idea of offering a **free TXV Builder** as a tangible demo.

Please include a section on the page for:

## “Try a Free Tool” or similar
This should:
- briefly explain that visitors can try the TXV Builder
- help prove SPS is real
- give them value right away
- still keep the main goal focused on waitlist signups

The free tool section should not overpower the waitlist CTA.
It should support it.

Include a button like:
- Try the Free TXV Builder

For now, it can be a placeholder link or a clearly marked TODO if needed.

---

# Page Structure

Build a full page with sections in this approximate order:

1. Header / nav
   - SPS logo or text logo
   - simple nav anchor links if helpful
   - CTA button in header

2. Hero section
   - headline
   - subheadline
   - short supporting paragraph
   - primary CTA
   - maybe small trust-building note

3. What SPS Can Do
   - icon cards or simple feature grid

4. Real frustration / problem section
   - speak directly to the tech pain point
   - maybe a short block of copy

5. Free TXV Builder demo section
   - supporting value section
   - CTA button

6. Founder / why I’m building this
   - simple authentic section
   - grounded and personal
   - explain that I see this frustration every day and want to make the job easier

7. Waitlist form section
   - clear heading
   - clean form
   - consent language
   - submit CTA

8. Footer
   - copyright
   - contact email placeholder
   - privacy note / simple footer links if useful

---

# Design Direction

Design this page to feel:
- modern
- sharp
- mobile-friendly
- simple
- trustworthy
- rugged without being ugly

Avoid:
- overdesigned SaaS gradients everywhere
- cheesy tech illustrations
- too much fluff
- overly feminine design
- enterprise/corporate dashboard vibes

Preferred feel:
- clean typography
- strong spacing
- solid contrast
- easy-to-read buttons
- feels like a tool built for real working techs

The site should look great on mobile first.
That is critical.

---

# Technical Requirements

Please build all needed files for a deployable version of this page.

At minimum, include:
- page markup
- styling
- form handling code
- Supabase integration placeholders or working integration hooks
- environment variable guidance if needed
- README / deployment notes if helpful

If using Supabase from the front end, be careful and use the correct public anon key pattern only where appropriate.
Do not expose anything unsafe.

If form submission needs Edge Functions / serverless handling for safety, recommend that clearly.

---

# What I Want You To Produce

Please create the following:

## 1. The page itself
A complete landing page implementation.

## 2. A recommended file structure
Keep it simple and deployable.

## 3. Supabase schema recommendation
Recommend the best short-term table for collecting waitlist signups.
Provide SQL if appropriate.

## 4. Form submission plan
Explain the best practical approach for submitting the form and storing data.

## 5. GitHub Pages deployment notes
Explain any adjustments needed for GitHub Pages hosting.

## 6. Clear TODO markers
Wherever real domain, Supabase keys, TXV Builder link, or contact email are needed.

---

# If You Need To Choose, Prioritize This Order

1. Simplicity
2. Fast deployment
3. Trustworthy design
4. Mobile usability
5. Easy waitlist data capture
6. Future compatibility with SPS / Supabase accounts

---

# Strong Preference

Do not just give me mockup code snippets.
Actually scaffold the page in a way I can use.

If you think a plain static page + Supabase Edge Function is the cleanest path, do that.
If you think a different quick-launch path is better, explain why.

But keep the implementation **practical for me to ship quickly**.

