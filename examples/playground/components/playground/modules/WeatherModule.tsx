"use client";

import { memo } from "react";
import { WeatherCard } from "../cards/WeatherCard";

interface WeatherModuleProps {
  show: boolean;
}

function WeatherModuleComponent({ show }: WeatherModuleProps) {
  if (!show) return null;
  return <WeatherCard isPreview />;
}

export const WeatherModule = memo(WeatherModuleComponent);
