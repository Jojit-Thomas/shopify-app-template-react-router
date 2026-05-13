import type { ReactNode } from "react";
import { useState } from "react";
import { Minimize2, Maximize2 } from "lucide-react";
import AppShowcase from "./app-showcase";

type AppLayoutWrapperProps = {
  children: ReactNode;
  className?: string;
  defaultFullSize?: boolean;
  onToggleFullSize?: (isFullSize: boolean) => void;
};

const AppLayoutWrapper = ({
  children,
  className = "",
  defaultFullSize = true,
  onToggleFullSize,
}: AppLayoutWrapperProps) => {
  const [isFullSize, setIsFullSize] = useState(defaultFullSize);

  const handleToggleFullSize = () => {
    const newFullSize = !isFullSize;
    setIsFullSize(newFullSize);
    onToggleFullSize?.(newFullSize);
  };

  return (
    <div
      className={`
        transition-all duration-500 ease-in-out
        ${isFullSize ? "fixed inset-0 z-50 p-0 bg-background" : "flex-1 overflow-hidden p-6 bg-background"}
        text-foreground
      `}
    >
      <div
        className={`
          transition-all duration-500 ease-in-out transform
          ${
            isFullSize
              ? "w-full h-full rounded-none shadow-none border-0 scale-100"
              : "border-2 border-primary rounded-4xl shadow-lg h-[80dvh] hover:shadow-xl hover:scale-[1.002]"
          }
          overflow-hidden bg-card relative flex flex-col
        `}
      >
        {/* Toggle Button */}
        <button
          onClick={handleToggleFullSize}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors"
          aria-label={isFullSize ? "Exit full size" : "Enter full size"}
        >
          {isFullSize ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>

        <div className={`flex-1 overflow-hidden ${className}`}>{children}</div>
      </div>

      {/* AppShowcase with fade transition */}
      <div
        className={`
          transition-opacity duration-500 ease-in-out
          ${isFullSize ? "opacity-0 pointer-events-none" : "opacity-100"}
        `}
      >
        <AppShowcase />
      </div>

      {/* Overlay for full-size mode */}
      {isFullSize && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10 transition-opacity duration-500 ease-in-out"
          onClick={handleToggleFullSize}
        />
      )}
    </div>
  );
};

export default AppLayoutWrapper;
