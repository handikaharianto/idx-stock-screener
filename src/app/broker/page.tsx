"use client";

import { useEffect, useState } from "react";
import { Broker, BrokerPeriod, MarketType } from "@/types/broker";
import PeriodFilter from "@/components/broker/period-filter";
import MarketTypeFilter from "@/components/broker/market-type-filter";
import ColumnFilter from "@/components/common/column-filter";
import BrokerTable from "@/components/broker/broker-table";
import { formatDate } from "@/lib/formats";

export default function Page() {
  const [brokers, setBrokers] = useState<Broker[]>([]);

  // filter states
  const [marketType, setMarketType] = useState<MarketType>(
    MarketType.ALL_MARKET,
  );
  const [period, setPeriod] = useState<BrokerPeriod>(BrokerPeriod.LATEST);
  const [date, setDate] = useState<string>("");

  const getTopBrokers = async ({
    period,
    marketType,
  }: {
    period: BrokerPeriod;
    marketType: MarketType;
  }) => {
    const searchParams = new URLSearchParams({
      sort: "TB_SORT_BY_TOTAL_VALUE",
      order: "ORDER_BY_DESC",
      period: period || undefined,
      market_type: marketType,
    });
    const response = await fetch(
      `https://exodus.stockbit.com/order-trade/broker/top?${searchParams}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.NEXT_PUBLIC_ACCESS_TOKEN as string,
        },
      },
    );
    const data = await response.json();

    setBrokers(data.data.list);
    setDate(
      `${formatDate(data.data.date.from)} - ${formatDate(data.data.date.to)}`,
    );
  };

  const handlePeriodChange = (value: BrokerPeriod) => {
    setPeriod(value);
  };

  const handleMarketTypeChange = (value: MarketType) => {
    setMarketType(value);
  };

  useEffect(() => {
    getTopBrokers({ period, marketType });
  }, [period, marketType]);

  return (
    <main>
      <div className="w-full">
        <div className="flex items-center py-4">
          <div className="flex items-center gap-x-2">
            <PeriodFilter
              period={period}
              date={date}
              handlePeriodChange={handlePeriodChange}
            />
            <MarketTypeFilter
              marketType={marketType}
              handleMarketTypeChange={handleMarketTypeChange}
            />
          </div>
          {/* <ColumnFilter table={table} /> */}
        </div>
        <div className="rounded-md border">
          <BrokerTable data={brokers} />
        </div>
      </div>
    </main>
  );
}
