import { useLoaderData, redirect } from "@remix-run/react";
import { getSession, destroySession } from "../services/session.server.jsx";
import { Form, Link } from "@remix-run/react";
import mongoose from "mongoose";

export async function loader({ request }) {
  const session = await getSession(request.headers.get("cookie"));
  const entries = await mongoose.models.Events.find({});

  return { session: session.data };
}

export default function Index() {
  const { entries, session } = useLoaderData();

  return (
    <div className="">
      {session.user ? (
        <Form method="post">
          <button className="logoutBTN">Logout</button>
        </Form>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </div>
  );
}

export async function action({ request }) {
  const session = await getSession(request.headers.get("cookie"));

  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}
