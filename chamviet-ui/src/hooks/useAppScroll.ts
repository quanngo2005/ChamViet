import { useContext } from "react";

import { ScrollContext } from "../components/common/LenisProvider";

export function useAppScroll() {
  const context = useContext(ScrollContext);

  if (!context) {
    throw new Error("useAppScroll must be used within LenisProvider.");
  }

  return context;
}
