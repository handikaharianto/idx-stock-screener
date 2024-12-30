"use client";

import { useEffect, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowDown10,
  ArrowDownZA,
  ArrowUp01,
  ArrowUpAZ,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { capitalizeWords, formatNumber } from "@/lib/formats";
import clsx from "clsx";
import { Broker, BrokerGroup, BrokerPeriod, MarketType } from "@/types/broker";
import PeriodFilter from "@/components/broker/period-filter";

export const columns: ColumnDef<Broker>[] = [
  {
    accessorKey: "code",
    header: () => <div className="font-bold text-zinc-800">Code</div>,
    cell: ({ row }) => (
      <div
        className={clsx(
          "font-bold capitalize",
          row.original.group == BrokerGroup.LOCAL && "text-purple-700",
          row.original.group == BrokerGroup.FOREIGN && "text-red-700",
          row.original.group == BrokerGroup.GOVERNMENT && "text-green-700",
        )}
      >
        {row.getValue("code")}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: () => <div className="font-bold text-zinc-800">Name</div>,
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "total_value",
    header: () => <div className="font-bold text-zinc-800">Total Value</div>,
    cell: ({ row }) => {
      const amount = Number(row.getValue("total_value"));
      return <div className="font-bold">{formatNumber(amount)}</div>;
    },
  },
  {
    accessorKey: "net_value",
    header: () => <div className="font-bold text-zinc-800">Net Value</div>,
    cell: ({ row }) => {
      const amount = Number(row.getValue("net_value"));
      return (
        <div
          className={clsx(
            "font-medium",
            row.original.net_value.startsWith("-")
              ? "text-red-600"
              : "text-green-600",
          )}
        >
          {formatNumber(amount)}
        </div>
      );
    },
  },
  {
    accessorKey: "buy_value",
    header: () => <div className="font-bold text-zinc-800">Buy Value</div>,
    cell: ({ row }) => {
      const amount = Number(row.getValue("buy_value"));
      return (
        <div
          className={clsx(
            "font-medium",
            row.original.net_value.startsWith("-")
              ? "text-red-600"
              : "text-green-600",
          )}
        >
          {formatNumber(amount)}
        </div>
      );
    },
  },
  {
    accessorKey: "sell_value",
    header: () => <div className="font-bold text-zinc-800">Sell Value</div>,
    cell: ({ row }) => {
      const amount = Number(row.getValue("sell_value"));
      return (
        <div
          className={clsx(
            "font-medium",
            row.original.net_value.startsWith("-")
              ? "text-red-600"
              : "text-green-600",
          )}
        >
          {formatNumber(amount)}
        </div>
      );
    },
  },
  {
    accessorKey: "total_volume",
    header: () => <div className="font-bold text-zinc-800">Total Volume</div>,
    cell: ({ row }) => {
      const amount = Number(row.getValue("total_volume"));
      return <div className="font-medium">{formatNumber(amount)}</div>;
    },
  },
  {
    accessorKey: "total_frequency",
    header: () => (
      <div className="font-bold text-zinc-800">Total Frequency</div>
    ),
    cell: ({ row }) => {
      const amount = Number(row.getValue("total_frequency"));
      return <div className="font-medium">{formatNumber(amount)}</div>;
    },
  },
];

export function TopBroker() {
  // table states
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // filter states
  const [marketType, setMarketType] = useState<MarketType>(
    MarketType.ALL_MARKET,
  );
  const [period, setPeriod] = useState<BrokerPeriod>(BrokerPeriod.LATEST);

  const getTopBrokers = async (): Promise<Broker> => {
    const url = new URL("https://exodus.stockbit.com/order-trade/broker/top");
    const searchParams = new URLSearchParams({
      sort: "TB_SORT_BY_TOTAL_VALUE",
      order: "ORDER_BY_DESC",
      period: "TB_PERIOD_LAST_1_DAY",
      market_type: "MARKET_TYPE_ALL",
    });

    url.search = searchParams.toString();
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjU3MDc0NjI3LTg4MWItNDQzZC04OTcyLTdmMmMzOTNlMzYyOSIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZSI6ImhhbmRpa2FoYXJpYW50byIsImVtYSI6ImhhbmRpa2FoYXJpYW50bzAxQGdtYWlsLmNvbSIsImZ1bCI6IkhhbmRpa2EgSGFyaWFudG8iLCJzZXMiOiJjR3JrMURWYVNSajg1c21mIiwiZHZjIjoiIiwidWlkIjoyNjY5NDk4LCJjb3UiOiJDQSJ9LCJleHAiOjE3MzU2NjM4MzAsImlhdCI6MTczNTU3NzQzMCwiaXNzIjoiU1RPQ0tCSVQiLCJqdGkiOiJmNTI5Nzg0MC1jNTYzLTQxYjgtYTFiYi00NTg0NjA1NWFjNjgiLCJuYmYiOjE3MzU1Nzc0MzAsInZlciI6InYxIn0.R5lN7v_hCvJrxQRP_CRSveUiI7-LcnY2ppKw_4i4m4bjCCGznPW_XBFp5kZtwiB9zR4H51f9mB15hLafIgU606uBKHIfgUYJY2LLk51fkJ2Yv_9Ye2f36zuv2UP1EzfHJRdovFOFI0jLij5ES4_TNecg-MymC0LRvHX3T9S7fTHM58Yf9hRkvQcK8qa3c-jMSjlvW4yBq8ZFDlvrgC6ywV14Uw3Pq0NjtoP9UQNeCmzwwURaSHEheGXtLoLvlwuE18TuooJLvZhtlBVDSIQovaovZ83GtGxds7AFHmf86Ix-GGcpElyI9mgxA3CHH-0CyNFbr8Ijg38BUhL3zBP4ew",
      },
    });

    const data = await response.json();
    return data.data.list;
  };

  const handlePeriodChange = (value: BrokerPeriod) => {
    setPeriod(value);
  };

  useEffect(() => {});

  const table = useReactTable({
    data: brokers,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <div className="flex items-center gap-x-2">
          <PeriodFilter
            period={period}
            handlePeriodChange={handlePeriodChange}
          />
          <Select
            value={marketType}
            onValueChange={(value) => setMarketType(value as MarketType)}
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
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {capitalizeWords(column.id)}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort()
                              ? "flex cursor-pointer select-none items-center"
                              : ""
                          }
                          onClick={header.column.getToggleSortingHandler()}
                          title={
                            header.column.getCanSort()
                              ? header.column.getNextSortingOrder() === "asc"
                                ? "Sort ascending"
                                : header.column.getNextSortingOrder() === "desc"
                                  ? "Sort descending"
                                  : "Clear sort"
                              : undefined
                          }
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{
                            asc: (
                              <span>
                                {header.id == "code" || header.id == "name" ? (
                                  <ArrowUpAZ size={16} className="ml-2" />
                                ) : (
                                  <ArrowUp01 size={16} className="ml-2" />
                                )}
                              </span>
                            ),
                            desc: (
                              <span>
                                {header.id == "code" || header.id == "name" ? (
                                  <ArrowDownZA size={16} className="ml-2" />
                                ) : (
                                  <ArrowDown10 size={16} className="ml-2" />
                                )}
                              </span>
                            ),
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
