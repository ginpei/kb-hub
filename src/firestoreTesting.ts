import firebase from "firebase/app";
import "firebase/firestore";

/**
 * The same as `describe()`, or skip if Firebase emulator is running.
 *
 * To activate, set `FB_EMULATOR` env var.
 *
 * For CI, you can use `exec`:
 *
 * ```console
 * npx firebase emulators:exec "FB_EMULATOR=true CI=true npm test"
 * ```
 *
 * For local, execute tests while emulator is running, and restart emu when you
 * update rules:
 *
 * ```console
 * npx firebase emulators:start --only firestore &
 * FB_EMULATOR=1 npm test
 * ```
 */
export const describeIfEmulatorUp: jest.Describe = process.env.FB_EMULATOR
  ? describe
  : describe.skip;

// fix error:
//   FirebaseError: Function DocumentReference.set() called with invalid data.
//   Unsupported field value: a custom Timestamp object
firebase.firestore.Timestamp = class Timestamp extends Date {
  get seconds() {
    return Math.floor(this.getTime() / 1000);
  }

  constructor(seconds: number) {
    super(seconds * 1000);
  }

  toMillis() {
    return this.getTime();
  }
} as any;
