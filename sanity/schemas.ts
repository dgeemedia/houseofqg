import { defineType, defineField } from 'sanity'
import { VEHICLES } from './vehicles'
const req = (r: any) => r.required()

const product = defineType({ name: 'product', title: 'Product', type: 'document', fields: [
  defineField({ name: 'name', type: 'string', validation: req }),
  defineField({ name: 'slug', type: 'slug', options: { source: 'name' }, validation: req }),
  defineField({ name: 'category', type: 'string', options: { list: ['Dresses', 'Two-piece sets', 'Co-ords', 'Tops', 'Bottoms', 'Skirts', 'Jumpsuits', 'Outerwear', 'Matching sets', 'Accessories', 'Other'] }, description: 'Shows as a category tile on the home page. Pick the closest one (add more by editing sanity/schemas.ts).' }),
  defineField({ name: 'images', type: 'array', of: [{ type: 'image', options: { hotspot: true } }], validation: (r: any) => r.required().min(1) }),
  defineField({ name: 'description', title: 'Short description', type: 'text', description: 'One or two lines about the piece: fabric, mood, occasion. Shown under the title.' }),
  defineField({ name: 'body', title: 'Full description (formatted)', type: 'array', of: [{ type: 'block' }], description: 'Headings, bullet points and bold text are supported.' }),
  defineField({ name: 'specs', title: 'Specifications', type: 'array', of: [{ type: 'object', name: 'spec', fields: [{ name: 'label', type: 'string' }, { name: 'value', type: 'string' }], preview: { select: { title: 'label', subtitle: 'value' } } }], description: 'e.g. Power = 60W, Battery = 12 hours' }),
  defineField({ name: 'options', title: 'Sizes and colours', type: 'array', of: [{ type: 'object', name: 'optionGroup', fields: [{ name: 'name', type: 'string', validation: req, description: 'e.g. Colour' }, { name: 'values', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' }, validation: req }], preview: { select: { title: 'name', subtitle: 'values' }, prepare: ({ title, subtitle }: any) => ({ title, subtitle: (subtitle || []).join(', ') }) } }], description: 'Add a group named Size (values like S, M, L, XL) and, if needed, one named Colour. The buyer must choose one of each. Name the group exactly Size so the size filter and size buttons work.' }),
  defineField({ name: 'weightKg', title: 'Weight per piece (kg)', type: 'number', description: 'Used for delivery pricing if you set per-kg rates in Site Settings.' }),
  defineField({ name: 'unitPrice', title: 'Price (₦)', type: 'number', validation: (r: any) => r.required().min(1) }),
  defineField({ name: 'dozenPrice', hidden: true, title: 'Price per pack (₦)', type: 'number', description: 'Price of one full pack (e.g. a dozen, carton or bag). Leave empty if not sold in packs.' }),
  defineField({ name: 'packSize', hidden: true, title: 'Units in one pack', type: 'number', initialValue: 12, description: '12 for a dozen. For a 50-unit carton enter 50.' }),
  defineField({ name: 'packLabel', hidden: true, title: 'Pack name', type: 'string', initialValue: 'dozen', description: 'dozen, carton, bag, basket...' }),
  defineField({ name: 'tiers', title: 'Buy more, save more (optional)', type: 'array', description: 'e.g. 2+ pieces = ₦18,000 each. The lower price applies automatically at checkout. Leave empty for none.', of: [{ type: 'object', name: 'tier', fields: [{ name: 'minUnits', title: 'From (units)', type: 'number', validation: (r: any) => r.required().min(2).integer() }, { name: 'unitPrice', title: 'Price per unit (₦)', type: 'number', validation: req }], preview: { select: { title: 'minUnits', subtitle: 'unitPrice' }, prepare: ({ title, subtitle }: any) => ({ title: `${title}+ units`, subtitle: `₦${subtitle} each` }) } }] }),
  defineField({ name: 'dispatchTime', title: 'Dispatch time', type: 'string', initialValue: 'Ships in 2-3 days', options: { list: ['Ships in 24 hours', 'Ships in 2-3 days', 'Ships in 5-7 days', 'Made to order: 7-14 days'] }, description: 'Shown on the product page. Be honest: it is a promise to the customer.' }),
  defineField({ name: 'warrantyMonths', hidden: true, title: 'Warranty (months)', type: 'number', description: 'Shown as a warranty badge. Empty = no badge.' }),
  defineField({ name: 'soldUnits', title: 'Units sold (automatic)', type: 'number', readOnly: true, description: 'Counts up on each paid order. Shown on the product card.' }),
  defineField({ name: 'stockUnits', title: 'Pieces in stock (all sizes together)', type: 'number', description: 'Optional. Counts down automatically as orders are paid. This is a single total for the piece, not per size. Empty = not tracked.' }),
  defineField({ name: 'active', type: 'boolean', initialValue: true, description: 'Untick to hide from the store' }),
  defineField({ name: 'isNew', title: 'New in', type: 'boolean', description: 'Shows a NEW label on the piece.' }),
  defineField({ name: 'fitNote', title: 'Fit note', type: 'string', description: 'One line shown by the size buttons, e.g. Runs small, size up. Model is 5\'8" wearing S.' }),
  defineField({ name: 'featured', type: 'boolean', description: 'Featured pieces come first in the shop and in the hero.' }),
], preview: { select: { title: 'name', subtitle: 'category', media: 'images.0' } } })

const promo = defineType({ name: 'promo', title: 'Sale / Black Friday', type: 'document', fields: [
  defineField({ name: 'title', type: 'string', validation: req, description: 'e.g. Black Friday. If the title or tag says "Black Friday", the whole site turns black and gold while the sale is live.' }),
  defineField({ name: 'badge', type: 'string', description: 'Tag shown on sale items, e.g. BLACK FRIDAY, END OF SEASON. Empty = SALE.' }),
  defineField({ name: 'startsAt', type: 'datetime', validation: req }),
  defineField({ name: 'endsAt', type: 'datetime', validation: req, description: 'Sale ends automatically at this time - nothing to switch off.' }),
  defineField({ name: 'banner', type: 'image', options: { hotspot: true } }),
  defineField({ name: 'items', type: 'array', of: [{ type: 'object', name: 'promoItem', fields: [
    { name: 'product', type: 'reference', to: [{ type: 'product' }], validation: req },
    { name: 'limitPerCustomer', title: 'Max units per customer', type: 'number', description: 'Optional cap on promo-priced units one customer (email/phone) can buy.' },
    { name: 'promoUnitPrice', title: 'Sale price (₦)', type: 'number' },
    { name: 'promoDozenPrice', title: 'Promo price per dozen (₦)', type: 'number' },
  ], preview: { select: { title: 'product.name', subtitle: 'promoUnitPrice' } } }] }),
], preview: { select: { title: 'title', subtitle: 'endsAt' } } })

const order = defineType({ name: 'order', title: 'Order', type: 'document', fields: ([
  'reference', 'name', 'email', 'phone', 'address', 'state', 'notes', 'transactionId', 'promoCode', 'promoTitle', 'claimId', 'couponCode', 'viewKey', 'lang', 'country', 'phoneNorm', 'logisticsPartner', 'logisticsPartnerId', 'logisticsKind', 'logisticsZone', 'deliveryArea', 'etaText',
].map((n) => defineField({ name: n, type: 'string', readOnly: true })) as any[]).concat([
  defineField({ name: 'status', type: 'string', options: { list: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'] } }),
  defineField({ name: 'delivery', type: 'string', options: { list: ['delivery', 'pickup'] } }),
  defineField({ name: 'deliveryFee', type: 'number', readOnly: true }),
  defineField({ name: 'total', type: 'number', readOnly: true }),
  defineField({ name: 'items', type: 'array', readOnly: true, of: [{ type: 'object', name: 'line', fields: [
    { name: 'productId', type: 'string' }, { name: 'productName', type: 'string' }, { name: 'variant', type: 'string' }, { name: 'mode', type: 'string' },
    { name: 'quantity', type: 'number' }, { name: 'price', type: 'number' }, { name: 'units', type: 'number' },
  ] }] }),
  defineField({ name: 'payCurrency', type: 'string', readOnly: true }),
  defineField({ name: 'payAmount', type: 'number', readOnly: true }),
  defineField({ name: 'whatsappOptIn', type: 'boolean', readOnly: true }),
  defineField({ name: 'discount', type: 'number', readOnly: true }),
  defineField({ name: 'shippedEmailSent', type: 'boolean', readOnly: true }),
  defineField({ name: 'restocked', type: 'boolean', readOnly: true }),
  defineField({ name: 'refunded', type: 'boolean', readOnly: true }),
  defineField({ name: 'trackingNumber', type: 'string', description: 'Courier waybill / tracking number' }),
  defineField({ name: 'carrier', title: 'Carrier / driver', type: 'string' }),
  defineField({ name: 'trackingNote', title: 'Tracking update (customer sees this)', type: 'string', description: 'e.g. Left Lagos warehouse, arriving Thursday' }),
  defineField({ name: 'createdAt', type: 'datetime', readOnly: true }),
]) as any, preview: { select: { title: 'reference', subtitle: 'status' } } })

const siteSettings = defineType({ name: 'siteSettings', title: 'Site Settings', type: 'document', fields: [
  defineField({ name: 'heroTitle', type: 'string', initialValue: 'Wear it like *you mean it.*', description: 'Words between *asterisks* are set in italic colour.' }),
  defineField({ name: 'heroImage', title: 'Hero photo (portrait)', type: 'image', options: { hotspot: true }, description: 'Large arched photo on the home page. Empty = your first featured piece.' }),
  defineField({ name: 'heroSubtitle', type: 'text' }),
  defineField({ name: 'whatsappNumber', type: 'string', description: 'International format, no +, e.g. 2348012345678' }),
  defineField({ name: 'deliveryFeeLagos', type: 'number', initialValue: 3000 }),
  defineField({ name: 'deliveryFeeOther', type: 'number', initialValue: 8000 }),
  defineField({ name: 'features', title: 'Feature switches', type: 'object', description: 'Turn a feature ON only after finishing its setup in the README. While OFF, customers see "coming soon" where it applies.', fields: [
    { name: 'phoneLogin', title: 'Phone-number login (needs SMS provider keys)', type: 'boolean', initialValue: false },
    { name: 'pdfInvoices', title: 'PDF invoice download', type: 'boolean', initialValue: false },
    { name: 'serverSearch', title: 'Server-side search and paging (for 300+ products)', type: 'boolean', initialValue: false },
    { name: 'courierLinks', title: 'Courier tracking links (add couriers below)', type: 'boolean', initialValue: false },
    { name: 'intlDelivery', title: 'International delivery (add country rates below)', type: 'boolean', initialValue: false },
    { name: 'logistics', title: 'Delivery partners at checkout (add partners under Delivery partners)', type: 'boolean', initialValue: false },
  ] }),
  defineField({ name: 'carriers', title: 'Courier tracking links', type: 'array', description: 'Use {number} where the tracking number goes, e.g. https://courier.example/track/{number}. The name must match the "Carrier / driver" you type on an order.', of: [{ type: 'object', name: 'carrier', fields: [{ name: 'name', type: 'string', validation: req }, { name: 'trackUrl', type: 'string' }], preview: { select: { title: 'name', subtitle: 'trackUrl' } } }] }),
  defineField({ name: 'intlRates', title: 'International delivery rates', type: 'array', of: [{ type: 'object', name: 'intlRate', fields: [{ name: 'country', type: 'string', validation: req }, { name: 'feeNgn', title: 'Base fee (₦)', type: 'number', validation: req }, { name: 'perKgNgn', title: 'Extra per kg (₦)', type: 'number', initialValue: 0 }], preview: { select: { title: 'country', subtitle: 'feeNgn' } } }] }),
  defineField({ name: 'currencies', title: 'Foreign currencies buyers can pay in', type: 'array', description: 'For buyers abroad (diaspora). Prices stay in naira; the charge is converted at the rate you set. Update rates yourself and add a small margin. Your Flutterwave account must have each currency enabled.', of: [{ type: 'object', name: 'currency', fields: [{ name: 'code', type: 'string', options: { list: ['USD', 'GBP', 'EUR', 'CAD'] }, validation: req }, { name: 'rateNgn', title: 'Naira per 1 unit (e.g. 1600 for USD)', type: 'number', validation: (r: any) => r.required().min(1) }], preview: { select: { title: 'code', subtitle: 'rateNgn' } } }] }),
  defineField({ name: 'vatPercent', title: 'VAT rate (%) included in prices', type: 'number', initialValue: 0, description: 'Shown on invoices as VAT included. Confirm the right rate with your accountant. 0 = no VAT line.' }),
  defineField({ name: 'perKgLagos', title: 'Extra per kg: Lagos (₦)', type: 'number', initialValue: 0, description: 'Delivery = base fee + this x total kg (set product weights). 0 = flat fee only.' }),
  defineField({ name: 'perKgOther', title: 'Extra per kg: other states (₦)', type: 'number', initialValue: 0 }),
  defineField({ name: 'freeDeliveryAbove', title: 'Free delivery above (₦)', type: 'number', description: 'Empty = never free.' }),
  defineField({ name: 'introVideo', title: 'Intro video (brand clip)', type: 'file', options: { accept: 'video/*' }, description: 'Short MP4, 8-15s. Plays once per visit with a Skip button. Empty = no intro.' }),
  defineField({ name: 'instagramUrl', title: 'Instagram link', type: 'url', validation: (r: any) => r.uri({ scheme: ['https'] }) }),
  defineField({ name: 'facebookUrl', title: 'Facebook link', type: 'url', validation: (r: any) => r.uri({ scheme: ['https'] }) }),
  defineField({ name: 'tiktokUrl', title: 'TikTok link', type: 'url', validation: (r: any) => r.uri({ scheme: ['https'] }) }),
  defineField({ name: 'xUrl', title: 'X (Twitter) link', type: 'url', validation: (r: any) => r.uri({ scheme: ['https'] }) }),
  defineField({ name: 'youtubeUrl', title: 'YouTube link', type: 'url', validation: (r: any) => r.uri({ scheme: ['https'] }) }),
  defineField({ name: 'linkedinUrl', title: 'LinkedIn link', type: 'url', validation: (r: any) => r.uri({ scheme: ['https'] }) }),
  defineField({ name: 'telegramUrl', title: 'Telegram channel link', type: 'url', validation: (r: any) => r.uri({ scheme: ['https'] }) }),
  defineField({ name: 'cacNumber', title: 'CAC registration (RC number)', type: 'string', description: 'Shown in the footer and on invoices. Leave empty if you prefer not to show it.' }),
  defineField({ name: 'sizeChart', title: 'Size chart (inches)', type: 'array', description: 'Rows of the table on the Size guide page. Replace the placeholder sizes with YOUR measurements.', of: [{ type: 'object', name: 'sizeRow', fields: [{ name: 'size', type: 'string', validation: req }, { name: 'ukSize', title: 'UK size', type: 'string' }, { name: 'bust', type: 'string' }, { name: 'waist', type: 'string' }, { name: 'hips', type: 'string' }], preview: { select: { title: 'size', subtitle: 'bust' } } }] }),
  defineField({ name: 'sizeGuideNote', title: 'Size guide note', type: 'text', description: 'Optional extra paragraph on the Size guide page, e.g. how your pieces fit.' }),
  defineField({ name: 'phone', type: 'string' }),
  defineField({ name: 'email', type: 'string' }),
  defineField({ name: 'address', type: 'string' }),
  defineField({ name: 'tickerItems', title: 'Moving banner phrases', type: 'array', of: [{ type: 'string' }], description: 'Short phrases that scroll under the header, e.g. NEW IN, FASTEST FINGER FRIDAY, FREE DELIVERY OVER ₦100,000. Empty = defaults.' }),
  defineField({ name: 'announcement', type: 'string', description: 'Thin bar at the top of the site' }),
] })

const lightning = defineType({ name: 'lightning', title: '⚡ Fastest Finger drop', type: 'document', fields: [
  defineField({ name: 'title', type: 'string', validation: req, description: 'e.g. Friday Midnight Drop: The Gold Set' }),
  defineField({ name: 'product', type: 'reference', to: [{ type: 'product' }], validation: req }),
  defineField({ name: 'dealPrice', title: 'Deal price (₦)', type: 'number', validation: req }),
  defineField({ name: 'startsAt', type: 'datetime', validation: req }),
  defineField({ name: 'endsAt', type: 'datetime', validation: req, description: 'Set 3-5 minutes after the start for a real rush.' }),
  defineField({ name: 'units', title: 'Pieces available', type: 'number', validation: (r: any) => r.required().min(1).max(500).integer(), description: 'The first fingers to tap win. One piece per person, in the size they choose after tapping.' }),
  defineField({ name: 'holdMinutes', title: 'Minutes to pay after clicking', type: 'number', initialValue: 5, validation: (r: any) => r.min(1).max(15) }),
  defineField({ name: 'codePrefix', title: 'Drop code prefix', type: 'string', initialValue: 'FF', description: 'Codes look like FF-A1B2C3 and appear on the receipt.' }),
  defineField({ name: 'active', type: 'boolean', initialValue: true }),
], preview: { select: { title: 'title', subtitle: 'endsAt' } } })

const claim = defineType({ name: 'claim', title: 'Deal Claim', type: 'document', fields: [...(['deal', 'token', 'status', 'expiresAt', 'claimedAt', 'orderId'].map((n) => defineField({ name: n, type: 'string', readOnly: true })) as any[]), defineField({ name: 'slot', type: 'number', readOnly: true })] })

const review = defineType({ name: 'review', title: 'Review', type: 'document', fields: [
  defineField({ name: 'product', type: 'reference', to: [{ type: 'product' }] }),
  defineField({ name: 'name', type: 'string' }), defineField({ name: 'rating', type: 'number', validation: (r: any) => r.min(1).max(5) }),
  defineField({ name: 'comment', type: 'text' }), defineField({ name: 'approved', type: 'boolean', initialValue: false, description: 'Tick to show on the site.' }), defineField({ name: 'createdAt', type: 'datetime' }),
], preview: { select: { title: 'name', subtitle: 'comment' } } })

const coupon = defineType({ name: 'coupon', title: 'Discount Code', type: 'document', fields: [
  defineField({ name: 'code', type: 'string', validation: req, description: 'CAPITALS, e.g. WELCOME10' }),
  defineField({ name: 'percentOff', title: '% off', type: 'number' }), defineField({ name: 'amountOff', title: '₦ off (if no %)', type: 'number' }),
  defineField({ name: 'minSubtotal', title: 'Minimum spend (₦)', type: 'number' }), defineField({ name: 'maxUses', title: 'Max total uses', type: 'number' }),
  defineField({ name: 'startsAt', type: 'datetime' }), defineField({ name: 'endsAt', type: 'datetime' }), defineField({ name: 'active', type: 'boolean', initialValue: true }),
], preview: { select: { title: 'code', subtitle: 'percentOff' } } })

const chatMessage = defineType({ name: 'chatMessage', title: 'Chat Message', type: 'document', fields: ['cid', 'sender', 'name', 'phone', 'text'].map((n) => defineField({ name: n, type: n === 'text' ? 'text' : 'string', readOnly: true })).concat([defineField({ name: 'createdAt', type: 'datetime', readOnly: true }) as any]) as any, preview: { select: { title: 'text', subtitle: 'name' } }, orderings: [{ title: 'Newest', name: 'new', by: [{ field: 'createdAt', direction: 'desc' }] }] })

const customer = defineType({ name: 'customer', title: 'Customer', type: 'document', fields: [
  defineField({ name: 'email', type: 'string', readOnly: true }), defineField({ name: 'name', type: 'string' }), defineField({ name: 'phone', type: 'string' }),
  defineField({ name: 'addresses', type: 'array', of: [{ type: 'object', name: 'addr', fields: [{ name: 'label', type: 'string' }, { name: 'address', type: 'string' }, { name: 'state', type: 'string' }], preview: { select: { title: 'label', subtitle: 'address' } } }] }),
], preview: { select: { title: 'email', subtitle: 'name' } } })

const deliveryPartner = defineType({ name: 'deliveryPartner', title: 'Delivery partner', type: 'document', fields: [
  defineField({ name: 'name', type: 'string', validation: req, description: 'e.g. House of QG delivery, or a courier company' }),
  defineField({ name: 'kind', type: 'string', initialValue: 'partner', options: { list: [{ title: 'House of QG delivery (our own riders or dispatch)', value: 'own' }, { title: 'Partner courier', value: 'partner' }] } }),
  defineField({ name: 'vehicle', title: 'Vehicle', type: 'string', options: { list: VEHICLES }, description: 'Shown to the buyer. Add one option per vehicle if prices differ (e.g. House of QG delivery - Bus and House of QG delivery - Trailer), each with its own fees and weight limits.' }),
  defineField({ name: 'active', type: 'boolean', initialValue: true, description: 'Untick to hide this option at checkout.' }),
  defineField({ name: 'sortOrder', type: 'number', initialValue: 10, description: 'Lower numbers show first.' }),
  defineField({ name: 'logo', type: 'image' }),
  defineField({ name: 'coverage', title: 'States served', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' }, description: 'e.g. Lagos, Ogun. Leave EMPTY to serve all of Nigeria.' }),
  defineField({ name: 'zones', title: 'Zones and weight bands (optional, most precise)', type: 'array', description: 'Checked top to bottom: the FIRST zone whose keywords appear in the buyer\'s state + area wins, so put specific areas (Lekki, Ikorodu) above general ones (Lagos). Zones override the plain fees below; with no zone match the plain fees apply, and if those are empty the option is unavailable.', of: [{ type: 'object', name: 'zone', fields: [
    { name: 'name', type: 'string', validation: req, description: 'e.g. Lagos Island' },
    { name: 'match', title: 'Keywords (states or areas)', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' }, validation: req, description: 'e.g. Lekki, Victoria Island, Ikoyi' },
    { name: 'fee', title: 'Base fee (₦)', type: 'number', description: 'Used when you do not add weight bands.' },
    { name: 'perKg', title: 'Extra per kg (₦)', type: 'number', description: 'Empty = use the partner\'s per-kg rate.' },
    { name: 'bands', title: 'Weight bands (instead of base fee)', type: 'array', of: [{ type: 'object', name: 'band', fields: [{ name: 'upToKg', title: 'Up to (kg)', type: 'number', validation: req }, { name: 'fee', title: 'Fee (₦)', type: 'number', validation: req }], preview: { select: { title: 'upToKg', subtitle: 'fee' }, prepare: ({ title, subtitle }: any) => ({ title: `Up to ${title} kg`, subtitle: `₦${subtitle}` }) } }], description: 'Heavier than the last band: last band fee + per-kg for the extra weight.' },
    { name: 'etaText', title: 'Delivery time for this zone', type: 'string' },
  ], preview: { select: { title: 'name', subtitle: 'fee' } } }] }),
  defineField({ name: 'feeLagos', title: 'Plain fee in Lagos (₦)', type: 'number' }),
  defineField({ name: 'feeOther', title: 'Plain fee in other states (₦)', type: 'number' }),
  defineField({ name: 'perKg', title: 'Extra per kg (₦)', type: 'number', initialValue: 0, description: 'Added to the fee using the weight set on each product.' }),
  defineField({ name: 'maxKg', title: 'Maximum weight per order (kg)', type: 'number', description: 'Empty = no limit. Heavier carts cannot choose this option.' }),
  defineField({ name: 'minKg', title: 'Minimum weight for this option (kg)', type: 'number', description: 'Only offered when the cart weighs at least this much (so a trailer is not offered for a small parcel). Empty = no minimum.' }),
  defineField({ name: 'freeAbove', title: 'Free delivery above (₦)', type: 'number' }),
  defineField({ name: 'etaText', title: 'Delivery time shown to customers', type: 'string', description: 'e.g. 1-2 days in Lagos. Be honest: it is a promise.' }),
  defineField({ name: 'trackUrl', title: 'Tracking link (optional)', type: 'string', description: 'Use {number} where the tracking number goes. Used when the Courier tracking links switch is on.' }),
], preview: { select: { title: 'name', subtitle: 'etaText', media: 'logo' } } })

export const schemaTypes = [siteSettings, product, promo, lightning, claim, order, review, coupon, customer, chatMessage, deliveryPartner]
