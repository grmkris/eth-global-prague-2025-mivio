import { z } from "zod/v4";

export const SHARED_TEST = "SHARED_TEST" as const;
export const TestSchema = z.object({
  name: z.string(),
});