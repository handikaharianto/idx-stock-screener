import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { capitalizeWords } from "@/lib/formats";
import { Transaction } from "@/types/broker-activity";

type BrokerActivityMarketFilterProps = {
  transactionType: Transaction;
  handleTransactionType: (transactionType: Transaction) => void;
};

export default function BrokerActivityTransactionFilter({
  transactionType,
  handleTransactionType,
}: BrokerActivityMarketFilterProps) {
  return (
    <Select value={transactionType} onValueChange={handleTransactionType}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(Transaction).map(([key, value]) => (
          <SelectItem key={key} value={value}>
            {capitalizeWords(key)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
