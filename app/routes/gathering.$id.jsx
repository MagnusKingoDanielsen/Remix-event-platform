import mongoose from "mongoose";
import { useLoaderData, Form, redirect } from "@remix-run/react";
import attendingImg from "../img/attending.png";
import { getSession } from "../services/session.server.jsx";

export async function loader({ params, request }) {
  const session = await getSession(request.headers.get("cookie"));
  const gathering = await mongoose.models.Gatherings.findById(params.id)
    .lean()
    .exec();
  console.log(gathering);
  return { gathering: gathering, session: session.data };
}

export default function GatheringDisplay({}) {
  const { gathering, session } = useLoaderData();
  const user = session.username;
  const newDate = new Date(gathering.date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return (
    <div className="gatheringPage">
      <div className="Container">
        <div className="img">
          <img src={gathering.imageUrl} alt="gathering image" />
          <div className="HeaderInfo">
            <div className="HeaderInfoText">
              <span>{newDate}</span>
              <span>
                {gathering.attending.length}
                <img src={attendingImg} alt="Attending img" />
                <br />
                attending
              </span>
              <div className="HeaderInfoPips">
                <div className="pip2" />
              </div>
            </div>
          </div>
        </div>
        <div className="gatheringCardContent">
          <h2 className="gatheringTitle">{gathering.title}</h2>
          <p className="gatheringDescription2">{gathering.description}</p>
          <div className="gatheringLocation">
            <span className="gatheringAt">Location:</span>
            <span className="gatheringPlace">{gathering.place}</span>
          </div>
          <div className="gatheringTimes">
            <span className="gatheringStartTime">{gathering.startTime}</span>
            <span className="gatheringTimeSeparator"> from </span>
            <span className="gatheringEndTime">{gathering.endTime}</span>
          </div>
          <div className="gatheringAttending">
            <span>Attending:</span>
            <ul>
              {gathering.attending.map((attending) => (
                <li key={attending}>
                  {attending == gathering.createdBy ? "©" : ""}
                  {attending}
                  <span> | </span>
                </li>
              ))}
            </ul>
          </div>
          <Form method="post">
            <button type="submit" className="AttendBTN">
              {gathering.attending.includes(user) == false ? "Attend" : "Leave"}
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export const action = async ({ request, params }) => {
  const session = await getSession(request.headers.get("cookie"));
  if (!session.data.user) {
    throw new Response("Not authenticated", { status: 401 });
  }
  const gathering = await mongoose.models.Gatherings.findById(params.id);
  if (gathering.attending.includes(session.data.username)) {
    //remove user from attending
    gathering.attending = gathering.attending.filter(
      (attending) => attending !== session.data.username,
    );
    await gathering.save();
    return redirect(`/gathering/${params.id}`);
  }
  gathering.attending.push(session.data.username);
  await gathering.save();
  return redirect(`/gathering/${params.id}`);
};
