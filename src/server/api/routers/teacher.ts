import { z } from "zod";
import { createTRPCRouter, publicProcedure, teacherProcedure } from "../trpc";

export const teacherRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const teachers = await ctx.prisma.user.findMany({
      where: {
        role: "TEACHER",
      },
    });
    return teachers;
  }),
  getTeacherCourses: teacherProcedure
    .input(
      z
        .object({
          teacherId: z.string(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const id = input?.teacherId ?? ctx.session.user.id;
      const courses = await ctx.prisma.course.findMany({
        where: {
          OR: [
            { adminId: id },
            { tdTeacherId: id },
            { tpTeacherId: id },
            { courseTeacherId: id },
          ],
        },
        select: {
          name: true,
          id: true,
        },
      });
      return courses;
    }),
});
