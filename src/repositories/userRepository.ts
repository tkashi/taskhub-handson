import type { User } from "../types";
import { db } from "./store";

export const userRepository = {
  findByApiKey(apiKey: string): User | undefined {
    return db.users.find((user) => user.apiKey === apiKey);
  },

  find(id: string): User | undefined {
    return db.users.find((user) => user.id === id);
  },

  insert(user: User): User {
    db.users.push(user);
    return user;
  },
};
