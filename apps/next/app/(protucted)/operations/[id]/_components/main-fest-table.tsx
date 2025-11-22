import { PaxType } from "@/types";
import TableContent from "./table-content";

type Props = {
  pax: PaxType[];
  operationId: string;
};

const MainFestTable = ({ pax }: Props) => {
  return (
    <div className="border rounded-lg p-4">
      <h2 className="font-semibold mb-2">Manifest</h2>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left py-1">Seat</th>
            <th className="text-left py-1">Name</th>
            <th className="text-left py-1">Pickup</th>
            <th className="text-left py-1">Status</th>
            <th className="text-left py-1"></th>
          </tr>
        </thead>
        <tbody>
          {pax.map((p) => (
            <TableContent p={p} key={p.id} />
          ))}
          {pax.length === 0 && (
            <tr>
              <td colSpan={5} className="py-2 text-center text-gray-500">
                No pax
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MainFestTable;
