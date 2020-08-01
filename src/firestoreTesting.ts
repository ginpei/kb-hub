import firebase from "firebase/app";
import "firebase/firestore";

/**
 * The same as `describe()`, or skip if Firebase emulator is running.
 *
 * To activate, set `FB_EMULATOR` env var.
 *
 * ```console
 * npx firebase emulators:exec "FB_EMULATOR=true CI=true npm test"
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
