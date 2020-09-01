import { describeIfEmulatorUp } from "../firestoreTesting";
import { FirestoreEmu, prepareFirestore } from "../misc/firestore-test";
import { createGroup, Group } from "./Group";
import { createGroupUser, GroupUser } from "./GroupUser";
import { createUser } from "./User";

describe("Group", () => {
  describeIfEmulatorUp("rules", () => {
    let fs: FirestoreEmu;

    describe("participant user", () => {
      beforeEach(async () => {
        fs = prepareFirestore("user-1");

        await createGroupDoc({ id: "group-1", name: "Group 1" });
        await createGroupUserDoc("group-1", { id: "user-1" });
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

    describe("non-login user", () => {
      beforeEach(async () => {
        fs = prepareFirestore(undefined);

        await createGroupDoc({ id: "group-1", name: "Group 1" });
        await createGroupUserDoc("group-1", { id: "user-1" });
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

    describe("non-participant", () => {
      beforeAll(async () => {
        fs = prepareFirestore("user-999");

        await createGroupDoc({ id: "group-1", name: "Group 1" });
        await createGroupUserDoc("group-1", { id: "user-1" });
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

    async function createGroupDoc(initial: Partial<Group>) {
      if (!initial.id) {
        throw new Error("ID is required for test");
      }

      const group = createGroup(initial);
      const doc = fs.admin.collection("groups").doc(group.id);
      await doc.set(group);

      return doc;
    }

    // TODO fix user data handling
    async function createGroupUserDoc(
      groupId: string,
      initial: Partial<GroupUser>
    ) {
      const user = createUser({ id: "user-1" });
      const groupUser = createGroupUser({
        id: user.id,
        privileges: ["login", "userManagement"],
        user,
      });
      const doc = await fs.admin
        .collection("groups")
        .doc(groupId)
        .collection("users")
        .doc(groupUser.id)
        .set(groupUser);

      return doc;
    }
  });
});
