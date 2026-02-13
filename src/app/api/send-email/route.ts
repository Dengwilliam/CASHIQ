import { Resend } from 'resend';
import { NextResponse } from 'next/server';

// The RESEND_API_KEY is retrieved from environment variables.
// For local development, set this in your .env file.
// For production, this is set in apphosting.yaml.
const resend = new Resend(process.env.RESEND_API_KEY);

// IMPORTANT: You must have a verified domain with Resend.
// Replace `your-verified-domain.com` with the domain you have verified in your Resend account.
const fromEmail = 'CashIQ <noreply@your-verified-domain.com>';

export async function POST(request: Request) {
  try {
    const { to, subject, htmlBody } = await request.json();

    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'YOUR_RESEND_API_KEY') {
        console.warn('RESEND_API_KEY is not set or is a placeholder. Email will not be sent.');
        // Fail silently on the server so the client-side experience isn't broken,
        // but provide a clear warning in the server logs.
        return NextResponse.json({ message: 'Email server not configured. RESEND_API_KEY is missing.' }, { status: 200 });
    }

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [to],
      subject: subject,
      html: htmlBody,
    });

    if (error) {
        console.error('Resend error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error) {
        console.error('Email API error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred.' }, { status: 500 });
  }
}
