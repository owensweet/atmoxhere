import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function confirmationEmail({ to, productName }) {
    return await resend.emails.send({
        from: 'orders@atmoxhere.net', // Change to correct email later
        to,
        subject: 'Your order has been confirmed!',
        html: `
        <div style="
            font-family: 'Segoe UI', sans-serif;
            background-color: #0f0f0f;
            color: #f5f5f5;
            padding: 40px;
            border-radius: 12px;
            max-width: 700px;
            margin: auto;
            text-align: center;
            box-shadow: 0 0 25px rgba(180, 140, 280, 0.2);
        ">
            <h1 style="font-size: 24px; margin-bottom: 20px;">
            Payment confirmed for <span style="color:#a855f7;">${productName}</span>
            </h1>

            <p style="font-size: 16px; margin: 20px 0;">
            You are now a part of the Atmoxhere legacy.
            </p>

            <p style="font-size: 14px; color: #cccccc;">
            You'll receive another email when your order ships out.
            </p>

            <hr style="margin: 30px auto; border: none; border-top: 1px solid #444; width: 80%;" />

            <p style="font-size: 12px; color: #777;">
            If you have any questions, contact us at 
            <a href="mailto:orders@atmoxhere.com" style="color: #818cf8;">orders@atmoxhere.com</a>
            </p>
        </div>
        `
    })
}

export async function adminEmail({productName, customerEmail, items, shipping, paymentStatus }) {
  return await resend.emails.send({
    from: 'orders@atmoxhere.net',
    to: 'orangesoda823496@gmail.com',
    subject: 'atmoxhere order created',
    html: `
    <div>
     product: ${productName}
     customer email: ${customerEmail}
     items: ${items}
     shipping: ${shipping}
     payment status: ${paymentStatus}
    </div>
    `

  })
}

export async function jashinEmail({}) {
    return await resend.emails.send({
        // does 2 receipient emails work with resend
        from: 'orders@atmoxhere.net',
        to: 'felipebatista2k20@gmail.com, atmoxhere@gmail.com'
    })
}
