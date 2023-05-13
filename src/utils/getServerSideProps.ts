import { getServerAuthSession } from "@/server/auth";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  if (!session?.user)
    return { redirect: { destination: "/api/auth/signin", permanent: false } };
  return { props: {} };
};
