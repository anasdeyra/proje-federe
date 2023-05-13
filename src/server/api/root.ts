import { createTRPCRouter } from "@/server/api/trpc";
import { courseRouter } from "@/server/api/routers/course";
import { teacherRouter } from "./routers/teacher";
import { studentRouter } from "./routers/student";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  course: courseRouter,
  teacher: teacherRouter,
  student: studentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
