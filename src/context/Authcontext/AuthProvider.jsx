import React, { useEffect, useState } from "react";
import { Authcontext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "../../firebase/firebase.innit";


const googleProvider = new GoogleAuthProvider()




const AuthProvider = ({ children }) => {
  const [loading, setLoding] = useState(true);

  const [user, setUser] = useState(null);

  const createUser = (email, password) => {
    setLoding(true);

    return createUserWithEmailAndPassword(auth, email, password);
  };

  const singIn = (email, password) => {
    setLoding(true);

    return signInWithEmailAndPassword(auth, email, password);
  };

const sinInwidthGoogle = () => {

setLoding(true)

return signInWithPopup(auth, googleProvider)

}



  const logOut = () => {
    // loading(true);

    return signOut(auth);
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
console.log('user in tha state change ' , currentUser)
      setLoding(false);
    });

    return () => {
      unSubscribe();
    };
  }, []);

  const authInfo = {
   createUser,
    singIn,
    sinInwidthGoogle,
    logOut,
    user,
    loading,
  };

  return <Authcontext value={authInfo}>{children}</Authcontext>;
};

export default AuthProvider;
