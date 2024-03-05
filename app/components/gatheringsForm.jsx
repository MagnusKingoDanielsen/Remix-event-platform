import { useFetcher } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";

export default function gatheringsForm({ post = {} }) {
  const [image, setImage] = useState(post?.imageUrl ? post?.imageUrl : null);
  const fetcher = useFetcher();
  const descriptionareaRef = useRef(null);
  const isIdle = fetcher.state === "idle";
  const isInit = isIdle && fetcher.data == null;
  const dateValue = post.date
    ? new Date(post.date).toISOString().split("T")[0]
    : "";

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
      descriptionareaRef.current.focus();
    }
  }, [isInit, isIdle]);

  return (
    <fetcher.Form
      method="post"
      className="AddForm"
      encType="multipart/form-data"
    >
      <fieldset disabled={fetcher.state !== "idle"} className="fieldset">
        <div className="title">
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Gathering title"
            required
            defaultValue={post?.title}
          />
        </div>
        <div className="dateAndTime">
          <div className="datePicker">
            {/* Date picker */}
            <input
              type="date"
              id="date"
              name="date"
              required
              defaultValue={dateValue}
            />
          </div>
          <div className="timePicker">
            {/* Time picker */}
            <input
              type="time"
              id="startTime"
              name="startTime"
              required
              defaultValue={post?.startTime}
            />
            <input
              type="time"
              id="endTime"
              name="endTime"
              required
              defaultValue={post?.endTime}
            />
          </div>
        </div>
        <div className="place">
          <input
            type="text"
            id="place"
            name="place"
            placeholder="Place"
            required
            defaultValue={post?.place}
          />
        </div>
        <div className="">
          <label className="" htmlFor="file_input">
            Image
          </label>
          <input
            className=""
            name="image"
            type="file"
            onChange={handleImageChange}
          />
          {image && <img src={image} alt="" className="" width={400} />}
        </div>
        <div className="description">
          <textarea
            id="description"
            name="description"
            ref={descriptionareaRef}
            placeholder="Whats the gathering for/about?"
            defaultValue={post?.description}
            required
          />
        </div>
        <button type="submit" disabled={fetcher.state === "submitting"}>
          {fetcher.state !== "idle" ? "Saving..." : "Save"}
        </button>
      </fieldset>
    </fetcher.Form>
  );
}
