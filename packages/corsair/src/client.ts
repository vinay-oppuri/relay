"use client";

import { createCorsairReactClient } from "corsair/client/react";

export const corsairReact = createCorsairReactClient({
  baseURL: "/api/corsair",
});

export const {
  client: corsairClient,
  useConnectionStatus,
  useCreateConnectLink,
  useCreateTenant,
  useOAuthCallback,
  usePermission,
  usePlugin,
  usePlugins,
  useTenant,
  useTenants,
} = corsairReact;
