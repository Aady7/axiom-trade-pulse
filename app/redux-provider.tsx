// app/redux-provider.tsx
"use client";

import { Provider } from "react-redux";
import { ReactNode, useRef } from "react";
import { AppStore, makeStore } from "../lib/store";

export function ReduxProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStore | undefined>(undefined);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
