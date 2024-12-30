import { useState } from "react";
import clsx from "clsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDown10, ArrowDownZA, ArrowUp01, ArrowUpAZ } from "lucide-react";
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

import { Broker, BrokerGroup } from "@/types/broker";
import { formatNumber } from "@/lib/formats";

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

type BrokerTableProps = {
  data: Broker[];
};

export default function BrokerTable({ data }: BrokerTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
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
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
