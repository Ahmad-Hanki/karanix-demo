import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { OperationWithRelations } from "@/types";
import { Eye } from "lucide-react";
import Link from "next/link";

export function OperationsTable({
  operations,
}: {
  operations: OperationWithRelations[];
}) {
  return (
    <Table>
      <TableCaption>A list of operations</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>Tour Name</TableHead>
          <TableHead>Start Time</TableHead>
          <TableHead>Total Passengers</TableHead>
          <TableHead>Checked In Count</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Details</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {operations.map((op) => (
          <TableRow key={op.id}>
            <TableCell className="font-medium">{op.code}</TableCell>
            <TableCell>{op.tourName}</TableCell>
            <TableCell>{formatDate(op.startTime, "hour-minute")}</TableCell>
            <TableCell>{op.totalPax}</TableCell>
            <TableCell>{op.checkedInCount}</TableCell>
            <TableCell>{op.status}</TableCell>
            <TableCell className="text-right flex justify-end">
              <Link href={`/operations/${op.id}`}>
                <Eye />
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
