import { Button } from "@/components/ui/button";
import { useCheckIn } from "@/servers/pax/check-in";
import { PaxStatus, PaxType } from "@/types";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const TableContent = ({
  p,
  setPaxList,
  operationId,
}: {
  p: PaxType;
  setPaxList: React.Dispatch<React.SetStateAction<PaxType[]>>;
  operationId: string;
}) => {
  const [checkedInStatus, setCheckedInStatus] = useState<PaxStatus>(p.status);
  const { mutate, isPending } = useCheckIn({
    mutationConfig: {
      onSuccess: (data) => {
        toast.success(`Pax ${p.name} checked in successfully!`);
        setCheckedInStatus("CHECKED_IN");
        setPaxList((prev) =>
          prev.map((px) =>
            px.id === p.id ? { ...px, status: "CHECKED_IN" } : px
          )
        );
      },
      onError: (error) => {
        toast.error(
          error.response?.data.message ||
            "Failed to check-in pax. Please try again."
        );
      },
    },
  });
  const handleCheckin = async (paxId: string) => {
    mutate({
      paxId,
      body: { eventId: crypto.randomUUID(), method: "manual" },
    });
  };

  return (
    <tr key={p.id} className="border-b">
      <td className="py-1">{p.seatNo ?? "—"}</td>
      <td className="py-1">{p.name}</td>
      <td className="py-1">{p.pickupAddress ?? "—"}</td>
      <td className="py-1">{checkedInStatus}</td>
      <td className="py-1 text-right">
        <Button
          variant={"outline"}
          onClick={() => handleCheckin(p.id)}
          disabled={checkedInStatus == "CHECKED_IN" || isPending}
          className="text-xs px-2 py-1 border rounded disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : checkedInStatus == "CHECKED_IN" ? (
            "Checked In"
          ) : (
            "Check In"
          )}
        </Button>
      </td>
    </tr>
  );
};

export default TableContent;
