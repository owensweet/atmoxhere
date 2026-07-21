import { redirect } from 'next/navigation'
import { stripe } from '@/lib/stripe/stripe.js'

// display-only. the order write, stock decrement, and emails now happen in the
// stripe webhook (src/app/api/webhooks/stripe/route.js) so they run even if the
// buyer never lands here. do not add any writes to this page.
export default async function Success({ searchParams }) {
  const { session_id } = await searchParams

  if (!session_id) {
    throw new Error('missing stripe checkout session_id')
  }

  const session = await stripe.checkout.sessions.retrieve(session_id)

  const status = session.status
  const customerEmail = session.customer_details?.email

  if (status === 'open') {
    return redirect('/')
  }

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
