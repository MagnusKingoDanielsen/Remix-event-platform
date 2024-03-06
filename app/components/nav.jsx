import { useLoaderData, Link, Form, useLocation } from "@remix-run/react";
import logo from "../img/GatheringsLogo.png";

export default function Nav() {
  const { session } = useLoaderData();
  const page = useLocation().pathname;
  return (
    <>
      {page === "/login" || page === "/signup" ? null : (
        <nav>
          <div className="navLinks">
            <div className="logo">
              <img src={logo} alt="logo" />
            </div>
            <div className="mainLinks">
              <a href="/gatherings">Gatherings</a>
              <a href="/createGatherings">Create a gathering</a>
              <a href="/myGatherings">My gatherings</a>
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
