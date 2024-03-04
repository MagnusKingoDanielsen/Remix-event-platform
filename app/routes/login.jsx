import { Form, redirect } from "@remix-run/react";

export default function LoginPage() {
  return (
    <div className="loginContainer">
      <Form method="post">
        <input placeholder="email" name="email" type="email" />
        <input placeholder="password" name="password" type="password" />
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
    return null;
  }
}
