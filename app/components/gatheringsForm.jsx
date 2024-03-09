import { useFetcher, useLocation } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";

import attendingImg from "../img/attending.png";
import placeholderImg from "../img/placeholder.jpg";

export default function gatheringsForm({ post = {}, username = {} }) {
  const [image, setImage] = useState(
    post?.imageUrl ? post?.imageUrl : placeholderImg,
  );
  const [title, setTitle] = useState(
    post?.title ? post.title : "Placeholder title",
  );
  const [date, setDate] = useState(
    post?.date
      ? new Date(post?.date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "00 000 0000",
  );
  const [description, setDescription] = useState(
    post?.description ? post?.description : "Placeholder description",
  );
  const [place, setPlace] = useState(
    post?.place ? post?.place : "Placeholder place",
  );
  const [startTime, setStartTime] = useState(
    post?.startTime ? post?.startTime : "00:00",
  );
  const [endTime, setEndTime] = useState(
    post?.endTime ? post?.endTime : "00:00",
  );
  const attending = post?.attending ? post?.attending : [];
  const createdBy = username;

  const fetcher = useFetcher();
  const descriptionareaRef = useRef(null);
  const placeRef = useRef(null);
  const titleRef = useRef(null);
  const dateRef = useRef(null);
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);
  const imageRef = useRef(null);

  const isIdle = fetcher.state === "idle";
  const isInit = isIdle && fetcher.data == null;
  const dateValue = post.date
    ? new Date(post.date).toISOString().split("T")[0]
    : "";
  const page = useLocation().pathname;

  function handleImageChange(event) {
    const file = event.target.files[0];
    if (file.size < 1000000) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Image must be less than 1MB in size.");
      event.target.value = "";
    }
  }

  // Clear the form and focus the descriptionarea after a submission
  useEffect(() => {
    if (!isInit && isIdle && descriptionareaRef.current) {
      descriptionareaRef.current.value = "";
      placeRef.current.value = "";
      titleRef.current.value = "";
      dateRef.current.value = "";
      startTimeRef.current.value = "";
      endTimeRef.current.value = "";
      imageRef.current.value = "";
      setImage(placeholderImg);
      setDate("00 000 0000");
      setTitle("Placeholder title");
      setDescription("Placeholder description");
      setPlace("Placeholder place");
      setStartTime("00:00");
      setEndTime("00:00");
      descriptionareaRef.current.focus();
    }
  }, [isInit, isIdle]);

  return (
    <>
      <fetcher.Form
        method="post"
        className="gatheringsForm"
        encType="multipart/form-data"
      >
        <fieldset disabled={fetcher.state !== "idle"} className="fieldset">
          {page === "/createGatherings" ? (
            <h1>Create gathering</h1>
          ) : (
            <h1>Edit gathering</h1>
          )}

          <div>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              ref={titleRef}
              placeholder="Gathering title"
              required
              defaultValue={post?.title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="dateAndTime">
            <div>
              {/* Date picker */}
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                ref={dateRef}
                required
                defaultValue={dateValue}
                onChange={(e) =>
                  setDate(
                    new Date(e.target.value).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }),
                  )
                }
              />
            </div>
            {/* Time picker */}
            <div>
              <label htmlFor="startTime">Start time</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                ref={startTimeRef}
                required
                defaultValue={post?.startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="endTime">End time</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                ref={endTimeRef}
                required
                defaultValue={post?.endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="place">Place</label>
            <input
              type="text"
              id="place"
              name="place"
              ref={placeRef}
              placeholder="Where is the event taking place?"
              required
              defaultValue={post?.place}
              onChange={(e) => setPlace(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="file_input">Add an image</label>
            <input
              name="image"
              type="file"
              ref={imageRef}
              {...(post.imageUrl ? { required: false } : { required: true })}
              onChange={handleImageChange}
            />
            {image && (
              <img
                src={image}
                alt="Image that (hopefully) fits with the gathering"
              />
            )}
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              ref={descriptionareaRef}
              placeholder="Whats the gathering for/about?"
              defaultValue={post?.description}
              required
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button type="submit" disabled={fetcher.state === "submitting"}>
            {fetcher.state !== "idle" ? "Saving..." : "Save"}
          </button>
        </fieldset>
      </fetcher.Form>

      <div className="gatheringCard">
        <div className="gatheringCardHeader">
          <img src={image} alt="gathering image" />
          <div className="gatheringCardHeaderInfo">
            <div className="gatheringCardHeaderInfoText">
              <span>{date}</span>
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
          <h2 className="gatheringTitle">{title}</h2>
          <p className="gatheringDescription">{description}</p>
          <div className="gatheringLocation">
            <span className="gatheringAt">Location:</span>
            <span className="gatheringPlace">{place}</span>
          </div>
          <div className="gatheringTimes">
            <span className="gatheringStartTime">{startTime}</span>
            <span className="gatheringTimeSeparator"> from </span>
            <span className="gatheringEndTime">{endTime}</span>
          </div>
          <div className="gatheringAttending">
            <span>Attending:</span>
            <ul>
              {attending.length === 0 ? (
                "©" + username
              ) : (
                <>
                  {attending.map((attending) => (
                    <li key={attending}>
                      {attending == username ? " ©" : ""}
                      {attending}
                      <span> | </span>
                    </li>
                  ))}
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
