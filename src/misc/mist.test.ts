import { jcn } from "./misc";

describe("misc", () => {
  describe("jcn()", () => {
    it("joins only string items", () => {
      expect(jcn("A", 123, null, true, false, "Z")).toBe("A Z");
    });
  });
});
