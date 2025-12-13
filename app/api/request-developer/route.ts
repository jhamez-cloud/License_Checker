// app/api/request-developer/route.ts
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);
const MANAGER_EMAIL = process.env.MANAGER_EMAIL;
const SENDER_EMAIL = 'onboarding@resend.dev'; // Use your verified domain email here

export async function POST(request: Request) {
    const { name, email: requesterEmail } = await request.json();

    if (!MANAGER_EMAIL) {
        return NextResponse.json({ message: "Manager email not configured." }, { status: 500 });
    }

    try {
        const data = await resend.emails.send({
            from: SENDER_EMAIL,
            to: [MANAGER_EMAIL], // Sending to the Manager
            subject: `[License Checker] New Developer Access Request: ${name}`,
            html: `<p>A new user has requested Developer access to the License Checker Portal:</p>
             <p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${requesterEmail}</p>
             <p>Please log in to the Manager Dashboard to create credentials for them.</p>`,
        });

        return NextResponse.json({ data });
    } catch (error) {
        console.error("Resend API Error:", error);
        return NextResponse.json({ error: 'Failed to send email request.' }, { status: 500 });
    }
}