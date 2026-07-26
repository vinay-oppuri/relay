import { toNextJsHandler, type ManagementHandlerOptions } from "corsair";

import { getCorsair } from "./corsair";

export { getCorsair, type RelayCorsair } from "./corsair";

export function createCorsairNextHandlers(options?: ManagementHandlerOptions) {
  const handle = (method: "GET" | "OPTIONS" | "POST") => (request: Request) =>
    toNextJsHandler(getCorsair(), options)[method](request);

  return {
    GET: handle("GET"),
    OPTIONS: handle("OPTIONS"),
    POST: handle("POST"),
  };
}
