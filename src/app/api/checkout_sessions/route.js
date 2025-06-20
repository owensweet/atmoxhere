import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { stripe } from '@/lib/stripe/stripe.js'

export async function POST(request) {
    try {
        const headersList = await headers()
        const origin = headersList.get('origin')

        // Get the price from frontend
        const formData = await request.formData();
        const priceID = formData.get('priceID');

        if (!priceID) {
            return NextResponse.json({ error: 'Missing priceID' }, { status: 400 });
        }

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: priceID,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/?canceled=true`,
            automatic_tax: {enabled: true},
        });
        return NextResponse.redirect(session.url, 303)
    } catch (err) {
        return NextResponse.json(
            { error: err.message },
            { status: err.statusCode || 500 }
        )
    }
}