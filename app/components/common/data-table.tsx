import { ReactNode, Fragment } from "react";
import { RefreshCcw } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CompactPagination from "@/components/compact-pagination";

type DataTableColumn<T> = {
  header: ReactNode;
  render?: (item: T, index: number) => ReactNode;
  className?: string;
};

type PaginationConfig = {
  page: number;
  totalPages: number;
  perPage: number;
  searchParams: URLSearchParams;
};

type ControlsConfig = {
  search: string;
  onSearchChange: (value: string) => void;
  onPerPageChange: (value: number) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
};

type DataTableProps<T> = {
  items: T[];
  pagination: PaginationConfig;
  controls: ControlsConfig;
  columns?: DataTableColumn<T>[];
  renderRow?: (item: T, index: number) => ReactNode;
  searchPlaceholder?: string;
  emptyMessage?: ReactNode;
  headerActions?: ReactNode;
  perPageOptions?: number[];
  paginationColSpan?: number;
};

const DEFAULT_PER_PAGE_OPTIONS = [10, 20, 50, 100];

export default function DataTable<T>({
  items,
  pagination,
  controls,
  columns,
  renderRow,
  searchPlaceholder = "Search...",
  emptyMessage = "No items found",
  headerActions,
  perPageOptions = DEFAULT_PER_PAGE_OPTIONS,
  paginationColSpan,
}: DataTableProps<T>) {
  const { page, totalPages, perPage, searchParams } = pagination;
  const { search, onSearchChange, onPerPageChange, onRefresh, isRefreshing } = controls;

  const colCount = columns?.length ?? 0;
  if (colCount === 0 && !renderRow) {
    throw new Error("DataTable requires either columns or renderRow to be provided");
  }
  if (colCount === 0) {
    throw new Error("DataTable requires columns to be provided when using renderRow (for header and empty state)");
  }

  const paginationSpan = paginationColSpan ?? Math.floor(colCount / 2);
  const perPageSpan = colCount - paginationSpan;

  return (
    <div className="space-y-4">
      <div className="overflow-auto rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow className="border-b-0">
              <TableCell colSpan={colCount} className="bg-muted/70 py-4 pr-4!">
                <div className="flex items-center gap-4 justify-between">
                  <div className="w-5/12 max-w-full">
                    <Input
                      type="text"
                      placeholder={searchPlaceholder}
                      value={search}
                      onChange={(e) => onSearchChange(e.target.value)}
                      className="bg-background/90 border-border/60 shadow-sm focus:bg-background focus:border-border"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    {headerActions}
                    <Button size="icon" onClick={onRefresh} disabled={isRefreshing}>
                      <RefreshCcw className={isRefreshing ? "animate-spin" : ""} />
                    </Button>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableHeader>

          {columns && (
            <TableHeader>
              <TableRow>
                {columns.map((column, index) => (
                  <TableHead key={index} className={column.className}>
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
          )}

          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colCount} className="text-center py-8">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : renderRow ? (
              items.map((item, index) => <Fragment key={index}>{renderRow(item, index)}</Fragment>)
            ) : columns ? (
              items.map((item, index) => (
                <TableRow key={index} className="hover:bg-muted">
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex} className={column.className}>
                      {column.render?.(item, index)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : null}
          </TableBody>

          <TableHeader>
            <TableRow>
              <TableCell colSpan={paginationSpan} className="border-t">
                <div className="w-min">
                  <CompactPagination page={page} totalPages={totalPages} searchParams={searchParams} />
                </div>
              </TableCell>
              <TableCell colSpan={perPageSpan} className="border-t">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-sm text-muted-foreground">Items per page:</span>
                  <select
                    className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                    value={perPage}
                    onChange={(e) => onPerPageChange(Number(e.target.value))}
                  >
                    {perPageOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </TableCell>
            </TableRow>
          </TableHeader>
        </Table>
      </div>
    </div>
  );
}
