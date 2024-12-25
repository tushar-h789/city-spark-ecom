import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export default function ProductsLoading() {
  return (
    <div className="space-y-4 hidden lg:block">
      <Card className="shadow-sm border-gray-200 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-auto h-[calc(100vh-325px)] relative">
            <Table>
              <TableHeader className="bg-gray-50 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="w-14 pl-6">
                    <Checkbox disabled />
                  </TableHead>
                  <TableHead className="w-24 py-5">
                    <span className="sr-only">Image</span>
                  </TableHead>
                  <TableHead className="w-[40%] min-w-[300px]">
                    Product Details
                  </TableHead>
                  <TableHead className="w-[15%] min-w-[120px]">
                    Status
                  </TableHead>
                  <TableHead className="w-[15%] min-w-[140px]">Price</TableHead>
                  <TableHead className="w-[15%] min-w-[140px]">
                    Last Updated
                  </TableHead>
                  <TableHead className="w-14 pr-6"></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {Array.from({ length: 5 }, (_, index) => (
                  <TableRow key={index} className="group relative">
                    <TableCell className="pl-6">
                      <Checkbox disabled />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="relative">
                        <Skeleton className="h-14 w-14 rounded-lg" />
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-24 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell className="pr-6">
                      <Skeleton className="h-8 w-8 rounded-md" />
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
