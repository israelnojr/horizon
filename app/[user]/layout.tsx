import MobileNav from "@/components/MobileNav";
import SideBar from "@/components/SideBar";
import { loggedIn } from "@/constants";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import Image from "next/image";
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = await getLoggedInUser()
  return (
    <main className="flex h-screen w-full font-inter " >
        <SideBar user={loggedIn} />
        <div className="flex size-full flex-col">
          <div className="root-layout">
            <Image 
              src="/icons/logo.svg"
              alt="menu icon" 
              width={30}
              height={30}
            />
            <div><MobileNav user={loggedIn} /></div>
          </div>
          {children}
        </div>
    </main>
  );
}
