# P.Sonkar House Of Ventures

A Vite-powered React JavaScript site for P.Sonkar House Of Ventures.

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

The application uses React Router for `/`, `/about`, `/ventures`, and `/contact`. The main entrypoint is `src/main.jsx`.

## Scripts

```bash
npm run build
npm run preview
npm run lint
```

For production hosting, configure the host to serve `index.html` as the fallback for client-side routes.

## Contact delivery

Run the additions in `supabase/schema.sql` in the Supabase SQL editor. For direct email delivery from the contact form, add these Vite variables to `.env` from an EmailJS template configured with `to_email`:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

Without EmailJS variables, the email action opens the visitor's configured mail app. WhatsApp always opens a prefilled message addressed to the admin number saved in the Contact details tab.
