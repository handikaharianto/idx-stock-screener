"use client";

import BrokerActivityFilter from "@/components/broker/activity/broker-filter";
import {
  Broker,
  BrokerBuy,
  BrokerSell,
  Investor,
  MarketBoard,
  Transaction,
} from "@/types/broker-activity";
import { useEffect, useState } from "react";
import BrokerActivityInvestorFilter from "@/components/broker/activity/investor-filter";
import BrokerActivityMarketFilter from "@/components/broker/activity/market-filter";
import BrokerActivityTransactionFilter from "@/components/broker/activity/transaction-filter";
import BrokerActivityTable from "@/components/broker/activity/broker-activity-table";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate, formatNumber } from "@/lib/formats";
import { BrokerActivityDatePicker } from "@/components/broker/activity/date-picker";

const dateToday = new Date(
  new Date().getFullYear(),
  new Date().getMonth(),
  new Date().getDate(),
);

export const buyerColumns: ColumnDef<BrokerBuy>[] = [
  {
    accessorKey: "netbs_stock_code",
    header: "BY",
    cell: ({ row }) => (
      <div className="font-bold">{row.getValue("netbs_stock_code")}</div>
    ),
  },
  {
    accessorKey: "bval",
    header: "B.val",
    cell: ({ row }) => {
      const buyValue = Number(row.getValue("bval"));

      return <div className="text-green-600">{formatNumber(buyValue)}</div>;
    },
  },
  {
    accessorKey: "blot",
    header: "B.lot",
    cell: ({ row }) => {
      const buyLot = Number(row.getValue("blot"));

      return <div className="text-green-600">{formatNumber(buyLot)}</div>;
    },
  },
  {
    accessorKey: "netbs_buy_avg_price",
    header: "B.avg",
    cell: ({ row }) => {
      const buyAvgPrice = Number(row.getValue("netbs_buy_avg_price"));

      return <div className="text-green-600">{Math.round(buyAvgPrice)}</div>;
    },
  },
];

export const sellerColumns: ColumnDef<BrokerSell>[] = [
  {
    accessorKey: "netbs_stock_code",
    header: "SL",
    cell: ({ row }) => (
      <div className="font-bold">{row.getValue("netbs_stock_code")}</div>
    ),
  },
  {
    accessorKey: "sval",
    header: "S.val",
    cell: ({ row }) => {
      const sellValue = Number(row.getValue("sval"));

      return <div className="text-red-600">{formatNumber(sellValue)}</div>;
    },
  },
  {
    accessorKey: "slot",
    header: "S.lot",
    cell: ({ row }) => {
      const sellLot = Number(row.getValue("slot"));

      return <div className="text-red-600">{formatNumber(sellLot)}</div>;
    },
  },
  {
    accessorKey: "netbs_sell_avg_price",
    header: "S.avg",
    cell: ({ row }) => {
      const sellAvgPrice = Number(row.getValue("netbs_sell_avg_price"));

      return <div className="text-red-600">{Math.round(sellAvgPrice)}</div>;
    },
  },
];

