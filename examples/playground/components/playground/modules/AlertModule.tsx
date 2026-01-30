"use client";

import { memo } from "react";
import { NotificationCard } from "../cards/NotificationCard";

interface AlertModuleProps {
  show: boolean;
}

function AlertModuleComponent({ show }: AlertModuleProps) {
  if (!show) return null;
  return <NotificationCard isPreview />;
}

export const AlertModule = memo(AlertModuleComponent);
