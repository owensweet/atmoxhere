import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/stripe.js'
import { confirmationEmail, adminEmail } from '@/lib/email/confirmationEmail'
import Firestore from '@/lib/firebase/Firestore'

// stripe signs each webhook; we verify it against this secret so nobody can
// fake a "payment completed" call to our server
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request) {
    const firebase = new Firestore()

    // signature verification needs the exact raw body, not parsed json
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    let event
    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message)
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
        // the event's session is thin — re-fetch it with the line items expanded
        const session = await stripe.checkout.sessions.retrieve(event.data.object.id, {
            expand: ['line_items', 'payment_intent'],
        })

        // idempotency: if we already recorded this session, stop here so a
        // stripe retry can't create a duplicate order or decrement stock twice
        if (await firebase.orderExists(session.id)) {
            return NextResponse.json({ received: true, duplicate: true })
        }

        const customerEmail = session.customer_details?.email
        const lineItems = session.line_items?.data || []
        const productName = lineItems[0]?.description || 'your product'

        const orderData = {
            sessionId: session.id,
            customerEmail,
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
            fulfillment: 'unfulfilled',
        }

        // order id = session id, so refires overwrite the same doc
        await firebase.setOrder(session.id, orderData)

        for (const item of lineItems) {
            const priceId = item.price?.id
            const quantity = item.quantity ?? 1
            if (priceId) {
                await firebase.decrementStock(priceId, quantity)
            }
        }

        await confirmationEmail({ to: customerEmail, productName })
        await adminEmail({
            productName,
            customerEmail,
            items: lineItems.map((i) => `${i.description} x${i.quantity}`).join(', '),
            shipping: JSON.stringify(session.customer_details?.address || {}),
            paymentStatus: session.payment_status,
        })
    }

    return NextResponse.json({ received: true })
}
