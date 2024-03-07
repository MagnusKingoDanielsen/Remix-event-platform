import mongoose from "mongoose";
import { useLoaderData } from "@remix-run/react";
import attendingImg from "../img/attending.png";

export async function loader({ params }) {
  const gathering = await mongoose.models.Gatherings.findById(params.id)
    .lean()
    .exec();
  console.log(gathering);
  return { gathering };
}

export default function GatheringDisplay({}) {
  const { gathering } = useLoaderData();
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
                1
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
        </div>
      </div>
    </div>
  );
}
