import { AppShell as AS, Box } from "@mantine/core";
import Header from "./Header";
import Navbar from "./Navbar";

export default function Appshell({ children }: { children: React.ReactNode }) {
  return (
    <AS px={"xl"} header={<Header />} navbar={<Navbar />}>
      {children}
    </AS>
  );
}
