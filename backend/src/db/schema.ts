import mongoose from "mongoose";
import type { ISession, ITask, IUser } from "../types/index";

const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  tasks: { type: [String], default: [] },
});

export const User = mongoose.model<IUser>("User", userSchema);

const sessionSchema = new mongoose.Schema<ISession>({
  token: { type: String, required: true },
  userId: { type: String, required: true },
  expires: { type: Number, required: true },
});

export const Session = mongoose.model<ISession>("Session", sessionSchema);

const taskSchema = new mongoose.Schema<ITask>({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  status: { type: String, required: true },
  priority: String,
  createdAt: Number,
  deadline: Number,
});

export const Task = mongoose.model<ITask>("Task", taskSchema);

// cascading delete all the sessions and the tasks once the user is removed from db
userSchema.pre("findOneAndDelete", async function (next) {
  const userId = this.getFilter()._id;

  try {
    await Session.deleteMany({ userId });
    await Task.deleteMany({ userId });

    next();
  } catch (error) {
    console.error(`Error cascading deletes for user ${userId}: `, error);
  }
});
