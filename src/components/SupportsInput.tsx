import { Input, FileInput, Select, Button } from "@mantine/core";
import { useRef, useState } from "react";

export default function SupportsInput({ append }: SupportInputsProps) {
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<string | null>(null);

  const onclick = () => {
    if (file && type) {
      append({ file, type });
      setFile(null);
      setType(null);
    }
  };

  return (
    <>
      <Input.Wrapper>
        <Input.Label required>Upload supports</Input.Label>
        <div className="flex gap-2">
          <FileInput
            onChange={(v) => {
              setFile(v);
            }}
            value={file}
            placeholder="Upload your support"
            className="grow"
            rightSectionWidth={112}
            rightSection={
              <Select
                value={type}
                onChange={(v) => {
                  setType(v);
                }}
                placeholder="Type"
                styles={{
                  input: {
                    padding: "0 24px 0 12px",
                    borderRadius: "0 4px 4px 0",
                  },
                }}
                className="w-28"
                data={["document", "video", "series"]}
              />
            }
          />
          <Button onClick={onclick} variant="light" type="button">
            Add
          </Button>
        </div>
      </Input.Wrapper>
    </>
  );
}

interface SupportInputsProps {
  append: (
    ...items: {
      file: File;
      type: string;
    }[]
  ) => void;
}
