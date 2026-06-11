import type { Tag } from "../types";
import { db } from "./store";

export const tagRepository = {
  all(): Tag[] {
    return db.tags;
  },

  insert(tag: Tag): Tag {
    db.tags.push(tag);
    return tag;
  },
};
