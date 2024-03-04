import { Form, redirect, useActionData } from "@remix-run/react";
import { commitSession, getSession } from "../services/session.server.jsx";
import { login } from "~/services/encryption.server.jsx";

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

  if (!(await login(email, password))) {
    return "error", "Invalid email or password";
  }
  const session = await getSession();
  session.set("user", true);
  return redirect("/", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}
