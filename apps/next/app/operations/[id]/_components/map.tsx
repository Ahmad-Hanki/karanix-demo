import { PaxType, PaxStatus } from "@/types";

const Map = ({ pax }: { pax: PaxType[] | null }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Map placeholder (real Google Maps later) */}
      <div className="border rounded-lg p-4 h-[400px] flex items-center justify-center">
        <span className="text-gray-500 text-sm">
          Map will be here (Google Maps + live vehicle marker)
        </span>
      </div>

      {/* Manifest table */}
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
            {pax?.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="py-1">{p.seatNo ?? "—"}</td>
                <td className="py-1">{p.name}</td>
                <td className="py-1">{p.pickupAddress ?? "—"}</td>
                <td className="py-1">{p.status}</td>
                <td className="py-1 text-right">
                  {/* real check-in logic later */}
                  <button
                    disabled={p.status == "COMPLETED"}
                    className="text-xs px-2 py-1 border rounded disabled:opacity-50"
                  >
                    Check-in
                  </button>
                </td>
              </tr>
            ))}
            {pax?.length == 0 && (
              <tr>
                <td colSpan={5} className="py-2 text-center text-gray-500">
                  No pax
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { Map };
