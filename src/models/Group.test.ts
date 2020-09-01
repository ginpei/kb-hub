import { describeIfEmulatorUp } from "../firestoreTesting";
import { FirestoreEmu, prepareFirestore } from "../misc/firestore-test";
import { createGroup, Group } from "./Group";
import { createGroupUser } from "./GroupUser";

describe("Group", () => {
  describeIfEmulatorUp("rules", () => {
    let fs: FirestoreEmu;

    describe("participant user", () => {
      beforeEach(async () => {
        fs = prepareFirestore("user-1");

        await createGroupDoc({ id: "group-1", name: "Group 1" });
      });

      afterEach(async () => {
        await fs.cleanUp();
      });

      it("can access", async () => {
        const ss = await fs.collection("groups").doc("group-1").get();
        expect(ss.data()?.name).toBe("Group 1");
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
      await doc.collection("users").add(createGroupUser());
      return doc;
    }
  });
});
