import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router";
import Background from "./pages/Background";
const FormPage = lazy(() => import("./pages/FormPage"));
const TicketPage = lazy(() => import("./pages/TicketPage"));
import SkeConf from "./components/forms/Skeleton";

function App() {
  return (
    <Suspense fallback={<SkeConf />}>
      <Routes>
        <Route path="/conf" element={<Background />}>
          <Route index element={<FormPage />} />
          <Route path="ticket" element={<TicketPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
