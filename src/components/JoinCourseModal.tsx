import { api, RouterInputs } from "@/utils/api";
import { Button, Modal, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

export default function JoinCourseModal({ close }: ModalProps) {
  const router = useRouter();
  const { mutate, isLoading } = api.course.join.useMutation({
    onSuccess: ({ name, admin, id }) => {
      showNotification({
        title: "Joined course successfully!",
        color: "green",
        message: `Joined ${name} course by Mr. ${admin.name}`,
        autoClose: 5000,
      });
      router.push(`/course/${id}`);
      close();
    },
    onError: () => {},
  });

  const { handleSubmit, register } = useForm<RouterInputs["course"]["join"]>();
  return (
    <Modal
      centered
      title={<span className="font-medium">Join a new course</span>}
      opened
      onClose={close}
    >
      <form
        onSubmit={handleSubmit((data) => {
          mutate(data);
        })}
        className="row-span-1 grid gap-2"
      >
        <TextInput
          {...register("code")}
          label="Course code"
          placeholder="enter your code here"
          required
          className="grow"
        />{" "}
        <Button type="submit" loading={isLoading}>
          {!isLoading ? "Join" : "Joining..."}
        </Button>
      </form>
    </Modal>
  );
}

interface ModalProps {
  close: () => void;
}
