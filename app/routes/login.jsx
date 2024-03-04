import { Form, redirect, useActionData } from "@remix-run/react";
import { commitSession, getSession } from "../services/session.server.jsx";

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.data.user) {
    return redirect("/");
  }
  return session.data;
}

export default function LoginPage() {
  const error = useActionData();
  return (
    <div className="loginContainer">
      <Form method="post">
        <input placeholder="email" name="email" type="email" required />
        <input
          placeholder="password"
          name="password"
          type="password"
          required
        />
        {error && <p>{error}</p>}
        <button>Log in</button>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const { email, password } = Object.fromEntries(formData);

  if (email === "test@test.dk" && password === "test") {
    const session = await getSession();
    session.set("user", true);
    return redirect("/", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  } else {
    return "error", "Invalid email or password";
  }
}
