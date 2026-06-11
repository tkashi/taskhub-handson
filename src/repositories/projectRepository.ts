import type { Project } from "../types";
import { db } from "./store";

export const projectRepository = {
  all(): Project[] {
    return db.projects;
  },

  insert(project: Project): Project {
    db.projects.push(project);
    return project;
  },
};
