import mongoose from 'mongoose';
import { Project } from '../../interfaces/project';

const projectSchema = new mongoose.Schema<Project>({
  name: String,
  isBookmark: {
    type: Boolean,
    default: false,
  },
});

export const ProjectModel = mongoose.model<Project>('Project', projectSchema, 'projects');
