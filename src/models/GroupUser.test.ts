import { describeIfEmulatorUp } from "../firestoreTesting";
import { FirestoreEmu, prepareFirestore } from "../misc/firestore-test";
import { createGroup, Group } from "./Group";
import {
  createGroupUser,
  GroupPrivileges,
  GroupUser,
  updatePrivileges,
} from "./GroupUser";

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

  describeIfEmulatorUp("rules", () => {
    let fs: FirestoreEmu;

    describe("user manager", () => {
      beforeEach(async () => {
        fs = prepareFirestore("user-1");

        await createGroupDoc({ id: "group-1", name: "Group 1" });
        await createGroupUserDoc({
          groupId: "group-1",
          privileges: {
            userManagement: true,
            login: true,
          },
          userId: "user-1",
        });
      });

      it("can read", async () => {
        const ss = await fs
          .collection("groups")
          .doc("group-1")
          .collection("users")
          .doc("user-1")
          .get();
        expect(ss.data()?.groupManagement).toBe(undefined);
      });

      it("can write", async () => {
        await fs
          .collection("groups")
          .doc("group-1")
          .collection("users")
          .doc("user-1")
          .update({ groupManagement: true });

        const ss = await fs
          .collection("groups")
          .doc("group-1")
          .collection("users")
          .doc("user-1")
          .get();
        expect(ss.data()?.groupManagement).toBe(true);
      });
    });

    describe("participant", () => {
      beforeEach(async () => {
        fs = prepareFirestore("user-1");

        await createGroupDoc({ id: "group-1", name: "Group 1" });
        await createGroupUserDoc({
          groupId: "group-1",
          privileges: {
            userManagement: false,
            login: true,
          },
          userId: "user-1",
        });
      });

      it("cannot read", async () => {
        return expect(
          fs
            .collection("groups")
            .doc("group-1")
            .collection("users")
            .doc("user-1")
            .get()
        ).rejects.toThrow();
      });

      it("cannot write", async () => {
        return expect(
          fs
            .collection("groups")
            .doc("group-1")
            .collection("users")
            .doc("user-1")
            .update({ groupManagement: true })
        ).rejects.toThrow();
      });
    });

    async function createGroupDoc(initial: Partial<Group>) {
      if (!initial.id) {
        throw new Error("ID is required for test");
      }

      const group = createGroup(initial);
      const doc = fs.admin.collection("groups").doc(group.id);
      await doc.set(group);

      return doc;
    }

    async function createGroupUserDoc(initial: Partial<GroupPrivileges>) {
      const doc = await fs.admin
        .collection("groups")
        .doc(initial.groupId)
        .collection("users")
        .doc(initial.userId)
        .set(initial.privileges || {});

      return doc;
    }
  });
});
