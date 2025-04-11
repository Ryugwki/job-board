import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Image from "next/image";
import { Settings, LogOut, SquareUserRound, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/context/globalContext";
import { Badge } from "./ui/badge";
import Link from "next/link";

function Profile() {
  const { userProfile, isAuthenticated } = useGlobalContext();

  console.log("Profile - isAuthenticated:", isAuthenticated); // Debugging log
  console.log("Profile - userProfile:", userProfile); // Debugging log

  const { profilePicture, name, profession, email, _id, isAdmin, role } = userProfile;

  const router = useRouter();

  const handleNavigateToProfile = () => {
    router.push(`/api/v1/user/${_id}`); // Navigate to the desired URL
  };

  return (
    <DropdownMenu>
      <div className="flex items-center gap-4">
        <Badge>{profession}</Badge>
        <Badge>{role}</Badge>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <Image
            src={profilePicture ? profilePicture : "/user.png"}
            alt="avatar"
            width={36}
            height={36}
            className="rounded-full"
          />
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <SquareUserRound
            className="mr-2 h-4 w-4"
            onClick={handleNavigateToProfile}
          />
          <Link href={`/user/${_id}`}>
            <span>View Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <Link href="/settings">
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem>
            <ShieldAlert className="mr-2 h-4 w-4" />
            <Link href="/admin">
              <span>Admin</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            router.push("http://localhost:8000/logout");
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Profile;
