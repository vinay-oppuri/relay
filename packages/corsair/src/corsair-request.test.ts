import assert from "node:assert/strict";
import test from "node:test";

import { isCorsairDeliveryRequest } from "./corsair-request.ts";

test("only the exact Corsair base path is treated as Hub delivery", () => {
  assert.equal(
    isCorsairDeliveryRequest(
      new Request("http://localhost:3001/api/corsair?d=signed-token"),
    ),
    true,
  );
  assert.equal(
    isCorsairDeliveryRequest(
      new Request("http://localhost:3001/api/corsair/connection-status"),
    ),
    false,
  );
  assert.equal(
    isCorsairDeliveryRequest(
      new Request("http://localhost:3001/api/corsair-attacker"),
    ),
    false,
  );
});
