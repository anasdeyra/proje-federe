import { api } from "@/utils/api";
import Link from "next/link";

export default function TeacherNavbarContent() {
  const { data: courses } = api.teacher.getTeacherCourses.useQuery();
  return (
    <div>
      <h2 className="text-xl font-semibold">My Courses</h2>
      <div className="mt-6 flex flex-col gap-2 ">
        {courses?.map(({ name, id }) => (
          <Link
            href={`/course/${id}`}
            key={id}
            className="cursor-pointer rounded-md bg-neutral-50 px-4 py-2 text-sm font-medium text-neutral-950 no-underline transition-colors hover:bg-green-500 hover:text-white"
          >
            {name}
          </Link>
        ))}
      </div>
    </div>
  );
}
