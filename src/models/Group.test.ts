import { describeIfEmulatorUp } from "../firestoreTesting";
import { FirestoreEmu, prepareFirestore } from "../misc/firestore-test";
import { createGroup, Group } from "./Group";
import { GroupPrivileges } from "./GroupUser";

describe("Group", () => {
  describeIfEmulatorUp("rules", () => {
    let fs: FirestoreEmu;

    describe("group manager", () => {
      beforeEach(async () => {
        fs = prepareFirestore("user-1");

        await createGroupDoc({ id: "group-1", name: "Group 1" });
        await createGroupUserDoc({
          groupId: "group-1",
          privileges: {
            groupManagement: true,
            login: true,
          },
          userId: "user-1",
        });
      });

      afterEach(async () => {
        await fs.cleanUp();
      });

      it("can read", async () => {
        const ss = await fs.collection("groups").doc("group-1").get();
        expect(ss.data()?.name).toBe("Group 1");
      });

      it("can write", async () => {
        await fs
          .collection("groups")
          .doc("group-1")
          .update({ name: "updated" });

        const ss = await fs.collection("groups").doc("group-1").get();
        expect(ss.data()?.name).toBe("updated");
      });
    });

    describe("participant", () => {
      beforeEach(async () => {
        fs = prepareFirestore("user-1");

        await createGroupDoc({ id: "group-1", name: "Group 1" });
        await createGroupUserDoc({
          groupId: "group-1",
          privileges: {
            login: true,
          },
          userId: "user-1",
        });
      });

      afterEach(async () => {
        await fs.cleanUp();
      });

      it("can read", async () => {
        const ss = await fs.collection("groups").doc("group-1").get();
        expect(ss.data()?.name).toBe("Group 1");
      });

      it("cannot write", async () => {
        return expect(
          fs.collection("groups").doc("group-1").set({ name: "updated" })
        ).rejects.toThrow();
      });
    });

    describe("non-participant", () => {
      beforeAll(async () => {
        fs = prepareFirestore("user-1");

        await createGroupDoc({ id: "group-1", name: "Group 1" });
        await createGroupUserDoc({
          groupId: "group-1",
          privileges: {
            login: false,
          },
          userId: "user-1",
        });
      });

      afterAll(async () => {
        await fs.cleanUp();
      });

      it("cannot read", async () => {
        return expect(
          fs.collection("groups").doc("group-1").get()
        ).rejects.toThrow();
      });

      it("cannot write", async () => {
        return expect(
          fs.collection("groups").doc("group-1").set({ name: "updated" })
        ).rejects.toThrow();
      });
    });

    describe("non-login user", () => {
      beforeEach(async () => {
        fs = prepareFirestore(undefined);

        await createGroupDoc({ id: "group-1", name: "Group 1" });
      });

      afterEach(async () => {
        await fs.cleanUp();
      });

      it("cannot access", () => {
        return expect(
          fs.collection("groups").doc("group-1").get()
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
