import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import mongoose from "mongoose";

export async function loader() {
  const entries = await mongoose.models.Events.find({});
  return json({ entries });
}

export default function Index() {
  const { entries } = useLoaderData();

  return <div className=""></div>;
}
