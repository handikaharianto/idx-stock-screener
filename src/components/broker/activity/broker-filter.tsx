"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Broker, BrokerGroup } from "@/types/broker-activity";
import clsx from "clsx";

type BrokerFilterProps = {
  data: Broker[];
  selectedBroker: string | undefined;
  handleSelectedBroker: (broker: string) => void;
};

export default function BrokerFilter({
  data,
  selectedBroker,
  handleSelectedBroker,
}: BrokerFilterProps) {
  return (
    <Select value={selectedBroker || "AD"} onValueChange={handleSelectedBroker}>
      <SelectTrigger className="w-[380px]">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        {data.map((broker) => (
          <SelectItem key={broker.code} value={broker.code}>
            <span
              className={clsx(
                "font-bold",
                broker.group == BrokerGroup.LOCAL && "text-purple-700",
                broker.group == BrokerGroup.FOREIGN && "text-red-700",
                broker.group == BrokerGroup.GOVERNMENT && "text-green-700",
              )}
            >
              {broker.code}
            </span>
            {" - "}
            <span>{broker.name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