export default function Page() {
  const [brokersActivity, setbrokersActivity] = useState<{
    buy: BrokerBuy[];
    sell: BrokerSell[];
  }>({
    buy: [],
    sell: [],
  });
  const [pageState, setPageState] = useState({
    isLoading: false,
    isError: false,
  });

  // broker filter
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [selectedBroker, setselectedBroker] = useState<string>("AD");

  // date range picker
  const [date, setDate] = useState<{ from: Date; to: Date } | undefined>();

  // investor filter
  const [investorType, setInvestorType] = useState<Investor>(
    Investor.ALL_INVESTOR,
  );

  // market filter
  const [marketType, setMarketType] = useState<MarketBoard>(
    MarketBoard.REGULAR,
  );

  // transaction filter
  const [transactionType, setTransactionType] = useState<Transaction>(
    Transaction.NET,
  );

  const handleSelectedBroker = (broker: string) => setselectedBroker(broker);
  const handleInvestorType = (investor: Investor) => setInvestorType(investor);
  const handlemarketType = (marketType: MarketBoard) =>
    setMarketType(marketType);
  const handleTransactionType = (transactionType: Transaction) =>
    setTransactionType(transactionType);

  const getBrokers = async () => {
    try {
      setPageState({ ...pageState, isLoading: true });
      const response = await fetch(
        "https://exodus.stockbit.com/findata-view/marketdetectors/brokers?page=1&limit=150&group=GROUP_UNSPECIFIED",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: process.env.NEXT_PUBLIC_ACCESS_TOKEN as string,
          },
        },
      );
      const { data } = (await response.json()) as { data: Broker[] };
      setBrokers(data);
      setselectedBroker(data[0].code);
      setPageState({ ...pageState, isLoading: false });
    } catch (error) {
      setPageState({ ...pageState, isLoading: false, isError: true });
    }
  };

  const getBrokersActivity = async ({
    brokerCode,
    date,
    transactionType,
    marketType,
    investorType,
  }: {
    brokerCode: string;
    date?: { from: Date; to: Date };
    transactionType: string;
    marketType: string;
    investorType: string;
  }) => {
    const searchParams = new URLSearchParams({
      page: "1",
      limit: "50",
      transaction_type: transactionType,
      market_board: marketType,
      investor_type: investorType,
    });
    if (date) {
      searchParams.append(
        "from",
        formatDate(date.from.toString(), "yyyy-MM-dd"),
      );
      searchParams.append("to", formatDate(date.to.toString(), "yyyy-MM-dd"));
    }

    try {
      const response = await fetch(
        `https://exodus.stockbit.com/findata-view/marketdetectors/activity/${brokerCode}/detail?${searchParams}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: process.env.NEXT_PUBLIC_ACCESS_TOKEN as string,
          },
        },
      );
      const { data } = (await response.json()) as {
        data: {
          broker_summary: {
            brokers_buy: BrokerBuy[];
            brokers_sell: BrokerSell[];
          };
          from: string;
          to: string;
        };
      };

      setbrokersActivity({
        buy: data.broker_summary.brokers_buy,
        sell: data.broker_summary.brokers_sell,
      });
      // to prevent infinite loop
      if (!date) {
        const fromDate = new Date(data.from);
        const toDate = new Date(data.to);

        fromDate.setDate(new Date(data.from).getDate() + 1);
        toDate.setDate(new Date(data.to).getDate() + 1);

        setDate({ from: fromDate, to: toDate });
      }
    } catch (error) {}
  };

  useEffect(() => {
    getBrokers();
  }, []);

  useEffect(() => {
    getBrokersActivity({
      brokerCode: selectedBroker,
      date,
      transactionType,
      marketType,
      investorType,
    });
  }, [selectedBroker, date, transactionType, marketType, investorType]);

  if (pageState.isLoading || brokers.length == 0) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <BrokerActivityFilter
        data={brokers}
        selectedBroker={selectedBroker}
        handleSelectedBroker={handleSelectedBroker}
      />
      <BrokerActivityDatePicker
        date={date?.from}
        handleDateChange={(date) =>
          setDate((prevState) =>
            prevState
              ? { ...prevState, from: date }
              : { from: date, to: dateToday },
          )
        }
      />
      <BrokerActivityDatePicker
        date={date?.to}
        handleDateChange={(date) =>
          setDate((prevState) =>
            prevState
              ? { ...prevState, to: date }
              : { from: dateToday, to: date },
          )
        }
      />
      <BrokerActivityInvestorFilter
        investorType={investorType}
        handleInvestorType={handleInvestorType}
      />
      <BrokerActivityMarketFilter
        marketType={marketType}
        handlemarketType={handlemarketType}
      />
      <BrokerActivityTransactionFilter
        transactionType={transactionType}
        handleTransactionType={handleTransactionType}
      />
      <div className="flex gap-x-4">
        <BrokerActivityTable
          columns={buyerColumns}
          data={brokersActivity.buy}
        />
        <BrokerActivityTable
          columns={sellerColumns}
          data={brokersActivity.sell}
        />
      </div>
    </main>
  );
}
