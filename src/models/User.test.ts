import { describeIfEmulatorUp } from "../firestoreTesting";
import { FirestoreEmu, prepareFirestore } from "../misc/firestore-test";
import { createUser, ssToUser, User } from "./User";

describe("User", () => {
  describeIfEmulatorUp("rules", () => {
    let fs: FirestoreEmu;

    describe("user own self", () => {
      beforeEach(async () => {
        fs = prepareFirestore("user-1");

        await createUserDoc({ id: "user-1", name: "User 1" });
      });

      afterEach(async () => {
        await fs.cleanUp();
      });

      it("can read", async () => {
        const doc = fs.collection("users").doc("user-1");
        const user = ssToUser(await doc.get());
        expect(user.name).toBe("User 1");
      });

      it("can write", async () => {
        const doc = fs.collection("users").doc("user-1");
        await doc.set(createUser({ name: "updated" }));
        const user = ssToUser(await fs.collection("users").doc("user-1").get());
        expect(user.name).toBe("updated");
      });
    });

    describe("another user", () => {
      beforeEach(async () => {
        fs = prepareFirestore("user-2");

        await createUserDoc({ id: "user-1", name: "User 1" });
      });

      afterEach(async () => {
        await fs.cleanUp();
      });

      it("can read", async () => {
        const doc = fs.collection("users").doc("user-1");
        const user = ssToUser(await doc.get());
        expect(user.name).toBe("User 1");
      });

      it("cannot write", async () => {
        const doc = fs.collection("users").doc("user-1");
        return expect(
          doc.set(createUser({ name: "updated" }))
        ).rejects.toThrow();
      });
    });

    describe("non-login user", () => {
      beforeEach(async () => {
        fs = prepareFirestore(undefined);

        await createUserDoc({ id: "user-1", name: "User 1" });
      });

      afterEach(async () => {
        await fs.cleanUp();
      });

      it("cannot read", async () => {
        const doc = fs.collection("users").doc("user-1");
        return expect(doc.get()).rejects.toThrow();
      });

      it("cannot write", () => {
        const doc = fs.collection("users").doc("user-1");
        return expect(
          doc.set(createUser({ name: "updated" }))
        ).rejects.toThrow();
      });
    });

    async function createUserDoc(initial: Partial<User>) {
      if (!initial.id) {
        throw new Error("ID is required for test");
      }

      const user = createUser(initial);
      const doc = fs.admin.collection("users").doc(user.id);
      await doc.set(user);
      return doc;
    }
  });
});
