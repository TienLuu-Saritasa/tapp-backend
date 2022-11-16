import mongoose from 'mongoose';
import { User } from '../../interfaces/auth';

const userSchema = new mongoose.Schema<User>({
  email: String,
  password: String,
});

export const UserModel = mongoose.model<User>('User', userSchema, 'users');
