import { useContext } from "react";

import { ScrollContext } from "../components/common/AppScrollProvider";

export function useAppScroll() {
  const context = useContext(ScrollContext);

  if (!context) {
    throw new Error("useAppScroll must be used within AppScrollProvider.");
  }

  return context;
}
