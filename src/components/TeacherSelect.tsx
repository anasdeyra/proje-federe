import { forwardRef } from "react";
import { Group, Avatar, Text, Select } from "@mantine/core";
import { RouterInputs, api } from "@/utils/api";
import {
  FieldValues,
  UseFormRegisterReturn,
  UseFormSetValue,
} from "react-hook-form";

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  image: string;
  label: string;
  description: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ image, label, description, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar src={image} />
        <Text size="sm">{label}</Text>
      </Group>
    </div>
  )
);

export default function TeacherSelect({
  data = [],
  label,
  placeholder,
  required = false,
  field: { setValue, name },
  defaultValue,
}: TeacherSelectProps) {
  return (
    <Select
      defaultValue={defaultValue}
      onChange={(id) => {
        id && setValue(name, id);
      }}
      required={required}
      label={label}
      placeholder={placeholder}
      itemComponent={SelectItem}
      data={data ?? []}
      searchable
      maxDropdownHeight={400}
      nothingFound="No teachers found"
      filter={(value, item) =>
        item.label?.toLowerCase().includes(value.toLowerCase().trim()) || false
      }
    />
  );
}

interface TeacherSelectProps {
  data: { label: string; image: string; value: string }[];
  label: string;
  placeholder: string;
  required?: boolean;
  field: {
    setValue: UseFormSetValue<RouterInputs["course"]["create"]>;
    name: "courseTeacherId" | "tpTeacherId" | "tdTeacherId";
  };
  defaultValue?: string;
}
