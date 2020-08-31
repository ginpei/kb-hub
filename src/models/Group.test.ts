import * as firebase from "@firebase/testing";
import { describeIfEmulatorUp } from "../firestoreTesting";
import {
  cleanUpFirestore,
  prepareAdminFirestore,
  prepareFirestore,
} from "../misc/firestore-test";
import { createGroup, Group } from "./Group";
import { createGroupUser } from "./GroupUser";

describe("Group", () => {
  describeIfEmulatorUp("rules", () => {
    let fs: firebase.firestore.Firestore;
    let aColl: ReturnType<typeof fs["collection"]>;

    beforeAll(() => {
      const afs = prepareAdminFirestore();
      aColl = afs.collection("groups");
    });

    describe("participant user", () => {
      beforeAll(async () => {
        fs = prepareFirestore("user-1");

        await createGroupDoc({ id: "group-1", name: "Group 1" });
      });

      afterAll(async () => {
        await cleanUpFirestore();
      });

      it("can access", async () => {
        const ss = await fs.collection("groups").doc("group-1").get();
        expect(ss.data()?.name).toBe("Group 1");
      });
    });

    describe("non-login user", () => {
      beforeAll(async () => {
        fs = prepareFirestore(undefined);

        await createGroupDoc({ id: "group-1", name: "Group 1" });
      });

      afterAll(async () => {
        await cleanUpFirestore();
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
      const doc = aColl.doc(group.id);
      await doc.set(group);
      await doc.collection("users").add(createGroupUser());
      return doc;
    }
  });
});
