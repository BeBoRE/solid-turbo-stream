import {
  QueryClient,
  QueryClientProvider as _QueryClientProvider,
} from "@tanstack/solid-query";
import { JSXElement } from "solid-js";

export const queryClient = new QueryClient();

export const QueryClientProvider = ({ children }: { children: JSXElement }) => (
  <_QueryClientProvider client={queryClient}>{children}</_QueryClientProvider>
);
