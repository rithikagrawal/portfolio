# 🚀 Dev Portfolio — Angular 17

A production-ready, animated portfolio website for software developers. Dark tech-noir aesthetic with cutting-edge animations, custom cursor, particle effects, and full contact form integration.

---

## ✨ Features

- **Animated UI** — Custom cursor, particle background, scroll reveal, typewriter effect, floating code card
- **Full Sections** — Hero, About, Skills, Experience, Projects, Contact, Footer
- **Contact Integration** — EmailJS form with budget/timeline fields, real-time validation
- **Netlify Ready** — `netlify.toml` + `_redirects` configured for SPA routing
- **Responsive** — Mobile-first, works on all screen sizes
- **Performance** — Lazy loading, optimized assets, CDN fonts
- **SEO** — Meta tags, Open Graph, Twitter Card

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Angular 17 (Standalone Components) |
| Styling | SCSS with CSS Variables |
| Animations | CSS Keyframes + IntersectionObserver |
| Contact | EmailJS |
| Icons | Font Awesome 6 |
| Fonts | Syne + DM Mono + Instrument Serif |
| Hosting | Netlify |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Angular CLI 17+

### Install

```bash
npm install -g @angular/cli@17
npm install
```

### Development

```bash
ng serve
# Open http://localhost:4200
```

### Production Build

```bash
npm run build:prod
# Output: dist/dev-portfolio/browser/
```

---

## ⚙️ Configuration

### 1. Personal Info
Edit these files with your information:

**`src/app/services/portfolio.service.ts`**
- Projects, skills, experience, social links

**`src/app/components/hero/hero.component.ts`**
- Roles, stats

**`src/app/components/about/about.component.html`**
- Bio text, location

**`src/app/components/contact/contact.component.ts`**
- Email address, contact details

**`src/index.html`**
- Page title, meta description

### 2. EmailJS Setup (Contact Form)

1. Create account at [emailjs.com](https://emailjs.com)
2. Add an Email Service (Gmail, Outlook, etc.)
3. Create an Email Template with these variables:
   - `{{from_name}}`, `{{from_email}}`, `{{subject}}`, `{{message}}`
   - `{{budget}}`, `{{timeline}}`, `{{to_name}}`, `{{reply_to}}`
4. Update `src/app/services/contact.service.ts`:

```typescript
private emailjsServiceId = 'service_XXXXXXX';
private emailjsTemplateId = 'template_XXXXXXX';
private emailjsPublicKey = 'YOUR_PUBLIC_KEY';
```

### 3. Add Your Photo
Replace the avatar placeholder in `about.component.html`:
```html
<!-- Replace .avatar-placeholder with: -->
<img src="assets/images/profile.jpg" alt="Rithik Agrawal" class="profile-photo">
```

### 4. Add Resume PDF
Place your resume at: `src/assets/rithik-agrawal-resume.pdf`

---

## 🌐 Deploy to Netlify

### Option A: Netlify CLI
```bash
npm install -g netlify-cli
npm run build:prod
netlify deploy --prod --dir=dist/dev-portfolio/browser
```

### Option B: Git Integration (Recommended)
1. Push code to GitHub/GitLab
2. Go to [netlify.com](https://netlify.com) → New site from Git
3. Build command: `npm run build:prod`
4. Publish directory: `dist/dev-portfolio/browser`
5. Deploy!

### Option C: Drag & Drop
1. `npm run build:prod`
2. Drag `dist/dev-portfolio/browser` folder to Netlify dashboard

> **Note:** `netlify.toml` is pre-configured for SPA routing and caching.

---

## 🎨 Customization

### Color Scheme
Edit CSS variables in `src/styles.scss`:

```scss
:root {
  --accent-primary: #00d4ff;    /* Cyan - primary accent */
  --accent-secondary: #7c3aed;  /* Purple - secondary accent */
  --accent-tertiary: #f59e0b;   /* Amber - highlights */
  --bg-primary: #080c10;        /* Main background */
}
```

### Add a New Project
In `portfolio.service.ts`, add to `getProjects()`:

```typescript
{
  id: 7,
  title: 'Your Project',
  description: 'Short description',
  longDescription: 'Detailed description...',
  tech: ['Python', 'React'],
  github: 'https://github.com/...',
  demo: 'https://...',
  image: 'project-image',
  featured: true,
  category: 'fullstack'
}
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── navbar/          # Fixed navigation + mobile menu
│   │   ├── hero/            # Landing section with typewriter
│   │   ├── about/           # Bio, tech stack, resume CTA
│   │   ├── skills/          # Animated skill bars with filtering
│   │   ├── experience/      # Timeline with tab navigation
│   │   ├── projects/        # Portfolio grid with filtering
│   │   ├── contact/         # Contact form with EmailJS
│   │   └── cursor/          # Custom cursor component
│   ├── models/              # TypeScript interfaces
│   ├── services/
│   │   ├── portfolio.service.ts   # All portfolio data
│   │   ├── contact.service.ts     # EmailJS integration
│   │   └── animation.service.ts  # Scroll reveal & animations
│   ├── app.component.*      # Root component
│   ├── app.config.ts        # App configuration
│   └── app.routes.ts        # Router config
├── assets/                  # Images, resume PDF
├── environments/            # Dev/prod config
├── styles.scss              # Global styles & design tokens
└── index.html               # HTML shell with SEO tags
```

---

## 🔌 Integrations

| Integration | Purpose | Setup |
|-------------|---------|-------|
| **EmailJS** | Contact form emails | Add API keys to contact.service.ts |
| **Font Awesome** | Icons | CDN, no setup needed |
| **Google Fonts** | Typography | CDN, no setup needed |
| **Netlify** | Hosting + Forms | Deploy via Git |

### Optional: Netlify Forms (No EmailJS needed)
Add `netlify` attribute to the form tag and remove EmailJS calls:
```html
<form name="contact" method="POST" data-netlify="true">
```

### Optional: Cal.com Booking
Add a scheduling button in the contact section:
```html
<a href="https://cal.com/yourname" target="_blank" class="btn-outline">
  Schedule a Call
</a>
```

---

## 📊 Analytics (Optional)

Add to `index.html` before `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>

<!-- Plausible (privacy-friendly) -->
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

---

## 📜 License
MIT — Free to use and modify for personal portfolios.

---

*Built with ❤️ and too much coffee.*
