import SideBar from "@/components/SideBar";
import { loggedIn } from "@/constants";
import Image from "next/image";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex h-screen w-full font-inter " >
        <SideBar user={loggedIn} />
       
        {children}
    </main>
  );
}
