import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { capitalizeWords } from "@/lib/formats";
import { Investor } from "@/types/broker-activity";

type BrokerActivityInvestorFilterProps = {
  investorType: Investor;
  handleInvestorType: (investor: Investor) => void;
};

export default function BrokerActivityInvestorFilter({
  investorType,
  handleInvestorType,
}: BrokerActivityInvestorFilterProps) {
  return (
    <Select value={investorType} onValueChange={handleInvestorType}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(Investor).map(([key, value]) => (
          <SelectItem key={key} value={value}>
            {capitalizeWords(key)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
