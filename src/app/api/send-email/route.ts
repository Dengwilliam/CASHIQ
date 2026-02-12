import { Resend } from 'resend';
import { NextResponse } from 'next/server';

// IMPORTANT: You must configure this with an API key from resend.com
// and store it in your .env file.
const resend = new Resend(process.env.RESEND_API_KEY);

// IMPORTANT: You must have a verified domain with Resend to use this email address.
// Replace this with your own sending address.
const fromEmail = 'CapitalQuiz Challenge <noreply@yourdomain.com>';

export async function POST(request: Request) {
  try {
    const { to, subject, htmlBody } = await request.json();

    if (!process.env.RESEND_API_KEY) {
        console.error('RESEND_API_KEY is not set. Email will not be sent.');
        // Fail silently on the server so the client-side experience isn't broken.
        return NextResponse.json({ message: 'Email server not configured.' });
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
