import { useFetcher, useLocation } from "@remix-run/react";
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
      descriptionareaRef.current.focus();
    }
  }, [isInit, isIdle]);

  return (
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
            placeholder="Gathering title"
            required
            defaultValue={post?.title}
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
              required
              defaultValue={dateValue}
            />
          </div>
          {/* Time picker */}
          <div>
            <label htmlFor="startTime">Start time</label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              required
              defaultValue={post?.startTime}
            />
          </div>
          <div>
            <label htmlFor="endTime">End time</label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              required
              defaultValue={post?.endTime}
            />
          </div>
        </div>
        <div>
          <label htmlFor="place">Place</label>
          <input
            type="text"
            id="place"
            name="place"
            placeholder="Where is the event taking place?"
            required
            defaultValue={post?.place}
          />
        </div>
        <div>
          <label htmlFor="file_input">Add an image</label>
          <input name="image" type="file" onChange={handleImageChange} />
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
          />
        </div>
        <button type="submit" disabled={fetcher.state === "submitting"}>
          {fetcher.state !== "idle" ? "Saving..." : "Save"}
        </button>
      </fieldset>
    </fetcher.Form>
  );
}
