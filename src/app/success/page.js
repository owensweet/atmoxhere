import { redirect } from 'next/navigation'
import { stripe } from '@/lib/stripe/stripe.js'
import { confirmationEmail } from '@/lib/email/confirmationEmail'

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams

  if (!session_id) {
    throw new Error('missing session_id')  
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent'],
  })

  const status = session.status
  const customerEmail = session.customer_details?.email
  const lineItems = session.line_items?.data || []
  const productName = lineItems[0]?.description || 'your product'

  if (status === 'open') {
    return redirect('/')
  }

  if (status === 'complete' && customerEmail) {
    await confirmationEmail({
        to: customerEmail,
        productName: productName,
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