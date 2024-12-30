import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { capitalizeWords } from "@/lib/formats";
import { BrokerPeriod } from "@/types/broker";

type PeriodFilterProps = {
  period: BrokerPeriod;
  date: string;
  handlePeriodChange: (period: BrokerPeriod) => void;
};

export default function PeriodFilter({
  period,
  date,
  handlePeriodChange,
}: PeriodFilterProps) {
  return (
    <Dialog open={(period as string) === "CUSTOM" ? true : false}>
      <Select value={period} onValueChange={handlePeriodChange}>
        <SelectTrigger className="w-[240px]">
          <SelectValue placeholder="Period">{date}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(BrokerPeriod).map(([key, value]) => (
            <SelectItem key={key} value={value}>
              {capitalizeWords(key)}
            </SelectItem>
          ))}
          <DialogTrigger asChild>
            <SelectItem value="CUSTOM">Custom</SelectItem>
          </DialogTrigger>
        </SelectContent>
      </Select>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
