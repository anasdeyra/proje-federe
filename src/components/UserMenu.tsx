import { Avatar, ChevronIcon, Group, Menu } from "@mantine/core";
import { useSession, signOut } from "next-auth/react";

export default function UserMenu() {
  const { data } = useSession();
  return (
    <Menu>
      <Menu.Target>
        <Group sx={{ cursor: "pointer" }} spacing={"xs"}>
          <Avatar size={32} src={data?.user.image} radius={"xl"} />
          {data?.user.name}
          <ChevronIcon />
        </Group>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          onClick={() => {
            signOut();
          }}
          color="red"
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
