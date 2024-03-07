import { redirect, useLoaderData } from "@remix-run/react";
import mongoose from "mongoose";
import { getSession } from "../services/session.server.jsx";
import GatheringsForm from "../components/gatheringsForm.jsx";
import { uploadImage } from "../upload-handler.server.js";

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

  return { gathering };
}

export default function GatheringEdit() {
  const { gathering } = useLoaderData();
  return (
    <div className="createGathering">
      <GatheringsForm post={gathering} />
    </div>
  );
}

export const action = async ({ request, params }) => {
  // const { gathering } = useLoaderData();

  const formData = await request.formData();
  const { date, title, description, place, startTime, endTime, image } =
    Object.fromEntries(formData);
  const session = await getSession(request.headers.get("cookie"));
  if (!session.data.user) {
    throw new Response("Not authenticated", { status: 401 });
  }
  if (
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
  }
  return redirect(`/gathering/${params.id}`);
};
