import AddChapterModal from "@/components/AddChapterModal";
import TeacherSelect from "@/components/TeacherSelect";
import { RouterInputs, api } from "@/utils/api";
import { Button, NumberInput, TextInput, Textarea } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { MdAdd } from "react-icons/md";

export default function edit() {
  const { query, push } = useRouter();
  if (typeof query.id !== "string") {
    push("/");
    return;
  }
  const courseQuery = api.course.getById.useQuery({ id: query.id });
  const [opened, { close, open }] = useDisclosure();

  const { register, handleSubmit, setValue } =
    useForm<RouterInputs["course"]["create"]>();

  const utils = api.useContext();
  const teachersQuery = api.teacher.getAll.useQuery();
  const data = teachersQuery.data?.map(({ id, name, image }) => ({
    label: name ?? "unnamed",
    value: id,
    image: image ?? "",
  }));

  const { mutate, isLoading } = api.course.create.useMutation({
    onSuccess: ({ code }) => {
      notifications.show({
        title: "Course created successfully!",
        color: "green",
        autoClose: false,
        message: (
          <span>
            your course code is:{" "}
            <span className="font-medium text-[#212529]">{code}</span>
          </span>
        ),
      });
      utils.teacher.getTeacherCourses.invalidate();
    },
    onError: ({ message }) => {
      notifications.show({
        title: "There was a problem creaing your course!",
        color: "red",
        autoClose: 5000,
        message,
      });
    },
  });

  const onSubmit = handleSubmit((values) => {
    mutate(values);
  });

  return (
    <div className="mt-3">
      {opened && <AddChapterModal courseId={query.id} close={close} />}
      <div className="text-4xl font-semibold text-neutral-950">
        {courseQuery.data?.name}
      </div>
      <Button
        onClick={() => {
          open();
        }}
        className="mt-4"
        variant="light"
        leftIcon={<MdAdd />}
      >
        Add Chapter
      </Button>
      <ol className="mt-8 ">
        {courseQuery.data?.chapters.map(({ title }, i) => (
          <li key={i}>{title}</li>
        ))}
      </ol>
      <form
        onSubmit={onSubmit}
        className="mb-16 mt-8 grid max-w-xl grid-cols-6 gap-6"
      >
        <TextInput
          defaultValue={courseQuery.data?.name}
          {...register("name")}
          required
          size="sm"
          label="Name"
          className="col-span-6"
        />
        <DateInput
          defaultValue={courseQuery.data?.startingDate}
          onChange={(v) => {
            v && setValue("startingDate", v);
          }}
          className="col-span-3"
          required
          size="sm"
          label="Starting date"
        />
        <NumberInput
          defaultValue={courseQuery.data?.durationInWeeks}
          onChange={(v) => {
            v && setValue("durationInWeeks", v);
          }}
          className="col-span-3"
          required
          size="sm"
          label="Duration (weeks)"
        />
        <div className="col-span-2">
          <TeacherSelect
            defaultValue={courseQuery.data?.courseTeacherId}
            data={data ?? []}
            placeholder="Pick the course teacher"
            required
            label="Course Teacher"
            field={{ setValue: setValue, name: "courseTeacherId" }}
          />
        </div>
        <div className="col-span-2">
          <TeacherSelect
            defaultValue={courseQuery.data?.tdTeacherId ?? undefined}
            data={data ?? []}
            placeholder="Pick the Course teacher"
            label="TD Teacher"
            field={{ setValue: setValue, name: "tdTeacherId" }}
          />
        </div>
        <div className="col-span-2">
          <TeacherSelect
            defaultValue={courseQuery.data?.tpTeacherId ?? undefined}
            data={data ?? []}
            placeholder="Pick the TP teacher"
            label="TP Teacher"
            field={{ setValue: setValue, name: "tpTeacherId" }}
          />
        </div>
        <Textarea
          defaultValue={courseQuery.data?.description}
          {...register("description")}
          required
          minRows={3}
          size="sm"
          className="col-span-6"
          label="Description"
          autosize
        />
        <Button loading={isLoading} type="submit" className="col-span-6 mt-4">
          {isLoading ? "Creating..." : "Create"}
        </Button>
      </form>
    </div>
  );
}

export { getServerSideProps } from "@/utils/getServerSideProps";
