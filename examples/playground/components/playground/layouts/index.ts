export { DefaultLayout, type LayoutProps } from "./DefaultLayout";
export { SaasLayout } from "./SaasLayout";
export { SupportLayout } from "./SupportLayout";

import { DefaultLayout } from "./DefaultLayout";
import { SaasLayout } from "./SaasLayout";
import { SupportLayout } from "./SupportLayout";

export const layouts = {
  default: DefaultLayout,
  saas: SaasLayout,
  support: SupportLayout,
} as const;
