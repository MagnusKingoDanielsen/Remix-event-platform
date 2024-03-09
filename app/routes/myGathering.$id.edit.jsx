import { redirect, useLoaderData, Form } from "@remix-run/react";
import mongoose from "mongoose";
import { getSession } from "../services/session.server.jsx";
import GatheringsForm from "../components/gatheringsForm.jsx";
import { deleteImage, uploadImage } from "../image-handler.server.js";

export async function loader({ request, params }) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.data.user) {
    return redirect("/login");
  }
  if (typeof params.id !== "string") {
    throw new Response("Not found", { status: 404 });
  }
  const gathering = await mongoose.models.Gatherings.findById(params.id)
    .lean()
    .exec();
  if (!gathering) {
    throw new Response("Not found", { status: 404 });
  }
  if (session.data.username !== gathering.createdBy) {
    throw new Response("Not authorized", { status: 403 });
  }

  return { gathering: gathering, session: session.data };
}

export default function GatheringEdit() {
  const { gathering, session } = useLoaderData();
  const user = session.username;
  function handleSubmit(e) {
    if (confirm("Are you sure?")) {
    } else {
      // User clicked "Cancel"
      e.preventDefault();
    }
  }
  return (
    <div className="editPage">
      <div className="editGathering">
        <GatheringsForm post={gathering} username={user} />
      </div>
      <div className="deleteSection">
        <Form method="post" onSubmit={handleSubmit}>
          <button
            name="_action"
            value="delete"
            type="submit"
            className="deleteBTN"
          >
            Delete gathering
          </button>
        </Form>
        <div className="spacer"></div>
      </div>
    </div>
  );
}

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const {
    _action,
    date,
    title,
    description,
    place,
    startTime,
    endTime,
    image,
  } = Object.fromEntries(formData);
  const session = await getSession(request.headers.get("cookie"));
  if (!session.data.user) {
    throw new Response("Not authenticated", { status: 401 });
  }
  const gathering = await mongoose.models.Gatherings.findById(params.id);
  if (session.data.username !== gathering.createdBy) {
    throw new Response("Not authorized", { status: 403 });
  }
  if (_action === "delete") {
    await deleteImage(gathering.imageUrl);
    await mongoose.models.Gatherings.findByIdAndDelete(params.id);

    return redirect("/myGatherings");
  } else if (
    typeof date !== "string" ||
    typeof title !== "string" ||
    typeof description !== "string" ||
    typeof place !== "string" ||
    typeof startTime !== "string" ||
    typeof endTime !== "string"
  ) {
    throw new Error("Bad request");
  }

  const imageUrl = image instanceof File ? await uploadImage(image) : image;
  // check the size of the image is over 0
  if (image.size === 0) {
    await mongoose.models.Gatherings.findByIdAndUpdate(params.id, {
      date,
      title,
      description,
      place,
      startTime,
      endTime,
    });
  } else {
    await mongoose.models.Gatherings.findByIdAndUpdate(params.id, {
      date,
      title,
      description,
      place,
      startTime,
      endTime,
      imageUrl,
    });
    await deleteImage(gathering.imageUrl);
  }
  return redirect(`/gathering/${params.id}`);
};
