import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { capitalizeWords } from "@/lib/formats";
import { MarketBoard } from "@/types/broker-activity";

type BrokerActivityMarketFilterProps = {
  marketType: MarketBoard;
  handlemarketType: (marketType: MarketBoard) => void;
};

export default function BrokerActivityMarketFilter({
  marketType,
  handlemarketType,
}: BrokerActivityMarketFilterProps) {
  return (
    <Select value={marketType} onValueChange={handlemarketType}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(MarketBoard).map(([key, value]) => (
          <SelectItem key={key} value={value}>
            {capitalizeWords(key)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
