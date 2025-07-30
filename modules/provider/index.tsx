import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { useToast } from "../app/hooks/useToast";

type QueryProviderProps = {
  children: ReactNode;
};

type MutationMeta = {
  successMessage?: {
    title?: string;
    description: string;
  };
  errorMessage?: {
    title?: string;
    description: string;
  };
  loadingMessage?: {
    title?: string;
    description: string;
  };
};

export function QueryProvider({ children }: QueryProviderProps) {
  const toast = useToast();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { retry: 0 } },
        mutationCache: new MutationCache({
          onMutate: (variables, mutation) => {
            console.log("on mutate", { variables, mutation });
            const meta = mutation.options.meta as MutationMeta;

            if (meta?.loadingMessage) {
              toast.loading(meta.loadingMessage.description, {
                title: meta.loadingMessage.title || "Processing...",
                duration: Infinity,
              });
            }
          },
          onSuccess: (data, variables, context, mutation) => {
            console.log({ data, variables, context, mutation });

            const meta = mutation.options.meta as MutationMeta;

            if (meta?.successMessage) {
              toast.success(meta.successMessage.description, {
                title: meta.successMessage.title || "Success",
                duration: 5000,
              });
            }
          },
          onError: (error, variables, context, mutation) => {
            console.log({ error, variables, context, mutation });

            const meta = mutation.options.meta as MutationMeta;

            if (meta?.errorMessage) {
              toast.error(meta.errorMessage.description, {
                title: meta.errorMessage.title || "Error",
                duration: 7000,
              });
            } else if (error instanceof Error) {
              toast.error(error.message, {
                title: "Error",
                duration: 7000,
              });
            } else {
              toast.error("An unexpected error occurred", {
                title: "Error",
                duration: 7000,
              });
            }
          },
        }),
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
