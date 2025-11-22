"use client";

import { Switch } from "@/components/ui/switch";
import { useOperationsWrapper } from "@/hooks/transition-context";
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { OperationStatus } from "@/types";
export const Filters = () => {
  const { setParams, date, status } = useOperationsWrapper();
  const tomorrowDateString = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const statusOptions: OperationStatus[] = [
    "ACTIVE",
    "PLANNED",
    "COMPLETED",
    "CANCELLED",
  ];

  return (
    <div className="flex items-center gap-3">
      <div className="relative inline-grid h-8 grid-cols-[1fr_1fr] items-center text-sm font-medium">
        <Switch
          checked={date === tomorrowDateString}
          onCheckedChange={(checked) =>
            setParams({ date: checked ? tomorrowDateString : null })
          }
          className="peer data-[state=unchecked]:bg-input/50 absolute inset-0 h-[inherit] w-auto rounded-md [&_span]:z-10 [&_span]:h-full [&_span]:w-1/2 [&_span]:rounded-sm [&_span]:transition-transform [&_span]:duration-300 [&_span]:ease-[cubic-bezier(0.16,1,0.3,1)]  [&_span]:data-[state=checked]:rtl:-translate-x-8.75"
          aria-label="Square switch with permanent text indicators"
        />
        <span className="pointer-events-none relative ml-0.5 flex items-center justify-center px-2 text-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-full peer-data-[state=unchecked]:rtl:-translate-x-full">
          <span className="text-[10px] font-medium uppercase">Today</span>
        </span>
        <span className="peer-data-[state=checked]:text-background pointer-events-none relative mr-0.5 flex items-center justify-center px-2 text-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:-translate-x-full peer-data-[state=unchecked]:invisible peer-data-[state=checked]:rtl:translate-x-full">
          <span className="text-[10px] font-medium uppercase">Tomorrow</span>
        </span>
      </div>
      <NativeSelect
        value={status || ""}
        onChange={(e) =>
          setParams({ status: (e.target.value as OperationStatus) || null })
        }
      >
        {statusOptions.map((statusOption) => (
          <NativeSelectOption
            key={statusOption}
            selected={status == statusOption}
            onSelect={() => setParams({ status: statusOption })}
            value={statusOption}
          >
            {statusOption.toLowerCase()}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </div>
  );
};
