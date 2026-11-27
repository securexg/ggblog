import { EmailMessage } from "cloudflare:email";

function sanitizeHeader(value) {
  return String(value || "").replace(/[\r\n]+/g, " ").trim();
}

function buildRawEmail({ from, to, replyTo, subject, text }) {
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

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "https://inklog.pages.dev",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    if (request.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

    try {
      const body = await request.json();
      const name = sanitizeHeader(body.name);
      const email = sanitizeHeader(body.email);
      const message = String(body.message || "").trim();

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

      const fromAddress = env.FROM_EMAIL || "noreply@anshumankhullar.com";
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

      return Response.json(
        { ok: true },
        {
          headers: {
            "Access-Control-Allow-Origin": "https://inklog.pages.dev"
          }
        }
      );
    } catch (err) {
      return Response.json(
        { error: err.message || "Unable to send message right now." },
        {
          status: 500,
          headers: {
            "Access-Control-Allow-Origin": "https://inklog.pages.dev"
          }
        }
      );
    }
  }
};
