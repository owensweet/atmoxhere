import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { stripe } from '@/lib/stripe/stripe.js'

const SHIPPING_RATES = {
  CA: 2000,    // $20.00 domestic (Canada)
  US: 2500,    // $25.00 USA (Xpresspost USA)
  MX: 3500,    // $35.00 Mexico (Xpresspost International)
  GB: 5500,    // $55.00 United Kingdom
  FR: 5500,    // $55.00 France
  DE: 5500,    // $55.00 Germany
  IT: 6000,    // $60.00 Italy
  ES: 6000,    // $60.00 Spain
  NL: 5500,    // $55.00 Netherlands
  SE: 6000,    // $60.00 Sweden
  NO: 6000,    // $60.00 Norway
  DK: 6000,    // $60.00 Denmark
  FI: 6000,    // $60.00 Finland
  JP: 6500,    // $65.00 Japan
  KR: 6500,    // $65.00 South Korea
  SG: 6500,    // $65.00 Singapore
  AU: 6500,    // $65.00 Australia
  NZ: 6500,    // $65.00 New Zealand
  BR: 6500,    // $65.00 Brazil
  IN: 6500,    // $65.00 India
};


export async function POST(request) {
    try {
        const headersList = await headers()
        const origin = headersList.get('origin')

        // Get the price from frontend
        const formData = await request.formData();
        const priceID = formData.get('priceID');
        const shippingCountry = formData.get('shippingCountry')

        if (!priceID) {
            return NextResponse.json({ error: `Missing priceID`}, { status: 400 });
        }

        if (!SHIPPING_RATES.includes(shippingCountry) ) {
            return NextResponse.json(
                { error: "shippingCountry is not supported" },
                { status: err.statusCode || 400 }
            )
        }

        const shippingPriceUSD = SHIPPING_RATES[shippingCountry]

        const session = await stripe.checkout.sessions.create({
            shipping_address_collection: {
                allowed_countries: [
                'US', 
                'CA', 
                'GB', 
                'AU', 
                'DE', 
                'FR', 
                'IT', 
                'ES',
                'NL', 
                'SE', 
                'NO', 
                'DK', 
                'FI', 
                'JP', 
                'KR', 
                'SG', 
                'NZ', 
                'BR',
                'MX', 
                'IN', 
                ]

            },
            shipping_options: [
            {
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: {
                        amount: shippingPriceUSD,
                        currency: 'usd',
                    },
                    display_name: 'Default Shipping',
                    delivery_estimate: {
                        minimum: {
                            unit: 'business_day',
                            value: 5,
                        },
                        maximum: {
                            unit: 'business_day',
                            value: 10,
                        },
                    },
                },
            }],
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
        // Change to just reloading page when finished
        return NextResponse.json(
            { error: err.message },
            { status: err.statusCode || 500 }
        )
    }
}