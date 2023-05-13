import { Image, Navbar as N } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import AdminNavbarContent from "./AdminNavbarContent";
import StudentNavbarContent from "./StudentNavbarContent";
import TeacherNavbarContent from "./TeacherNavbarContent";
import Link from "next/link";
import UserMenu from "../UserMenu";

export default function Navbar() {
  const { data } = useSession();

  const content = useMemo(() => {
    switch (data?.user.role) {
      case "ADMIN":
        return <AdminNavbarContent />;
      case "TEACHER":
        return <TeacherNavbarContent />;
      case "STUDENT":
        return <StudentNavbarContent />;
    }
  }, [data]);

  return (
    <N width={{ base: 220 }} px={"xl"}>
      <N.Section mt={"xl"} grow>
        {content}
      </N.Section>
      <N.Section mb={"xl"}>
        <UserMenu />
      </N.Section>
    </N>
  );
}
