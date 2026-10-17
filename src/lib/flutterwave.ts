/** Sends the payment to the House of QG Flutterwave subaccount.
 *  Create the subaccount in Flutterwave > Settings > Subaccounts (bank = House of QG's account), copy its ID
 *  (it starts with RS_) and set FLUTTERWAVE_SUBACCOUNT_ID. Leave it empty and money settles to the main account.
 *  Subaccounts settle in naira, so the split is only added to NGN payments. */
export function subaccountFields(currency: string) {
  const id = (process.env.FLUTTERWAVE_SUBACCOUNT_ID || '').trim()
  return id && currency === 'NGN' ? { subaccounts: [{ id }] } : {}
}
