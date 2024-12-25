import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

import { Users } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function UserTableHeader() {
  return (
    <>
      <div className="flex items-center gap-4 mb-5 mt-7">
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0 flex items-center">
          <Users className="mr-3 text-primary" />
          User List
        </h1>

        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Button variant="outline" size="sm">
            Download Excel
          </Button>
          <Link href="users/new">
            <Button size="sm" className="whitespace-nowrap">
              Add New User
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto mb-5">
        <Input
          type="search"
          placeholder="Search users"
          className="w-full sm:w-auto flex-1"
        />
        

        <Select>
          <SelectTrigger className="w-full sm:w-auto">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
