import { createGroupUser, updatePrivileges, GroupUser } from "./GroupUser";

describe("GroupUser", () => {
  describe("updatePrivileges()", () => {
    let result: GroupUser;

    beforeEach(() => {
      const gUser = createGroupUser({
        privileges: ["login"],
      });
      result = updatePrivileges(gUser, [
        ["login", false],
        ["userManagement", true],
      ]);
    });

    it("adds privileges", () => {
      expect(result.privileges).not.toContain("login");
    });

    it("removes privileges", () => {
      expect(result.privileges).toContain("userManagement");
    });
  });
});
