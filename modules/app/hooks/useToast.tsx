import React, { ReactNode, useCallback, useRef } from "react";
import { ExternalToast, toast } from "sonner";
import { CustomToast } from "../component/toast/toast";

type ToastOptions = ExternalToast & {
  title?: string;
  actions?: React.ReactNode;
  progress?: number;
};

type PromiseFunc<T = unknown> = Promise<T> | (() => Promise<T>);

type PromiseOpts<ToastData = any> = ExternalToast & {
  loading: string | React.ReactNode;
  success:
    | string
    | React.ReactNode
    | ((data: ToastData) => React.ReactNode | string);
  error: string | React.ReactNode | ((error: any) => React.ReactNode | string);
  loadingTitle?: string;
  successTitle?: string;
  errorTitle?: string;
};

type ToastMeta = {
  title?: string;
  description: string;
  type?: "success" | "error" | "warning" | "info" | "loading";
};

export function useToast() {
  const progressRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const createToast = useCallback((
    status: "success" | "error" | "warning" | "info" | "loading",
    message: ReactNode,
    opts?: ToastOptions
  ) => {
    const { title, actions, progress, ...data } = opts || {};
    
    const defaultTitles = {
      success: "Success",
      error: "Error",
      warning: "Warning",
      info: "Info",
      loading: "Loading...",
    };

    return toast.custom(
      (t) => (
        <CustomToast
          title={title || defaultTitles[status]}
          description={message}
          status={status}
          close={() => toast.dismiss(t)}
          actions={actions}
          progress={progress}
        />
      ),
      {
        duration: status === "loading" ? Infinity : 5000,
        ...data,
      }
    );
  }, []);

  const success = useCallback((message: ReactNode, opts?: ToastOptions) => {
    return createToast("success", message, opts);
  }, [createToast]);

  const error = useCallback((message: ReactNode, opts?: ToastOptions) => {
    return createToast("error", message, opts);
  }, [createToast]);

  const warning = useCallback((message: ReactNode, opts?: ToastOptions) => {
    return createToast("warning", message, opts);
  }, [createToast]);

  const info = useCallback((message: ReactNode, opts?: ToastOptions) => {
    return createToast("info", message, opts);
  }, [createToast]);

  const loading = useCallback((message: ReactNode, opts?: ToastOptions) => {
    return createToast("loading", message, opts);
  }, [createToast]);

  const dismiss = useCallback((id?: string | number) => {
    return toast.dismiss(id);
  }, []);

  const promise = useCallback(<T = any>(promise: PromiseFunc<T>, opts: PromiseOpts<T>) => {
    const p = promise instanceof Promise ? promise : promise();
    const id = loading(opts.loading, { 
      title: opts.loadingTitle || "Processing...",
      duration: Infinity 
    });

    p.then((data) => {
      const message = typeof opts.success === "function" ? opts.success(data) : opts.success;
      toast.custom(
        (t) => (
          <CustomToast
            title={opts.successTitle || "Success"}
            description={message}
            status="success"
            close={() => toast.dismiss(t)}
          />
        ),
        { id, duration: 5000 }
      );
    }).catch((error) => {
      const message = typeof opts.error === "function" ? opts.error(error) : opts.error;
      toast.custom(
        (t) => (
          <CustomToast
            title={opts.errorTitle || "Error"}
            description={message}
            status="error"
            close={() => toast.dismiss(t)}
          />
        ),
        { id, duration: 7000 }
      );
    });
    return id;
  }, [loading]);

  // Progress toast with animated progress bar
  const progress = useCallback((message: ReactNode, opts?: ToastOptions & { id?: string }) => {
    const toastId = opts?.id || `progress-${Date.now()}`;
    const [progressValue, setProgressValue] = React.useState(0);
    
    const updateProgress = (value: number) => {
      setProgressValue(Math.min(100, Math.max(0, value)));
    };

    const id = toast.custom(
      (t) => (
        <CustomToast
          title={opts?.title || "Progress"}
          description={message}
          status="loading"
          close={() => toast.dismiss(t)}
          progress={progressValue}
        />
      ),
      { 
        id: toastId,
        duration: Infinity,
        ...opts 
      }
    );

    return {
      id,
      update: updateProgress,
      complete: (finalMessage?: ReactNode) => {
        toast.custom(
          (t) => (
            <CustomToast
              title="Complete"
              description={finalMessage || message}
              status="success"
              close={() => toast.dismiss(t)}
              progress={100}
            />
          ),
          { id: toastId, duration: 3000 }
        );
      },
      error: (errorMessage?: ReactNode) => {
        toast.custom(
          (t) => (
            <CustomToast
              title="Error"
              description={errorMessage || "An error occurred"}
              status="error"
              close={() => toast.dismiss(t)}
            />
          ),
          { id: toastId, duration: 5000 }
        );
      }
    };
  }, []);

  // Toast from mutation meta
  const fromMeta = useCallback((meta: ToastMeta) => {
    const { title, description, type = "info" } = meta;
    return createToast(type, description, { title });
  }, [createToast]);

  return Object.assign(info, {
    success,
    error,
    warning,
    loading,
    dismiss,
    promise,
    progress,
    fromMeta,
  });
}
