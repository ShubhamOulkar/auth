import { Suspense } from "react";
import { Rsc } from "./rsc";

export function App() {
  return (
    <>
      <h1>RSC</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <Rsc />
      </Suspense>
    </>
  );
}
