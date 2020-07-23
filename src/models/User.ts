import { useEffect, useState } from "react";

export function useCurrentUser(
  auth: firebase.auth.Auth
): [firebase.User | null, boolean, Error | null] {
  const [user, setUser] = useState<firebase.User | null>(auth.currentUser);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(
    () =>
      auth.onAuthStateChanged(
        (currentUser) => {
          setUser(currentUser);
          setReady(true);
        },
        (newError) => {
          if (newError instanceof Error) {
            setError(newError);
          } else {
            console.error(newError);
            setError(new Error("Unknown auth error"));
          }
          setReady(true);
        }
      ),
    [auth]
  );

  return [user, ready, error];
}
