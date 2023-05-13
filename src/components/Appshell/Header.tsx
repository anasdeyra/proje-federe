import { Button, Header as H, Image } from "@mantine/core";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import JoinCourseModal from "../JoinCourseModal";
import { useDisclosure } from "@mantine/hooks";

export default function Header() {
  const { data } = useSession();
  const [opened, { close, open }] = useDisclosure();

  const cta = useMemo(() => {
    switch (data?.user.role) {
      case "ADMIN":
        return <Button>Create Class</Button>;
      case "TEACHER":
        return (
          <Button component={Link} href={"/create-course"}>
            Create Course
          </Button>
        );
      case "STUDENT":
        return (
          <div>
            {opened && <JoinCourseModal close={close} />}
            <Button
              onClick={() => {
                open();
              }}
            >
              Join Course
            </Button>
          </div>
        );
    }
  }, [data, opened]);

  return (
    <H
      px={"xl"}
      height={74}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Link href={"/"}>
        <Image alt="logo" src={"/logo.png"} height={42} />
      </Link>
      {cta}
    </H>
  );
}
