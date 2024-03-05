import { useLoaderData, Link, Form, useLocation } from "@remix-run/react";

export default function Nav() {
  const { session } = useLoaderData();
  const page = useLocation().pathname;
  return (
    <>
      {page === "/login" || page === "/signup" ? null : (
        <nav>
          <div className="navLinks">
            <div className="logo">
              {/* <img src="/logo.png" alt="logo" /> */}
              <p>placeholder</p>
            </div>
            <div className="mainLinks">
              <a href="/Gatherings">Gatherings</a>
              <a href="/CreateGatherings">Create a gathering</a>
              <a href="/MyGatherings">My gatherings</a>
            </div>
            {session.user ? (
              <Form method="post">
                <button className="logoutBTN">Logout</button>
              </Form>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </div>
        </nav>
      )}
    </>
  );
}
