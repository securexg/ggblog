export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const website = String(body.website || "").trim();

    // Honeypot check
    if (website) {
      return Response.json({ ok: true });
    }

    const res = await fetch("https://inklog-contact.simply-plugged.workers.dev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: body.name,
        email: body.email,
        message: body.message
      })
    });

    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (err) {
    return Response.json(
      { error: "Unable to send message right now. Please try again later." },
      { status: 500 }
    );
  }
}
