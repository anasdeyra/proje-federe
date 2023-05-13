import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { ActionIcon, Avatar, Badge, Center, Loader } from "@mantine/core";
import Head from "next/head";
import { MdSettings } from "react-icons/md";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useMemo, useState, MouseEventHandler } from "react";
import { Support } from "@prisma/client";
import { useDisclosure } from "@mantine/hooks";
import SupportsModal from "@/components/SupportsModal";

export default function index() {
  const { query, push } = useRouter();
  if (typeof query.id !== "string") {
    push("/");
    return;
  }
  const { data, isLoading } = api.course.getById.useQuery({ id: query.id });
  const session = useSession();

  const [opened, { close, open }] = useDisclosure();
  const [selectedChapter, setSelectedChapter] = useState<{
    name: string;
    supports: Support[];
  }>({ name: "", supports: [] });

  const content = useMemo(() => {
    if (isLoading)
      return (
        <Center my={60}>
          <Loader />
        </Center>
      );
    if (data?.chapters.length === 0)
      return (
        <Center>
          <span className="my-20 text-lg font-medium text-neutral-400">
            This course have no chapters yet!
          </span>
        </Center>
      );
    return (
      <div className="grid auto-rows-fr grid-cols-3 gap-4">
        {data?.chapters.map(({ title, supports }, i) => (
          <ChapterCard
            onClick={() => {
              setSelectedChapter({ supports, name: title });
              open();
            }}
            key={i}
            supports={supports}
            title={title}
            i={i}
          />
        ))}
      </div>
    );
  }, [data, isLoading]);

  return (
    <div className="mt-3">
      <Head>
        <title>
          Course: {data?.name} by Mr. {data?.admin.name}
        </title>
      </Head>
      {opened && (
        <SupportsModal
          close={close}
          supports={selectedChapter.supports}
          chapter={selectedChapter.name}
        />
      )}
      <div className="flex items-center gap-2">
        <div className="text-4xl font-semibold text-neutral-950">
          {data?.name}
        </div>
        <div className="flex items-center gap-2">
          <Avatar.Group>
            {data?.courseTeacher && (
              <Avatar size={32} src={data?.courseTeacher.image} radius={"xl"} />
            )}
            {data?.tdTeacher && (
              <Avatar size={32} src={data?.tdTeacher.image} radius={"xl"} />
            )}
            {data?.tpTeacher && (
              <Avatar size={32} src={data?.tpTeacher.image} radius={"xl"} />
            )}
          </Avatar.Group>
          {session.data?.user.id === data?.adminId && (
            <ActionIcon
              href={`/course/${query.id}/edit`}
              component={Link}
              variant="subtle"
            >
              <MdSettings />
            </ActionIcon>
          )}
        </div>
      </div>
      <div className="mt-2 font-medium text-neutral-400">{data?.code}</div>
      <div className="mt-8 rounded-lg bg-neutral-50 p-4">{content}</div>
    </div>
  );
}

function ChapterCard({
  i,
  supports,
  title,
  onClick,
}: {
  title: string;
  supports: Support[];
  i: number;
  onClick: MouseEventHandler<HTMLDivElement> | undefined;
}) {
  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer flex-col rounded-md bg-white p-4"
    >
      <span className="mb-4 text-lg font-semibold">
        Chapter {i + 1}: {title}
      </span>
      <span className="mt-auto text-sm font-medium text-neutral-700">
        supports:{" "}
      </span>
      <div className=" mt-1 flex flex-wrap items-start gap-2">
        {supports.map((support, i) => (
          <Badge key={i} variant="light">
            {support.title}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export { getServerSideProps } from "@/utils/getServerSideProps";
