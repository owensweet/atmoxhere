import { redirect } from 'next/navigation'
import { stripe } from '@/lib/stripe/stripe.js'
import { confirmationEmail } from '@/lib/email/confirmationEmail'
import Firestore from '@/lib/firebase/Firestore';
import { increment } from 'firebase/firestore'

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams
  const firebase = new Firestore()

  if (!session_id) {
    throw new Error('missing stripe checkout session_id')  
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent'],
  })

  const status = session.status
  const customerEmail = session.customer_details?.email
  const lineItems = session.line_items?.data || []
  const productName = lineItems[0]?.description || 'your product'
  // get shipping details here

  if (status === 'open') {
    return redirect('/')
  }

  if (status === 'complete' && customerEmail) {
    const orderData = {
      customerEmail,
      sessionI: session.id,
      amountTotal: session.amount_total,
      currency: session.currency,
      lineItems: lineItems.map((item) => ({
        name: item.description,
        quantity: item.quantity,
        price: item.price?.unit_amount,
        currency: item.price?.currency,
      })),
      shipping: session.customer_details?.address || null,
      paymentStatus: session.payment_status,
  };

    await firebase.addOrder(orderData)

    for (const item of lineItems) {
      const priceId = item.price?.id
    quantity = item.quantity ?? 1

      if (priceId) {
        await firebase.decrementStock(priceId, quantity)
      }
    }
    
    await confirmationEmail({
      to: customerEmail,
      productName: productName,
    })

    await adminEmail({
      productName: productName,
      customerEmail: customerEmail,
      items: lineItems,
      shipping: shipping,
      paymentStatus: payment_status

    })
    // await jashinEmail({
      // to: customerEmail,   // going to need customer info, order info, shipping stuff, size, color all that
      // })

    return (
      <section id="success">
        <p>
          We appreciate your business! A confirmation email will be sent to{' '}
          {customerEmail}. If you have any questions, please email{' '}
        </p>
        <a href="mailto:orders@atmoxhere.com">orders@atmoxhere.com</a>.
      </section>
    )
  }
}
