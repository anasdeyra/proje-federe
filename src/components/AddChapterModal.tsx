import { api, RouterInputs } from "@/utils/api";
import {
  Button,
  Modal,
  TextInput,
  Textarea,
  Badge,
  ActionIcon,
} from "@mantine/core";
import { useForm } from "react-hook-form";
import SupportsInput from "./SupportsInput";
import { useListState } from "@mantine/hooks";
import { FiX } from "react-icons/fi";
import FormData from "form-data";
import axios from "axios";
import { showNotification } from "@mantine/notifications";

export default function AddChapterModal({ close, courseId }: ModalProps) {
  const context = api.useContext();
  const addChapterMutaion = api.course.addChapter.useMutation({
    onSuccess: ({ id: chapterId }) => {
      addSupports(chapterId);
    },
  });

  const addSupportsMutation = api.course.addSupports.useMutation({
    onSuccess: () => {
      showNotification({
        message: "Chapter created successfully!",
        color: "green",
        autoClose: 5000,
      });
      context.course.getById.invalidate();
    },
  });

  const {
    getValues,
    register,
    reset,
    formState: { isValid },
  } = useForm<{
    title: string;
    description: string;
  }>();

  const [supports, { append, remove, setState }] = useListState<{
    file: File;
    type: string;
  }>([]);

  const submit = () => {
    if (supports.length === 0 || !isValid) return;
    addChapterMutaion.mutate({ ...getValues(), courseId });
  };

  const addSupports = async (chapterId: string) => {
    const data = new FormData();

    supports.forEach(({ file }) => {
      data.append(file.name ?? "file", file);
    });

    const { data: uploaded } = await axios.post<
      { name: string; path: string }[]
    >("/api/upload-support", data);

    const formatedSupports = supports.map(({ file: { name }, type }) => {
      //@ts-ignore
      const { path } = uploaded.find((upload) => upload.name === name);
      return {
        name,
        type,
        path,
      };
    });

    addSupportsMutation.mutate({ chapterId, supports: formatedSupports });
  };

  return (
    <Modal
      title={<span className="font-medium">Add a new chapter</span>}
      opened
      onClose={close}
      centered
    >
      <Modal.Body>
        <div className=" grid grid-cols-2 gap-4">
          <TextInput
            label="Title"
            placeholder={"Chapter Title"}
            required
            className="col-span-2"
            {...register("title")}
          />
          <Textarea
            placeholder="Chapter Descirption"
            label="Description"
            required
            className="col-span-2"
            {...register("description")}
          />
          <div className="col-span-2 mb-4">
            <SupportsInput append={append} />
            <div className="mt-4 flex gap-1">
              {supports.map(({ file: { name } }, i) => (
                <Badge
                  pr={3}
                  key={i}
                  rightSection={
                    <ActionIcon
                      onClick={() => {
                        remove(i);
                      }}
                      size="sm"
                      color="green"
                      radius="xl"
                      variant="transparent"
                    >
                      <FiX size={14} />
                    </ActionIcon>
                  }
                  variant="light"
                >
                  {name}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            onClick={() => {
              submit();
              reset({ description: "", title: "" });
              setState([]);
            }}
            loading={addChapterMutaion.isLoading}
          >
            Submit & Add another
          </Button>
          <Button
            loading={addChapterMutaion.isLoading}
            onClick={() => {
              submit();
              close();
            }}
            variant="outline"
          >
            Submit
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

interface ModalProps {
  close: () => void;
  courseId: string;
}
