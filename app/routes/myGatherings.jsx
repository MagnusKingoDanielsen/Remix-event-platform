import { redirect, useLoaderData, Link, Form } from "@remix-run/react";
import { getSession } from "../services/session.server.jsx";
import mongoose from "mongoose";
import attendingImg from "../img/attending.png";

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const gatherings = await mongoose.models.Gatherings.find({
    createdBy: session.data.username,
  })
    .lean()
    .exec();
  if (!session.data.user) {
    return redirect("/login");
  }
  return {
    session: session.data,
    gatherings: gatherings.map((gathering) => ({
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
  const { gatherings } = useLoaderData();
  console.log(gatherings);

  return (
    <div className="displayPage">
      <h1>Gatherings</h1>
      <div className="displayGatherings">
        {gatherings.map((gathering) => (
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
    </div>
  );
}
