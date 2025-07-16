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
            shipping_address_collection: {
                allowed_countries: ['US', 'CA', 'JP']
            },
            shipping_options: [
            {
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: {
                        amount: 0,
                        currency: 'usd',
                    },
                    display_name: 'Free shipping',
                    delivery_estimate: {
                        minimum: {
                        unit: 'business_day',
                        value: 5,
                        },
                        maximum: {
                        unit: 'business_day',
                        value: 7,
                        },
                    },
                },
            }
                {
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: {
                    amount: 1500,
                    currency: 'usd',
                    },
                    display_name: 'Next day air',
                    delivery_estimate: {
                    minimum: {
                        unit: 'business_day',
                        value: 1,
                    },
                    maximum: {
                        unit: 'business_day',
                        value: 1,
                    },
                    },
                },
            },
            ],
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