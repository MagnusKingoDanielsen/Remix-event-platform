import { useLoaderData, Link } from "@remix-run/react";
import mongoose from "mongoose";
import { getSession } from "../services/session.server.jsx";
import GatheringsForm from "../components/gatheringsForm.jsx";
import { uploadImage } from "../upload-handler.server.js";

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.data.user) {
    return redirect("/login");
  }

  return { session: session.data };
}

export default function Projekter() {
  return (
    <div className="createGathering">
      <GatheringsForm />
    </div>
  );
}

export const action = async ({ request }) => {
  const formData = await request.formData();
  const { date, title, description, place, startTime, endTime, image } =
    Object.fromEntries(formData);
  const session = await getSession(request.headers.get("cookie"));
  if (!session.data.user) {
    throw new Response("Not authenticated", { status: 401 });
  }
  const createdBy = session.data.username;
  const attending = [];
  attending.push(session.data.username);
  console.log(
    date,
    title,
    description,
    typeof attending,
    createdBy,
    place,
    startTime,
    endTime,
  );
  if (
    typeof date !== "string" ||
    typeof title !== "string" ||
    typeof description !== "string" ||
    typeof attending !== "object" ||
    typeof createdBy !== "string" ||
    typeof place !== "string" ||
    typeof startTime !== "string" ||
    typeof endTime !== "string" ||
    !image // Directly check for file presence, no need to check type
  ) {
    throw new Error("Bad request");
  }
  const imageUrl = image ? await uploadImage(image) : "";

  return await mongoose.models.Gatherings.create({
    date,
    title,
    description,
    attending,
    place,
    startTime,
    endTime,
    createdBy,
    imageUrl,
  });
};
