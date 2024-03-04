import { Form, redirect, useActionData } from "@remix-run/react";
import { getSession } from "../services/session.server.jsx";
import mongoose from "mongoose";
import { hashPassword } from "../services/encryption.jsx";

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
    <div className="signupContainer">
      <Form method="post">
        <input placeholder="email" name="userEmail" type="email" required />
        <input placeholder="username" name="username" type="text" required />
        <input
          placeholder="password"
          name="userPassword"
          type="password"
          required
        />
        {error && <p>{error}</p>}
        <button>Create account</button>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const { userEmail, userPassword, username } = Object.fromEntries(formData);
  //check if email is valid
  let re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (re.test(userEmail)) {
    const users = await mongoose.models.Users.find({});
    //check if email is already in use
    if (users.some((user) => user.email === userEmail)) {
      return "error", "Email already in use. Please try again.";
    }
    //check if username is already in use
    if (users.some((user) => user.username === username)) {
      return "error", "Username already in use. Please try again.";
    }
    const session = await getSession();
    session.set("user", true);
    const date = new Date().toLocaleString() + "";
    const password = await hashPassword(userPassword);
    const email = userEmail;

    return (
      await mongoose.models.Users.create({
        date,
        email,
        password,
        username,
      }),
      redirect("/login")
    );
  } else {
    return "error", "Invalid email address. Please try again.";
  }
}
