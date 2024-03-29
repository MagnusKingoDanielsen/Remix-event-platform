import { mongoose } from "mongoose";

const { Schema } = mongoose;

const gatheringsSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    attending: {
      type: Array,
      required: true,
    },
    place: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  // Automatically add `createdAt` and `updatedAt` timestamps:
  // https://mongoosejs.com/docs/timestamps.html
  { timestamps: true },
);
const userSchema = new Schema(
  {
    date: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    eventsJoined: {
      type: Array,
      required: false,
    },
    eventsCreated: {
      type: Array,
      required: false,
    },
  },
  // Automatically add `createdAt` and `updatedAt` timestamps:
  // https://mongoosejs.com/docs/timestamps.html
  { timestamps: true },
);
// For each model you want to create, please define the model's name, the
// associated schema (defined above), and the name of the associated collection
// in the database (which will be created automatically).
export const models = [
  {
    name: "Gatherings",
    schema: gatheringsSchema,
    collection: "gatherings",
  },
  {
    name: "Users",
    schema: userSchema,
    collection: "users",
  },
];
