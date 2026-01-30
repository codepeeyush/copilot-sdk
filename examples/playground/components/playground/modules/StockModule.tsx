"use client";

import { memo } from "react";
import { StockCard } from "../cards/StockCard";

interface StockModuleProps {
  show: boolean;
}

function StockModuleComponent({ show }: StockModuleProps) {
  if (!show) return null;
  return <StockCard isPreview />;
}

export const StockModule = memo(StockModuleComponent);
