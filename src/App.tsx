import firebase from "firebase/app";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { CurrentUserProvider } from "./models/CurrentUserProvider";
import { Routings } from "./Routings";

const auth = firebase.auth();
const fs = firebase.firestore();

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <CurrentUserProvider auth={auth} fs={fs}>
        <Routings />
      </CurrentUserProvider>
    </BrowserRouter>
  );
};

export default App;
