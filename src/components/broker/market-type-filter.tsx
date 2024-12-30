import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { capitalizeWords } from "@/lib/formats";
import { MarketType } from "@/types/broker";

type MarketTypeFilterProps = {
  marketType: MarketType;
  handleMarketTypeChange: (marketType: MarketType) => void;
};

export default function MarketTypeFilter({
  marketType,
  handleMarketTypeChange,
}: MarketTypeFilterProps) {
  return (
    <Select
      value={marketType}
      onValueChange={(value) => handleMarketTypeChange(value as MarketType)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Market Type" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(MarketType).map(([key, value]) => (
          <SelectItem key={key} value={value}>
            {capitalizeWords(key)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
