import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import Nav from "~/components/Nav";
import "./app.css";
import { QueryClientProvider } from "./utils/query";

export default function App() {
  return (
    <QueryClientProvider>
      <Router
        root={(props) => (
          <>
            <Nav />
            <Suspense>{props.children}</Suspense>
          </>
        )}
      >
        <FileRoutes />
      </Router>
    </QueryClientProvider>
  );
}
