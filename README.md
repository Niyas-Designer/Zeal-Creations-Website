<div align="center">

<img src="./public/ZEAL%20LOGO.png" alt="ZEAL Creations Logo" width="92" />

<br />

<img src="./public/zeal-wordmark.svg" alt="ZEAL Creations" width="230" />

Design. Develop. Manufacture. Deliver.

A modern, responsive corporate website for ZEAL Creations,an integrated apparel and knitwear company based in Tiruppur, India.

<br />



<br />

Overview •Features •Technology •Setup •Structure •Deployment

</div>

🔴 Project Overview

ZEAL Creations Corporate Website is a production-ready React application created to present the company's complete apparel ecosystem—from design and product development to manufacturing, quality control, branding, retail, and final delivery.

The website is designed for:

Global and domestic buyers

Fashion brands and business partners

Retail and sourcing teams

Prospective clients

Developers maintaining or extending the platform

The application uses reusable React components, route-based navigation, responsive layouts, performance-conscious animation, WhatsApp communication, and an EmailJS-powered business enquiry workflow.

✨ Key Features

<table>
<tr>
<td width="50%" valign="top">

🏢 Corporate Experience

Premium corporate homepage

Company profile and business journey

Infrastructure and manufacturing capabilities

Ethical and sustainable sourcing content

Management team presentation

Brand and retail ecosystem showcase

</td>
<td width="50%" valign="top">

👕 Product Experience

Product collection landing page

Five collection banner categories

Pinterest-style product gallery

Men, women, kids, infant, and travel-wear categories

Lazy-loaded image support

Future-ready product image structure

</td>
</tr>

<tr>
<td width="50%" valign="top">

📱 Responsive Interface

Mobile-first layout

Tablet and laptop optimisation

Large desktop support

Responsive navigation menu

Touch-friendly controls

Horizontal overflow protection

Accessible reduced-motion handling

</td>
<td width="50%" valign="top">

💬 Business Communication

Work With Us enquiry form

EmailJS integration

Configurable receiver email

Floating WhatsApp button

Pre-filled WhatsApp enquiry

Contact information and LinkedIn access

</td>
</tr>
</table>

🎨 Design System

The interface follows ZEAL's corporate visual identity.

Element

Usage

🔴 ZEAL Red #FF0C00

Primary actions, highlights, active states

⚫ Deep Black #111111

Navigation, footer, typography, CTA surfaces

⚪ White #FFFFFF

Main backgrounds and content contrast

◻️ Soft Neutrals

Section separation, cards, borders, supporting surfaces

🖋️ Typography

Clean, modern, editorial, corporate

🎞️ Motion

Smooth transform and opacity-based animation

🧰 Technology Stack

<div align="center">



</div>

Core technologies

Technology

Responsibility

React 19

Component-based user interface

React Router DOM 7

Client-side routing

Vite 8

Development server and production bundling

Tailwind CSS 4

Responsive styling and layout utilities

EmailJS Browser SDK

Website enquiry email delivery

ESLint 9

Static analysis and code-quality checks

🗺️ Application Routes

Route

Page

/

Homepage

/about-us

About ZEAL

/design-studio

Design Studio

/products

Product Shop

/our-brand

Brand Portfolio

/services

Services

/why-zeal

Why ZEAL

/promotion-video

Promotion Video

/contact-us

Work With Us

/csr

Corporate Social Responsibility

/infrastructure

Infrastructure

/investors

Investor Information

/careers

Careers

/privacy-policy

Privacy Policy

Unknown routes are redirected to the homepage.

📁 Project Structure

zeal-website/
│
├── public/
│   ├── products/
│   │   ├── banners/
│   │   └── gallery/
│   ├── company images
│   ├── management images
│   ├── brand assets
│   ├── ZEAL LOGO.png
│   └── zeal-wordmark.svg
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── AboutCompanySection.jsx
│   │   ├── AboutZealPage.jsx
│   │   ├── BrandPartnersSection.jsx
│   │   ├── CategoryPage.jsx
│   │   ├── DesignStudioPage.jsx
│   │   ├── EthicalSustainableSourcingSection.jsx
│   │   ├── FloatingContactForm.jsx
│   │   ├── HeroCarousel.jsx
│   │   ├── ManagementTeamSection.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProductShopPage.jsx
│   │   ├── PromotionVideoPage.jsx
│   │   ├── ScrollRevealSection.jsx
│   │   ├── ScrollToTop.jsx
│   │   ├── ServicesPage.jsx
│   │   ├── SiteFooter.jsx
│   │   ├── StatsHighlightSection.jsx
│   │   ├── WhyZealPage.jsx
│   │   └── WorkWithUsPage.jsx
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .env.example
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md

🚀 Getting Started

Prerequisites

Install:

Node.js — current LTS release recommended

npm

Git

