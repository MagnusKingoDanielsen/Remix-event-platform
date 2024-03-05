import { redirect } from "@remix-run/react";
import { getSession } from "../services/session.server.jsx";

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.data.user) {
    return redirect("/login");
  }

  return { session: session.data };
}
export default function Gatherings() {
  return <div>Gatherings</div>;
}
