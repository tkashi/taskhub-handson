import type { Task } from "../types";
import { db } from "./store";

export const taskRepository = {
  byOwner(ownerId: string): Task[] {
    return db.tasks.filter((task) => task.ownerId === ownerId);
  },

  find(id: string): Task | undefined {
    return db.tasks.find((task) => task.id === id);
  },

  insert(task: Task): Task {
    db.tasks.push(task);
    return task;
  },

  update(id: string, patch: Partial<Task>): Task | undefined {
    const index = db.tasks.findIndex((task) => task.id === id);
    if (index === -1) return undefined;
    db.tasks[index] = { ...db.tasks[index], ...patch };
    return db.tasks[index];
  },

  remove(id: string): void {
    db.tasks = db.tasks.filter((task) => task.id !== id);
  },
};
