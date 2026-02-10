import React, { useEffect, useState } from "react";
import { Authcontext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../firebase/firebase.innit";

const googleProvider = new GoogleAuthProvider();

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
    setLoding(true);

    return signInWithPopup(auth, googleProvider);
  };

  const updateUserProfile = (profileInfo) => {
    return updateProfile(auth.currentUser, profileInfo);
  };

  const logOut = () => {
    // loading(true);

    return signOut(auth);
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    
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
    updateUserProfile,
    logOut,
    user,
    loading,
  };

  return <Authcontext value={authInfo}>{children}</Authcontext>;
};

export default AuthProvider;
