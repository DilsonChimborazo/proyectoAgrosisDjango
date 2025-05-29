import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import { AuthProvider } from "./context/AuthContext";
import "@/styles/globals.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Provider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </Provider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
