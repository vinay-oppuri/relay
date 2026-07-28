export function isCorsairDeliveryRequest(
  request: Request,
  basePath = "/api/corsair",
) {
  const pathname = new URL(request.url).pathname.replace(/\/$/, "");
  return pathname === basePath.replace(/\/$/, "");
}
