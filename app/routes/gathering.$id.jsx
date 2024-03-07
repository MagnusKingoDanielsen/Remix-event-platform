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
  return (
    <div className="gatheringCard">
      <div className="gatheringCardHeader">
        <img src={gathering.imageUrl} alt="gathering image" />
        <div className="gatheringCardHeaderInfo">
          <div className="gatheringCardHeaderInfoText">
            <span>{gathering.date}</span>
            <span>
              1
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
          <span className="gatheringStartTime">{gathering.startTime}</span>
          <span className="gatheringTimeSeparator"> from </span>
          <span className="gatheringEndTime">{gathering.endTime}</span>
        </div>
      </div>
    </div>
  );
}
