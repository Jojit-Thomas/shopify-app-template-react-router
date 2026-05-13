import { API } from "@/types/api";
import { loader as inventoryLatestLoader } from "@/routes/api.inventory.latest";
import { ProcessedImportFile } from "@prisma/client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

type LatestFile = {
  fileName: string;
  modificationTime: string;
  size: number;
};

type InventoryFileStatusProps = {
  lastProcessedFile: ProcessedImportFile | null;
};

const STATUS_MAP = {
  SUCCESS: {
    icon: "✓",
    className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  COMPLETED: {
    icon: "✓",
    className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  PARTIAL: {
    icon: "!",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  },
  FAILED: {
    icon: "✕",
    className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
  FAILED_SFTP: {
    icon: "✕",
    className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
  PENDING_SHOPIFY: {
    icon: "⟳",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
};

const getStatusMeta = (status?: string | null) => {
  if (!status) {
    return {
      icon: "•",
      className: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
    };
  }
  const normalized = status.toUpperCase() as keyof typeof STATUS_MAP;
  return (
    STATUS_MAP[normalized] ?? {
      icon: "•",
      className: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
    }
  );
};

const formatStatusLabel = (status?: string | null) => {
  if (!status) {
    return "Unknown";
  }
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

// Format date consistently for server and client to avoid hydration mismatches
const formatDate = (date: Date | string) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const formatTime = (date: Date | string) => {
  const d = new Date(date);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function InventoryFileStatus({ lastProcessedFile }: InventoryFileStatusProps) {
  const [latestFile, setLatestFile] = useState<LatestFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestFile = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/inventory/latest");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: API<typeof inventoryLatestLoader> = await response.json();

        if (data.success) {
          setLatestFile(data.file);
        } else {
          setError(data.message || "Failed to fetch latest file");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch latest file");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestFile();
  }, []);

  const isLatestProcessed =
    latestFile &&
    lastProcessedFile &&
    latestFile.fileName === lastProcessedFile.fileName &&
    (lastProcessedFile.sftpStatus || "").toUpperCase() === "SUCCESS";
  const shopifyStatus = lastProcessedFile?.shopifyStatus || lastProcessedFile?.processingStatus;

  const statusMeta = getStatusMeta(shopifyStatus);

  return (
    <div className="space-y-2 border-b pb-4">
      {lastProcessedFile && (
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="text-muted-foreground">Last processed:</span>
          <span className="font-mono">{lastProcessedFile.fileName}</span>
          <span className="text-muted-foreground">
            ({formatDate(lastProcessedFile.processedAt)} {formatTime(lastProcessedFile.processedAt)})
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ${statusMeta.className}`}
          >
            <span>{statusMeta.icon}</span>
            <span>{formatStatusLabel(shopifyStatus)}</span>
          </span>
          {lastProcessedFile.totalItemsProcessed > 0 && (
            <>
              <span className="text-muted-foreground">|</span>
              <span className="text-muted-foreground">{lastProcessedFile.totalItemsProcessed} items</span>
            </>
          )}
        </div>
      )}

      <div className="text-sm">
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            Checking latest file...
          </div>
        ) : error ? (
          <span className="text-destructive">Error: {error}</span>
        ) : latestFile ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm">{latestFile.fileName}</span>
            <span className="text-muted-foreground">
              (Modified {formatDate(latestFile.modificationTime)} {formatTime(latestFile.modificationTime)})
            </span>
            <span className="text-muted-foreground">• {(latestFile.size / 1024).toFixed(1)} KB</span>
            <span className="text-muted-foreground">
              • {isLatestProcessed ? "Already processed" : "Awaiting import"}
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground">No inventory files found</span>
        )}
      </div>
    </div>
  );
}
