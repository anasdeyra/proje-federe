import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const studentRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const students = await ctx.prisma.user.findMany({
      where: {
        role: "STUDENT",
      },
    });
    return students;
  }),
  getStudentCourses: protectedProcedure
    .input(
      z
        .object({
          studentId: z.string(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const id = input?.studentId ?? ctx.session.user.id;
      const student = await ctx.prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          courses: {
            select: {
              id: true,
              name: true,
              admin: { select: { name: true, image: true } },
            },
          },
        },
      });

      if (student) return student.courses;
    }),
});
