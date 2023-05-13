import { api } from "@/utils/api";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { Avatar, Center } from "@mantine/core";
import Link from "next/link";

const Home: NextPage = () => {
  const { data } = useSession();
  const coursesQuery = api.student.getStudentCourses.useQuery();
  return (
    <>
      <h1 className="m-0 mt-3 text-4xl">
        Hello, <span className="text-green-600">{data?.user.name}</span>{" "}
        {coursesQuery.data?.length === 0 && (
          <div className="mt-32 w-full text-center text-xl font-medium text-neutral-400">
            You are not inrolled in any courses yet!
          </div>
        )}
        <div className="mt-8 grid grid-cols-3">
          {coursesQuery.data?.map(({ admin, id, name }) => (
            <Link href={`/course/${id}`} key={id} className="no-underline">
              <div
                key={id}
                className=" rounded-lg border border-solid border-neutral-200 bg-white p-4 transition-shadow hover:shadow-md"
              >
                <div className="text-2xl font-semibold text-neutral-950">
                  {name}
                </div>
                <div className="text-base font-medium text-neutral-800">
                  {admin.name}
                </div>
                <Avatar src={admin.image} size={48} radius={"50%"} />
              </div>
            </Link>
          ))}
        </div>
      </h1>
    </>
  );
};

export default Home;

export { getServerSideProps } from "@/utils/getServerSideProps";
