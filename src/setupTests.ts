// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";
import firebase from "firebase/app";
import "firebase/firestore";

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
