import { Modal, Text } from "@mantine/core";
import { Support } from "@prisma/client";
import Link from "next/link";
import { FaFile, FaVideo, FaPen } from "react-icons/fa";

export default function SupportsModal({
  close,
  supports,
  chapter,
}: ModalProps) {
  return (
    <Modal
      title={<span className="font-medium">Chapter: {chapter}</span>}
      centered
      opened
      onClose={close}
    >
      <Text>Supports:</Text>
      {supports.map(({ title, fileUrl, fileType }, i) => (
        <Link
          key={i}
          target="_blank"
          href={fileUrl}
          className="flex w-fit cursor-pointer items-center gap-2 rounded-md p-2 text-green-700 no-underline hover:bg-neutral-100"
        >
          {fileType === "document" ? (
            <FaFile />
          ) : fileType === "video" ? (
            <FaVideo />
          ) : (
            <FaPen />
          )}
          <div>{title}</div>
        </Link>
      ))}
    </Modal>
  );
}

interface ModalProps {
  close: () => void;
  supports: Support[];
  chapter: string;
}
