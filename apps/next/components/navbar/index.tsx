import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import Link from "next/link";

const Nav = () => {
  return (
    <Menubar className="flex justify-center gap-4 items-center py-3 mb-10">
      <MenubarMenu>
        <MenubarTrigger asChild>
          <Link href="/operations">Operations</Link>
        </MenubarTrigger>
      </MenubarMenu>
    </Menubar>
  );
};

export default Nav;
