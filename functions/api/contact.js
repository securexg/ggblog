import { EmailMessage } from "cloudflare:email";

function sanitizeHeader(value) {
  return String(value || "").replace(/[\r\n]+/g, " ").trim();
}

function buildRawEmail({ from, to, replyTo, subject, text }) {
  const boundary = `----inklog-${Date.now()}`;
  return [
    `From: Inklog Contact <${from}>`,
    `To: <${to}>`,
    `Reply-To: ${replyTo}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/plain; charset="utf-8"`,
    ``,
    text
  ].join("\r\n");
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const name = sanitizeHeader(body.name);
    const email = sanitizeHeader(body.email);
    const message = String(body.message || "").trim();
    const website = String(body.website || "").trim();

    // Honeypot check
    if (website) {
      return Response.json({ ok: true });
    }

    if (!name || !email || !message) {
      return Response.json(
        { error: "Please fill in your name, email, and message." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const fromAddress = env.FROM_EMAIL || "noreply@inklog.pages.dev";
    const toAddress = "gauravgg.in@gmail.com";
    const raw = buildRawEmail({
      from: fromAddress,
      to: toAddress,
      replyTo: `${name} <${email}>`,
      subject: `New message from ${name} via Inklog`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`
    });

    const msg = new EmailMessage(fromAddress, toAddress, raw);
    await env.SEND_EMAIL.send(msg);

    return Response.json({ ok: true });
  } catch (err) {
    return Response.json(
      { error: "Unable to send message right now. Please try again later." },
      { status: 500 }
    );
  }
}
