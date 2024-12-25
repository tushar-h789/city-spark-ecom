import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

export default function DesktopTemplatesLoading() {
  return (
    <div className="space-y-4 hidden lg:block">
      <Card className="shadow-sm border-gray-200 overflow-hidden">
        <CardContent className="p-0 relative">
          <div className="overflow-auto h-[calc(100vh-325px)] relative">
            <Table>
              <TableHeader className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                <TableRow>
                  <TableHead className="w-14 pl-6">
                    <Checkbox disabled />
                  </TableHead>
                  <TableHead className="w-[30%]">Name</TableHead>
                  <TableHead className="w-[15%]">Status</TableHead>
                  <TableHead className="w-[15%] hidden md:table-cell">
                    Fields
                  </TableHead>
                  <TableHead className="w-[15%] hidden md:table-cell">
                    Products
                  </TableHead>
                  <TableHead className="w-[15%] hidden md:table-cell">
                    Last Updated
                  </TableHead>
                  <TableHead className="w-14 pr-6">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(10)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="pl-6">
                      <Checkbox disabled />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell className="pr-6">
                      <Skeleton className="h-8 w-8 rounded-lg float-right" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-10 w-[300px]" />
      </div>
    </div>
  );
}
