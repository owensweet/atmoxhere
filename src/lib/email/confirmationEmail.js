import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function confirmationEmail({ to, subject, html }) {
    return await resend.emails.send({
        from: 'atmoxhere.net',
        to,
        subject,
        html
    })
}