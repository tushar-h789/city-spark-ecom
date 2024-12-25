import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function InventoryLoading() {
  return (
    <div className="space-y-4 hidden lg:block">
      <Card className="shadow-sm border-gray-200 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-auto h-[calc(100vh-325px)] relative">
            <Table>
              <TableHeader className="bg-gray-50 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="w-24">
                    <span className="sr-only">Image</span>
                  </TableHead>
                  <TableHead className="w-[40%]">Product Details</TableHead>
                  <TableHead>Stock Count</TableHead>
                  <TableHead>Sold Count</TableHead>
                  <TableHead>Held Count</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {Array.from({ length: 5 }, (_, index) => (
                  <TableRow key={index} className="group">
                    <TableCell>
                      <div className="relative">
                        <Skeleton className="h-14 w-14 rounded-lg" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
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
