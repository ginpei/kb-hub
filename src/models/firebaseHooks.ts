import { useEffect, useState } from "react";
import { noop } from "../misc/misc";

export function useDocument<T>(
  doc: firebase.firestore.DocumentReference | null,
  ssToData: (ss: firebase.firestore.DocumentSnapshot) => T
): [T | null, boolean, Error | null] {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(
    () => {
      setData(null);
      setError(null);
      setReady(false);

      if (!doc) {
        return noop;
      }

      return doc.onSnapshot(
        (ss) => {
          setError(null);

          if (ss.exists) {
            setData(ssToData(ss));
          } else {
            setData(null);
          }

          setReady(true);
        },
        (e) => {
          setReady(true);
          setError(e);
        }
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [doc?.path, ssToData]
  );

  return [data, ready, error];
}
