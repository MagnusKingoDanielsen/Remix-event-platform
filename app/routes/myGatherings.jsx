import { redirect, useLoaderData, Link, Form } from "@remix-run/react";
import { getSession } from "../services/session.server.jsx";
import mongoose from "mongoose";
import attendingImg from "../img/attending.png";

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const hostedGatherings = await mongoose.models.Gatherings.find({
    createdBy: session.data.username,
  })
    .lean()
    .exec();
  const attendingGatherings = await mongoose.models.Gatherings.find({
    attending: session.data.username,
  })
    .lean()
    .exec();
  if (!session.data.user) {
    return redirect("/login");
  }
  return {
    session: session.data,
    hostedGatherings: hostedGatherings.map((gathering) => ({
      ...gathering,
      date: new Date(gathering.date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    })),
    attendingGatherings: attendingGatherings.map((gathering) => ({
      ...gathering,
      date: new Date(gathering.date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    })),
  };
}

export default function MyGatherings() {
  const { hostedGatherings, attendingGatherings, session } = useLoaderData();
  const user = session.username;

  return (
    <div className="displayPage">
      <h1>My gatherings</h1>
      <div className="displayHosted">
        {hostedGatherings.map((gathering) => (
          <div key={gathering._id} className="gatheringCard">
            <Link to={`/gathering/${gathering._id}`}>
              <div className="gatheringCardHeader">
                <img src={gathering.imageUrl} alt="gathering image" />
                <div className="gatheringCardHeaderInfo">
                  <div className="gatheringCardHeaderInfoText">
                    <span>{gathering.date}</span>
                    <span>
                      {gathering.attending.length}
                      <img src={attendingImg} alt="Attending img" />
                      <br />
                      attending
                    </span>
                  </div>
                  <div className="gatheringCardHeaderInfoPips">
                    <div className="pip" />
                  </div>
                </div>
              </div>
              <div className="gatheringCardContent">
                <h2 className="gatheringTitle">{gathering.title}</h2>
                <p className="gatheringDescription">{gathering.description}</p>
                <div className="gatheringLocation">
                  <span className="gatheringAt">Location:</span>
                  <span className="gatheringPlace">{gathering.place}</span>
                </div>
                <div className="gatheringTimes">
                  <span className="gatheringStartTime">
                    {gathering.startTime}
                  </span>
                  <span className="gatheringTimeSeparator"> from </span>
                  <span className="gatheringEndTime">{gathering.endTime}</span>
                </div>
                <div className="gatheringAttending">
                  <span>Attending:</span>
                  <div className="AttendingSpacing">
                    <ul>
                      {gathering.attending.slice(0, 3).map((attending) => (
                        <li key={attending}>
                          {attending == gathering.createdBy ? "©" : ""}
                          {attending}
                          <span> | </span>
                        </li>
                      ))}
                    </ul>
                    {gathering.attending.length > 3 ? (
                      <p className="andMore">
                        + {gathering.attending.length - 3} more
                      </p>
                    ) : null}
                  </div>
                </div>
                <Link to={`/myGathering/${gathering._id}/edit`}>
                  <button className="editButton">Edit</button>
                </Link>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <br />
      <br />
      <h1>Attending gatherings</h1>
      <div className="displayAttending">
        {attendingGatherings.map((gathering) => (
          <div key={gathering._id} className="gatheringCard">
            <Link to={`/gathering/${gathering._id}`}>
              <div className="gatheringCardHeader">
                <img src={gathering.imageUrl} alt="gathering image" />
                <div className="gatheringCardHeaderInfo">
                  <div className="gatheringCardHeaderInfoText">
                    <span>{gathering.date}</span>
                    <span>
                      {gathering.attending.length}
                      <img src={attendingImg} alt="Attending img" />
                      <br />
                      attending
                    </span>
                  </div>
                  <div className="gatheringCardHeaderInfoPips">
                    <div className="pip" />
                  </div>
                </div>
              </div>
              <div className="gatheringCardContent">
                <h2 className="gatheringTitle">{gathering.title}</h2>
                <p className="gatheringDescription">{gathering.description}</p>
                <div className="gatheringLocation">
                  <span className="gatheringAt">Location:</span>
                  <span className="gatheringPlace">{gathering.place}</span>
                </div>
                <div className="gatheringTimes">
                  <span className="gatheringStartTime">
                    {gathering.startTime}
                  </span>
                  <span className="gatheringTimeSeparator"> from </span>
                  <span className="gatheringEndTime">{gathering.endTime}</span>
                </div>
                <div className="gatheringAttending">
                  <span>Attending:</span>
                  <div className="AttendingSpacing">
                    <ul>
                      {gathering.attending.slice(0, 3).map((attending) => (
                        <li key={attending}>
                          {attending == gathering.createdBy ? "©" : ""}
                          {attending}
                          <span> | </span>
                        </li>
                      ))}
                    </ul>
                    {gathering.attending.length > 3 ? (
                      <p className="andMore">
                        + {gathering.attending.length - 3} more
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </Link>
            <Form method="post">
              <button
                type="submit"
                className="AttendBTN"
                name="_action"
                value={gathering._id}
              >
                {gathering.attending.includes(user) == false
                  ? "Attend"
                  : "Leave"}
              </button>
            </Form>
          </div>
        ))}
      </div>
    </div>
  );
}
export const action = async ({ request }) => {
  const session = await getSession(request.headers.get("cookie"));
  if (!session.data.user) {
    throw new Response("Not authenticated", { status: 401 });
  }
  const { _action } = Object.fromEntries(await request.formData());

  const gathering = await mongoose.models.Gatherings.findById(_action);
  if (gathering.attending.includes(session.data.username)) {
    //remove user from attending
    gathering.attending = gathering.attending.filter(
      (attending) => attending !== session.data.username,
    );
    await gathering.save();
    return redirect(`/myGatherings`);
  }
};
