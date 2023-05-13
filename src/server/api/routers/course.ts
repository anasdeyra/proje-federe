import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
  teacherProcedure,
} from "@/server/api/trpc";

import { generateShortCode } from "@/utils/generateCode";
import { TRPCError } from "@trpc/server";

export const courseRouter = createTRPCRouter({
  create: teacherProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        durationInWeeks: z.number(),
        startingDate: z.date(),
        courseTeacherId: z.string(),
        tpTeacherId: z.string().optional(),
        tdTeacherId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const codes = (
        await ctx.prisma.course.findMany({
          select: { code: true },
        })
      ).map(({ code }) => code);
      const code = generateShortCode(codes);

      const course = ctx.prisma.course
        .create({
          data: {
            code,
            description: input.description,
            durationInWeeks: input.durationInWeeks,
            name: input.name,
            startingDate: input.startingDate,
            adminId: ctx.session.user.id,
            courseTeacherId: input.courseTeacherId,
            tdTeacherId: input.tdTeacherId,
            tpTeacherId: input.tpTeacherId,
          },
        })
        .then((c) => c);
      return course;
    }),

  addChapter: teacherProcedure
    .input(
      z.object({
        courseId: z.string(),
        title: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ input: { description, courseId, title }, ctx }) => {
      const chapter = await ctx.prisma.chapter.create({
        data: {
          description,
          title,
          courseId,
        },
        select: { id: true },
      });

      return chapter;
    }),
  getAllUserCourses: publicProcedure.query(async ({ ctx }) => {
    const courses = await ctx.prisma.user.findUnique({
      where: { id: ctx.session?.user.id },
      select: { courses: true, managedCourses: true },
    });
    return courses;
  }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const course = await ctx.prisma.course.findUnique({
        where: { id: input.id },
        include: {
          admin: true,
          tpTeacher: true,
          tdTeacher: true,
          courseTeacher: true,
          chapters: {
            include: {
              supports: true,
            },
          },
        },
      });
      return course;
    }),
  addSupports: teacherProcedure
    .input(
      z.object({
        chapterId: z.string(),
        supports: z.array(
          z.object({ name: z.string(), path: z.string(), type: z.string() })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.support.createMany({
        data: input.supports.map(({ name, path, type }) => ({
          chapterId: input.chapterId,
          fileType: type,
          fileUrl: path,
          title: name,
        })),
      });
    }),
  join: protectedProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ ctx, input: { code } }) => {
      const course = ctx.prisma.course.findUnique({ where: { code } });
      if (!course)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid course code!",
        });

      const joinedCourse = await ctx.prisma.course.update({
        where: { code },
        data: { students: { connect: { id: ctx.session.user.id } } },
        select: {
          name: true,
          id: true,
          admin: { select: { name: true } },
        },
      });

      return joinedCourse;
    }),
});
