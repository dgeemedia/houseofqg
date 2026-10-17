/** Draft policies for House of QG. Have a lawyer review them, and edit the return window, exchange rules and delivery times to match how the business really runs. */
export const LEGAL: Record<string, { title: string; sections: [string, string][] }> = {
  terms: { title: 'Terms & Conditions', sections: [
    ['About us', 'House of QG (houseofqg.com) is a Nigerian fashion brand. By placing an order you agree to these terms.'],
    ['Products and prices', 'Prices are in Nigerian naira. Colours can look slightly different on different screens. We may correct pricing errors and will tell you before shipping if your order is affected. Sales, Black Friday offers and Fastest Finger drops run for the stated time and while stock lasts.'],
    ['Orders and payment', 'An order is confirmed only after payment is received. Payments are processed by Flutterwave; we never see or store your card details. Fastest Finger pieces are held for you for the time shown and released to the next person if you do not pay in time.'],
    ['Delivery', 'We deliver to the address you give us. Delivery fees and times are shown at checkout and are estimates. Please check your address and phone number: a courier must be able to reach you.'],
    ['Returns and exchanges', 'See our Returns & Exchanges policy.'],
    ['Liability', 'To the extent permitted by Nigerian law, our liability is limited to the price paid for the item concerned. Nothing here limits rights you have under law.'],
    ['Governing law', 'These terms are governed by the laws of the Federal Republic of Nigeria.'],
  ] },
  privacy: { title: 'Privacy Policy', sections: [
    ['What we collect', 'Name, phone, email, delivery address and order details when you buy; messages you send through our live chat; account details and saved addresses if you create an account; and, with your consent, anonymous site usage data.'],
    ['Why we use it', 'To process and deliver orders, send receipts and shipping updates, provide support, prevent fraud and meet legal obligations.'],
    ['Who we share it with', 'Service providers that help us run the store: Flutterwave (payments), Resend and Brevo (email), Sanity (our database), Vercel (hosting), Telegram (live chat), Meta WhatsApp (order updates you opt into) and delivery partners. We do not sell your data.'],
    ['Cookies and analytics', 'Analytics cookies load only after you accept. You can decline and still use the whole site.'],
    ['Your rights', 'Under the Nigeria Data Protection Act 2023 you may ask to access, correct or delete your data, or object to its use. You can delete your saved account data yourself from the My account page, or contact us using the details in the footer.'],
    ['Retention', 'We keep order records as long as needed for accounting and legal reasons.'],
  ] },
  returns: { title: 'Returns & Exchanges', sections: [
    ['Check your size first', 'Use the size guide and the fit notes on each piece. If you are between sizes or unsure, message us before you order.'],
    ['Wrong, faulty or damaged items', 'Contact us within 48 hours of delivery with your order reference and photos. We will exchange, repair or refund the item.'],
    ['Exchanges and change of mind', 'Unworn items with the tags still attached may be exchanged within 7 days of delivery, subject to stock. Delivery for an exchange is paid by the buyer unless the item was faulty or wrong.'],
    ['What we cannot take back', 'Worn, washed or altered items, underwear and swimwear, accessories marked final sale, and items bought in a Fastest Finger drop or clearance sale unless faulty.'],
    ['Refunds', 'Approved refunds go back to the original payment method and can take several business days to reach you.'],
  ] },
}
