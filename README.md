# House of QG: houseofqg.com

Online store for House of QG: clothing, **Fastest Finger** drops, **Black Friday** sales and everyday sales.
Built with Next.js 15, Sanity (admin at `/studio`), and Flutterwave payments.

## What makes it House of QG
- **Fastest Finger drops**: a limited piece, a short clock, first taps win. The winner is held a few minutes, **picks a size**, then pays. (Studio > ⚡ Fastest Finger drops)
- **Black Friday mode**: create a sale in *Sales & Black Friday* with "Black Friday" in the title or tag. While it is live, the whole site switches to black and gold, with a countdown banner and sale labels on pieces.
- **Fashion product pages**: size buttons, fit note, size guide page (`/size-guide`), second photo on hover, arched category tiles, size filter in the shop.
- Single brand: no sellers, no bulk quotes, no languages other than English.
- Kept from the original code: cart, Flutterwave checkout and webhook, stock countdown, coupons, reviews, order tracking, customer accounts, invoices/waybills, delivery options by state, live chat to Telegram, PWA, Google feed, sitemap.

## Contact card + QR code
`/contact` shows a digital card with a QR code. Scanning it (or tapping **Save to my contacts**) opens `/contact.vcf`, which makes the phone offer to save House of QG with phone, WhatsApp, email, address, website and social links, plus the logo as the photo. Details come from Studio > Site settings, so edit them there. The QR itself never changes (it only points at `/contact.vcf`), so printed copies keep working. Use **Download QR code** on the page for a print-ready SVG.

## Setup
1. `pnpm install` (or `npm install`).
2. Create a **new** Sanity project for House of QG (`npx sanity init` or sanity.io/manage) and a new Flutterwave account/keys. Do not reuse keys from any other store.
3. `cp .env.example .env.local` and fill it in (Sanity project id + editor token, Flutterwave secret key and webhook hash, site URL, email keys).
4. `pnpm dev`, open `/studio`, and in **Site settings** add: announcement bar, hero title (use `*asterisks*` for the italic words), hero photo, contact details, social links, delivery fees, and **your own size chart**.
5. Add pieces: name, category, photos (first two are used on cards), price, a **Size** option group (S, M, L…), optional Colour group, stock, fit note.
6. In Sanity > API > CORS add your site URL. Add the Sanity webhook and Flutterwave webhook as in `.env.example` comments (webhook URL: `https://houseofqg.com/api/webhook`).
7. Deploy to Vercel, add the same env vars, point `houseofqg.com` at it.

## Payments go to the House of QG subaccount
In Flutterwave > Settings > Subaccounts, add House of QG (its bank account), copy the subaccount ID (`RS_…`) into `FLUTTERWAVE_SUBACCOUNT_ID`. Both normal checkout and Fastest Finger payments then settle to it (naira payments). Leave it empty to settle to the main Flutterwave account.

## Running a Fastest Finger drop
Studio > ⚡ Fastest Finger drops > new: pick the piece, drop price, pieces available, start and end time, hold minutes. It appears on the home page when it starts.

## Bulk import
`node scripts/import.mjs --products import-templates/products-template.csv --images ./images --dry-run` (remove `--dry-run` to import).

## Known limits / next steps
- Stock is one total per piece, not per size. Per-size stock is the most valuable next upgrade.
- The logo is the owner's black script "House of QG" artwork, cut out with a transparent background: `public/logo-ink.png` (light pages), `logo-cream.png` (dark themes and Black Friday, swapped by CSS) and `logo-gold.png` (footer, contact card). `logo.png`, `icon-*.png`, `src/app/apple-icon.png`, `src/app/favicon.ico` use the big QG letters on bone; `public/og.png` is the link-preview image.
- Policies in `src/lib/legal.ts` are drafts: confirm the return window and rules, and have them reviewed.
- Sample size chart values are placeholders until you set your own in Studio.
