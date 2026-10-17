import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'
import { SalesDashboard } from './sanity/SalesDashboard'
export default defineConfig({
  name: 'houseofqg', title: 'House of QG Studio', basePath: '/studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!, dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  plugins: [structureTool({ structure: (S) => S.list().title('House of QG').items([
    S.documentTypeListItem('lightning').title('⚡ Fastest Finger drops'),
    S.documentTypeListItem('promo').title('🖤 Sales & Black Friday'),
    S.documentTypeListItem('product').title('Pieces (products)'),
    S.listItem().title('🆕 New in').child(S.documentList().title('Marked as New in').filter('_type=="product" && isNew==true')),
    S.divider(),
    S.documentTypeListItem('order').title('All orders'),
    S.listItem().title('📦 Orders to ship').child(S.documentList().title('Paid, not yet shipped').filter('_type=="order" && status=="paid"')),
    S.listItem().title('🛵 House of QG delivery: to dispatch').child(S.documentList().title('Paid, our own delivery').filter('_type=="order" && status=="paid" && logisticsKind=="own"')),
    S.listItem().title('⚠️ Low stock').child(S.documentList().title('Low stock (10 or fewer)').filter('_type=="product" && defined(stockUnits) && stockUnits<=10')),
    S.listItem().title('⭐ Reviews to approve').child(S.documentList().title('Waiting approval').filter('_type=="review" && approved!=true')),
    S.documentTypeListItem('review').title('All reviews'),
    S.documentTypeListItem('chatMessage').title('Chat history'),
    S.documentTypeListItem('customer').title('Customers (accounts)'),
    S.documentTypeListItem('deliveryPartner').title('Delivery options'),
    S.documentTypeListItem('coupon').title('🏷️ Discount codes'),
    S.divider(),
    S.listItem().title('Site settings').child(S.document().schemaType('siteSettings').documentId('siteSettings')),
  ]) }), visionTool()],
  tools: [{ name: 'sales', title: 'Sales', component: SalesDashboard }],
  schema: { types: schemaTypes },
})
