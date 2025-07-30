import React, { ReactNode } from "react";
import { cn } from "../../utils";

type CustomToastProps = {
  title: string;
  description: ReactNode;
  actions?: React.ReactNode;
  close: () => void;
  status: "success" | "error" | "warning" | "info" | "loading";
  duration?: number;
  progress?: number;
};

const StatusIcon = ({ status }: { status: CustomToastProps["status"] }) => {
  const iconClasses = "w-5 h-5";
  
  switch (status) {
    case "success":
      return (
        <div className="flex-shrink-0">
          <svg className={cn(iconClasses, "text-green-500")} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
      );
    case "error":
      return (
        <div className="flex-shrink-0">
          <svg className={cn(iconClasses, "text-red-500")} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
      );
    case "warning":
      return (
        <div className="flex-shrink-0">
          <svg className={cn(iconClasses, "text-yellow-500")} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
      );
    case "info":
      return (
        <div className="flex-shrink-0">
          <svg className={cn(iconClasses, "text-blue-500")} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
      );
    case "loading":
      return (
        <div className="flex-shrink-0">
          <svg className={cn(iconClasses, "text-blue-500 animate-spin")} fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      );
    default:
      return null;
  }
};

export const CustomToast = ({
  title,
  description,
  actions,
  status,
  close,
  duration,
  progress,
}: CustomToastProps) => {
  return (
    <div className="group relative bg-background shadow-elements rounded-xl flex p-4 border border-dialog-border max-w-[400px] min-w-[320px] transition-all duration-300 ease-out hover:shadow-lg">
      {/* Status Icon */}
      <div className="flex-shrink-0 mr-3 mt-0.5">
        <StatusIcon status={status} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col gap-1">
          <h3
            className={cn("sub-heading select-none font-medium font-sans leading-tight", {
              "text-green-600": status === "success",
              "text-red-600": status === "error",
              "text-yellow-600": status === "warning",
              "text-blue-600": status === "info",
              "text-gray-600": status === "loading",
            })}
          >
            {title}
          </h3>
          {description && (
            <p className="text-new-muted-foreground text-sm font-sans select-none leading-relaxed">
              {description}
            </p>
          )}
          {actions && (
            <div className="flex gap-2 mt-2">
              {actions}
            </div>
          )}
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={close}
        className="flex-shrink-0 size-6 p-1 hover:bg-new-elements hover:text-new-foreground duration-150 ease-out text-new-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-2"
        aria-label="Close"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 18 18"
        >
          <g
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <line x1="14" y1="4" x2="4" y2="14"></line>
            <line x1="4" y1="4" x2="14" y2="14"></line>
          </g>
        </svg>
      </button>

      {/* Progress Bar */}
      {progress !== undefined && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-xl overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};