1. Clone the repository

git clone <REPOSITORY_URL>
cd zeal-website

2. Install dependencies

npm install

3. Create the environment file

macOS / Linux:

cp .env.example .env.local

Windows:

copy .env.example .env.local

4. Add EmailJS values

VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_CONTACT_RECEIVER_EMAIL=your_receiver_email

5. Start development

npm run dev

Vite will normally start the project at:

http://localhost:5173

⚙️ Available Commands

Command

Description

npm run dev

Start the Vite development server

npm run lint

Run ESLint checks

npm run build

Create the production build

npm run preview

Preview the production build locally

Before every deployment:

npm run lint
npm run build

📧 EmailJS Configuration

The business enquiry form is located at:

src/components/WorkWithUsPage.jsx

The component sends:

from_name
from_email
reply_to
to_email
company_name
phone
subject
message
submitted_at

Recommended EmailJS template fields:

To Email : {{to_email}}
Reply-To : {{reply_to}}
Subject  : New ZEAL Enquiry — {{subject}}

Security notes

Never commit .env or .env.local

Never store email passwords or OTP values in the repository

Add production environment variables in the hosting dashboard

Restart the development server after changing local variables

Redeploy after changing production variables

💬 WhatsApp Configuration

The floating WhatsApp component is located at:

src/components/FloatingContactForm.jsx

Phone numbers must include the country code without symbols or spaces:

const whatsappNumber = "919876543210";

The pre-filled message can be edited directly inside the same component.

🖼️ Product Image Management

Recommended structure:

public/
└── products/
    ├── banners/
    │   ├── new-arrivals.webp
    │   ├── men-boys.webp
    │   ├── women-girls.webp
    │   ├── infants.webp
    │   └── travel-wear.webp
    │
    └── gallery/
        ├── look-001.webp
        ├── look-002.webp
        ├── look-003.webp
        └── ...

Naming rules

✅ men-boys.webp
✅ look-001.webp
✅ new-arrivals.webp

❌ Men Boys Final.jpg
❌ Image (1).png
❌ New Final Updated Image.jpg

Use:

Lowercase filenames

Hyphens instead of spaces

Predictable numbering

Consistent file extensions

Recommended optimisation

Asset

Recommended size

Hero banner

300 KB–800 KB

Large section image

200 KB–600 KB

Product card image

100 KB–350 KB

Profile image

150 KB–500 KB

WebP is recommended for most website photography.

📱 Responsive Testing

Test all major changes at:

320px   Small mobile
375px   Standard mobile
390px   Modern mobile
430px   Large mobile
768px   Tablet portrait
1024px  Tablet landscape
1280px  Laptop
1440px  Desktop
1920px  Full HD

Check:

No horizontal scrolling

No clipped text or images

Navigation opens and closes correctly

Buttons remain accessible

Forms fit the viewport

Footer sections stack correctly

Product gallery scroll remains smooth

Animations do not stutter

🎞️ Animation Guidelines

For smooth performance:

Preferred properties:
• transform
• opacity

Avoid unnecessary continuous animation of:

• width
• height
• top
• left
• large blur
• heavy box-shadow

The website supports reduced-motion user preferences through the global CSS configuration.

🌐 Deployment

The project is compatible with static React hosting platforms such as Vercel.

Recommended Vercel settings

Framework         : Vite
Install command   : npm install
Build command     : npm run build
Output directory  : dist

Deployment workflow

git add .
git commit -m "Describe the completed update"
git push

Add all required EmailJS variables to the production project settings before deploying.

✅ Pre-Deployment Checklist

npm run lint passes

npm run build succeeds

Navigation links work

Mobile menu works

Product gallery works

WhatsApp opens the correct number

Enquiry form sends successfully

Receiver email is correct

No broken images

No horizontal overflow

Footer links work

Browser console has no errors

Production environment variables are configured

🧑‍💻 Developer Guidelines

Keep components focused and reusable

Preserve semantic HTML and accessibility labels

Use Link and NavLink for internal navigation

Use anchors for external links, email, telephone, and WhatsApp

Keep environment-specific data outside the UI code

Never edit files inside dist

Never commit node_modules

Optimise images before adding them to public

Run lint and build checks before every merge

Test responsive behaviour after every layout change

🔭 Future Enhancements

Admin panel for website content

Supabase backend integration

Product and collection management

Dynamic brand pages

Careers management

Multilingual support

SEO metadata management

Analytics and conversion tracking

Automated image optimisation

Progressive product-gallery loading

CI/CD quality checks

📄 Ownership

This website was developed for ZEAL Creations.

Branding, business content, source code, and visual assets are proprietary unless otherwise stated. Reuse or distribution requires authorisation from the project owner.

📞 Contact

<div align="center">

ZEAL Creations

Tiruppur, Tamil Nadu, India



<br />



</div>
