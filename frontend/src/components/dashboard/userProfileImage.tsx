import React from "react";
import Image from "next/image";
import { SidebarLink } from "@/components/ui/sidebar";

function UserProfileImage() {
  // const session = useSession();
  // const user = session ? session?.data?.user : undefined;
  return (
    <div>
      <div>
        <SidebarLink
          link={{
            label: `user name}`,
            href: "#",
            icon: (
              <Image
                src={
                  // user
                  //   ? (user?.image as string)
                  "https://assets.aceternity.com/manu.png"
                }
                className="h-7 w-7 flex-shrink-0 rounded-full"
                width={50}
                height={50}
                alt="Avatar"
              />
            ),
          }}
        />
      </div>
    </div>
  );
}

export default UserProfileImage;
