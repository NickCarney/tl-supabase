import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { message } = await request.json();
  console.log("Message to send:", message);
  try {
    const { data, error } = await resend.emails.send({
      from: "Nick <contratos@mesawallet.io>",
      to: ["nick12uvm@gmail.com"],
      subject: "Test email",
      html: `<p>Hi. This is a mcp test.</p></br><p>${message}</p>`,
    });

    if (error) {
      return new Response(JSON.stringify({ error }), { status: 400 });
    }
    console.log("Email sent successfully:", data);
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("Resend error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
