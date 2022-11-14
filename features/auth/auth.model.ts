import * as mongoose from "mongoose";
import { User } from '../../interfaces/auth';

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

export const UserModel = mongoose.model<User & mongoose.Document>(
  "User",
  userSchema,
  "users"
);
