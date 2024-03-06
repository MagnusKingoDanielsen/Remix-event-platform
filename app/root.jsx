import {
  Links,
  Link,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  redirect,
} from "@remix-run/react";
import styles from "./main.css";
import Nav from "../app/components/nav.jsx";
import { getSession, destroySession } from "../app/services/session.server.jsx";

export const links = () => [
  {
    rel: "stylesheet",
    href: styles,
  },
];
export async function loader({ request }) {
  const session = await getSession(request.headers.get("cookie"));

  return { session: session.data };
}

export function meta() {
  return [{ title: "Work Journal" }];
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content=" width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Nav />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
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
