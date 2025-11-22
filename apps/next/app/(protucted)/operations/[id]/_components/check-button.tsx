import { Button } from "@/components/ui/button";
import { useCheckAlert } from "@/servers/operations/check-alert";
import { OperationStatus } from "@/types";
import { toast } from "react-toastify";

const CheckButton = ({
  id,
  status,
}: {
  id: string;
  status: OperationStatus;
}) => {
  const { mutate, isPending } = useCheckAlert({
    mutationConfig: {
      onSuccess: (data) => {
        console.log(data);
        if (data.data.alerted == false) {
          toast.info("No alerts detected." + " " + data?.data?.reason);
        }
      },
    },
  });
  return (
    <Button
      disabled={status !== "ACTIVE" || isPending}
      onClick={() => {
        mutate({ id });
      }}
    >
      Check 70%
    </Button>
  );
};

export { CheckButton };
