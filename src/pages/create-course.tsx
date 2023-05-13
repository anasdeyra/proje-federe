import TeacherSelect from "@/components/TeacherSelect";
import { api } from "@/utils/api";
import { NumberInput, TextInput, Textarea, Title, Button } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "react-hook-form";
import type { RouterInputs } from "@/utils/api";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/router";

export default function () {
  const router = useRouter();

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
    onSuccess: ({ code, id }) => {
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
      router.push(`/course/${id}/edit`);
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
    <>
      <Title className="mt-8 text-center text-5xl">Create a course</Title>
      <form
        onSubmit={onSubmit}
        className="mx-auto mb-16 mt-8 grid max-w-xl grid-cols-6 gap-6"
      >
        <TextInput
          {...register("name")}
          required
          size="sm"
          label="Name"
          className="col-span-6"
        />
        <DateInput
          onChange={(v) => {
            v && setValue("startingDate", v);
          }}
          className="col-span-3"
          required
          size="sm"
          label="Starting date"
        />
        <NumberInput
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
            data={data ?? []}
            placeholder="Pick the course teacher"
            required
            label="Course Teacher"
            field={{ setValue: setValue, name: "courseTeacherId" }}
          />
        </div>
        <div className="col-span-2">
          <TeacherSelect
            data={data ?? []}
            placeholder="Pick the Course teacher"
            label="TD Teacher"
            field={{ setValue: setValue, name: "tdTeacherId" }}
          />
        </div>
        <div className="col-span-2">
          <TeacherSelect
            data={data ?? []}
            placeholder="Pick the TP teacher"
            label="TP Teacher"
            field={{ setValue: setValue, name: "tpTeacherId" }}
          />
        </div>
        <Textarea
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
    </>
  );
}

export { getServerSideProps } from "@/utils/getServerSideProps";
