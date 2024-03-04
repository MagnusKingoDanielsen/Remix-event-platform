import { Form, redirect, useActionData } from "@remix-run/react";
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
    return redirect("/");
  } else {
    return "error", "Invalid email or password";
  }
}
