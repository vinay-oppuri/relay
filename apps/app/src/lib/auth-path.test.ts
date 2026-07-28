import assert from "node:assert/strict";
import test from "node:test";

import { safeNextPath } from "./auth-path.ts";

test("safeNextPath keeps local destinations and rejects open redirects", () => {
  assert.equal(
    safeNextPath("/inbox?q=urgent#latest"),
    "/inbox?q=urgent#latest",
  );
  assert.equal(safeNextPath("https://evil.example/steal"), "/");
  assert.equal(safeNextPath("//evil.example/steal"), "/");
  assert.equal(safeNextPath(null, "/login"), "/login");
});
