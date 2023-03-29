import React, { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { Box, Center, Text, Stack, Divider, Input, Button, Form } from "@chakra-ui/react";
import { auth } from "./firebase.js";
import { db } from "./firebase";
import { getFirestore, doc, addDoc, getDocs, setDoc, collection } from "firebase/firestore";
export default function UserLogin({ user, setUser }) {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loginErrorMessage, setLoginErrorMessage] = useState("");
  const [registerErrorMessage, setRegisterErrorMessage] = useState("");
  const [users, setUsers] = useState([]);
  const usersRef = collection(db, "users");

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getUsers();
  }, []);
  const usersCollectionRef = collection(db, "users");
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user);
    }
  });

  async function createNewUser(uid) {
    console.log("creating new user");
    await setDoc(doc(db, "users", uid), {
      displayName: username,
      email: registerEmail,
      account_created: new Date().toLocaleString(),
      uid: uid,
    });
    window.location.reload();
  }

  async function register(e) {
    e.preventDefault();
    try {
      let ok = true;
      //eslint-disable-next-line
      users.map((user) => {
        if (user.displayName === username) {
          ok = false;
        }
      });
      if (!ok) return setRegisterErrorMessage("Username already in use");

      if (username === "") {
        setRegisterErrorMessage("Username cannot be empty");
        return;
      }
      if (registerPassword !== confirmPassword) {
        setRegisterErrorMessage("Passwords do not match");
        return;
      }

      const user = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
      await updateProfile(auth.currentUser, { displayName: username }).catch((err) => console.log(err));

      console.log(auth.currentUser.uid);
      setRegisterErrorMessage("");
      createNewUser(auth.currentUser.uid);
    } catch (error) {
      console.log(error.message);
      if (
        error.message === "Firebase: Error (auth/invalid-email)." ||
        error.message === "Firebase: Error (auth/internal-error)."
      ) {
        setRegisterErrorMessage("Invalid email");
      } else if (
        error.message === "Firebase: Password should be at least 6 characters (auth/weak-password)."
      ) {
        setRegisterErrorMessage("Password should be at least 6 characters");
      } else if (error.message === "Firebase: Error (auth/email-already-in-use).") {
        setRegisterErrorMessage("Email already in use");
      }
    }
  }
  async function login(e) {
    e.preventDefault();
    try {
      const user = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);

      console.log(user);
      setLoginErrorMessage("");
    } catch (error) {
      if (
        error.message === "Firebase: Error (auth/user-not-found)." ||
        error.message === "Firebase: Error (auth/invalid-email)."
      ) {
        setLoginErrorMessage("Invalid email");
      } else if (
        error.message === "Firebase: Error (auth/internal-error)." ||
        error.message === "Firebase: Error (auth/wrong-password)."
      ) {
        setLoginErrorMessage("Incorrect password");
      } else if (
        error.message ===
        "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests)."
      ) {
        setLoginErrorMessage(`Too many failed login attempts to ${loginEmail}. Please try again later.`);
      }
      console.log(error.message);
    }
  }

  async function signout() {
    await signOut(auth);
    window.location.reload();
  }
  return (
    <Center>
      {" "}
      <Box paddingTop="75px" className="whiteText mainFont" width="50%">
        <Center>
          <Box>
            <Stack direction="row">
              <form onSubmit={register}>
                <Box width="40%">
                  <Text paddingBottom="25px" className="font500" fontSize="24px">
                    {" "}
                    register user{" "}
                  </Text>

                  <Input
                    placeholder="Username"
                    onChange={(event) => {
                      setUsername(event.target.value);
                    }}
                  />
                  <Input
                    placeholder="Email"
                    onChange={(event) => {
                      setRegisterEmail(event.target.value);
                    }}
                  />
                  <Input
                    placeholder="Password"
                    type="password"
                    onChange={(event) => {
                      setRegisterPassword(event.target.value);
                    }}
                  />
                  <Input
                    placeholder="Confirm Password"
                    type="password"
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                    }}
                  />
                  <Center>
                    <p className="currentIncorrect">{registerErrorMessage}</p>
                  </Center>
                  <Center>
                    <Button marginTop="20px" type="submit" backgroundColor={"#555"} onClick={register}>
                      Sign Up
                    </Button>
                  </Center>
                </Box>
              </form>
              <Box width="35%">
                <form onSubmit={login}>
                  <Text fontSize="24px" paddingBottom={"25px"} className="font500">
                    {" "}
                    log in{" "}
                  </Text>
                  <Input
                    placeholder="Email"
                    onChange={(event) => {
                      setLoginEmail(event.target.value);
                    }}
                  />
                  <Input
                    placeholder="Password"
                    type="password"
                    onChange={(event) => {
                      setLoginPassword(event.target.value);
                    }}
                  />
                  <Center>
                    <Button marginTop="20px" bgColor={"#555"} type="submit" onClick={login}>
                      Log In
                    </Button>
                  </Center>
                </form>
              </Box>
            </Stack>
          </Box>
        </Center>
      </Box>
    </Center>
  );
}
