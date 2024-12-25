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

export default function CategoriesLoading() {
  return (
    <div className="space-y-4 hidden lg:block">
      <Card className="shadow-sm border-gray-200 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-auto h-[calc(100vh-325px)] relative">
            <Table>
              <TableHeader className="bg-gray-50 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="w-14 pl-6">
                    <Skeleton className="h-4 w-4" />
                  </TableHead>
                  <TableHead className="w-24 py-5">
                    <span className="sr-only">Image</span>
                  </TableHead>
                  <TableHead className="w-[30%] min-w-[200px]">Name</TableHead>
                  <TableHead className="w-[35%] min-w-[250px]">
                    Category Path
                  </TableHead>
                  <TableHead className="w-[20%] min-w-[150px]">
                    Last Updated
                  </TableHead>
                  <TableHead className="w-14 pr-6 text-right">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 10 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="pl-6">
                      <Skeleton className="h-4 w-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-14 w-14 rounded-lg" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-[180px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-[230px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-[130px]" />
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <Skeleton className="h-8 w-8 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
