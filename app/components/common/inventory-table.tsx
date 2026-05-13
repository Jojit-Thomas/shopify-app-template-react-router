import { useState, Fragment } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/common/data-table";

type InventoryItem = {
  sku: string;
  fileName: string;
  fileModificationTime: Date | string;
  locations: Array<{
    locationNumber: number;
    quantity: number;
  }>;
  storedAt: Date | string;
};

type InventoryTableProps = {
  items: InventoryItem[];
  page: number;
  totalPages: number;
  perPage: number;
  search: string;
  searchParams: URLSearchParams;
  onSearchChange: (value: string) => void;
  onPerPageChange: (value: number) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
};

export default function InventoryTable({
  items,
  page,
  totalPages,
  perPage,
  search,
  searchParams,
  onSearchChange,
  onPerPageChange,
  onRefresh,
  isRefreshing,
}: InventoryTableProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const getTotalQuantity = (locations: InventoryItem["locations"]) => {
    return locations.reduce((sum, loc) => sum + loc.quantity, 0);
  };

  // Format date consistently for server and client to avoid hydration mismatches
  const formatDateTime = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <DataTable
      items={items}
      pagination={{ page, totalPages, perPage, searchParams }}
      controls={{
        search,
        onSearchChange,
        onPerPageChange,
        onRefresh,
        isRefreshing,
      }}
      searchPlaceholder="Search SKU..."
      emptyMessage="No inventory items found"
      paginationColSpan={3}
      renderRow={(item, index) => {
        const totalQty = getTotalQuantity(item.locations);
        const isExpanded = expanded === item.sku;
        const uniqueKey = `${item.sku}-${index}-${item.storedAt}`;

        return (
          <Fragment key={uniqueKey}>
            <TableRow className="hover:bg-muted">
              <TableCell className="font-mono font-medium">{item.sku}</TableCell>
              <TableCell>
                <span className="font-semibold">{totalQty}</span>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2">
                  {item.locations.map((loc, locIndex) => (
                    <span
                      key={`${item.sku}-loc-${loc.locationNumber}-${locIndex}`}
                      className="text-xs px-2 py-1 rounded bg-muted"
                    >
                      Loc {loc.locationNumber}: {loc.quantity}
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{formatDateTime(item.storedAt)}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" onClick={() => setExpanded(isExpanded ? null : item.sku)}>
                  {isExpanded ? "Hide" : "Details"}
                </Button>
              </TableCell>
            </TableRow>
            {isExpanded && (
              <TableRow>
                <TableCell colSpan={5}>
                  <div className="mt-2 text-sm bg-muted p-4 rounded-md">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpanded(null)}
                      className="mb-2 text-muted-foreground"
                    >
                      Hide Details
                    </Button>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">SKU:</span> <span className="font-mono">{item.sku}</span>
                      </div>
                      <div>
                        <span className="font-medium">Locations:</span>
                        <div className="mt-2 space-y-1">
                          {item.locations.map((loc, locIndex) => (
                            <div
                              key={`${item.sku}-detail-loc-${loc.locationNumber}-${locIndex}`}
                              className="flex items-center gap-2"
                            >
                              <span className="font-mono text-xs">Location {loc.locationNumber}:</span>
                              <span className="font-semibold">{loc.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </Fragment>
        );
      }}
      columns={[
        { header: "SKU" },
        { header: "Total Quantity" },
        { header: "Locations" },
        { header: "Stored At" },
        { header: "Actions" },
      ]}
    />
  );
}
