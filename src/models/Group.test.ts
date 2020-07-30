import * as firebase from "@firebase/testing";
import { createGroup, Group } from "./Group";
import { createGroupUser } from "./GroupUser";

describe("Group", () => {
  describe("rules", () => {
    const projectId = "my-test-project";
    let fs: firebase.firestore.Firestore;
    let afs: firebase.firestore.Firestore;
    let aColl: ReturnType<typeof fs["collection"]>;

    beforeAll(() => {
      const adminApp = firebase.initializeAdminApp({ projectId });
      afs = adminApp.firestore();
      aColl = afs.collection("groups");
    });

    describe("participant user", () => {
      beforeAll(async () => {
        fs = prepareFirestore("user-1");

        await createGroupDoc({ id: "group-1", name: "Group 1" });
      });

      afterAll(async () => {
        await firebase.clearFirestoreData({ projectId });
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
        await firebase.clearFirestoreData({ projectId });
      });

      it("cannot access", () => {
        return expect(
          fs.collection("groups").doc("group-1").get()
        ).rejects.toThrow();
      });
    });

    function prepareFirestore(uid: string | undefined) {
      const auth = uid ? { uid } : undefined;
      const app = firebase.initializeTestApp({ projectId, auth });
      const firestore = app.firestore();
      return firestore;
    }

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
