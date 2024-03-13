import React, {useState, useEffect} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import {gitProvider} from "./firebase.js";
import {Box, HStack, Center, Text, Stack, Divider, Input, Button, Form, VStack, IconButton} from "@chakra-ui/react";
import {auth, signInWithGoogle} from "./firebase.js";
import {db} from "./firebase";
import {getFirestore, doc, addDoc, getDocs, setDoc, collection, query, where} from "firebase/firestore";

export default function UserLogin({setGitLogin, config, user, setUser}) {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loginErrorMessage, setLoginErrorMessage] = useState("");
  const [registerErrorMessage, setRegisterErrorMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [loginPage, setLoginPage] = useState(true);
  const usersRef = collection(db, "users");
  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
    };
    getUsers();
  }, []);
  const usersCollectionRef = collection(db, "users");
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user);
    }
  });

  async function createNewUser(uid, googleName, googleEmail) {
    if (googleName) {
      // if new user with google
      await setDoc(doc(db, "users", uid), {
        displayName: googleName,
        email: googleEmail,
        account_created: new Date().toUTCString(),
        uid: uid,
      }).then(() => {
        console.log("new user created");
        if (auth) updateProfile(auth.currentUser, {displayName: googleName}).catch((err) => console.log(err));
        window.location.replace(`/profile/${googleName}`);
      });

    } else {
      await setDoc(doc(db, "users", uid), {
        displayName: username,
        email: registerEmail,
        account_created: new Date().toUTCString(),
        uid: uid,
      });

      window.location.replace(`/profile/${username}`);
    }
    console.log("new user created");
  }

  async function github() {
    let login = false;

    const res = signInWithPopup(auth, gitProvider)
      .then((result) => {
        const name = result.user.reloadUserInfo.screenName;
        const email = result.user.email;
        const uid = result.user.uid;
        console.log(result);

        users.map((user) => {
          if (user.uid === uid) {
            login = true;
          }
        });
        let tryThisName = name;

        if (!login) {
          let numDuplicates = 2;
          while (true) {
            let ok = true;
            //eslint-disable-next-line
            users.map((user) => {
              if (user.displayName === tryThisName) {
                ok = false;
              }
            });
            if (ok) {
              createNewUser(uid, tryThisName, email);

              break;
            }
            tryThisName = `${name} (${numDuplicates})`;
            numDuplicates++;
          }
          if (auth) {
            setGitLogin(true);
            updateProfile(auth.currentUser, {displayName: result.user.reloadUserInfo.screenName}).catch(
              (err) => console.log(err)
            );
          }
        }
        if (login) {
          window.location.replace(`/`);
        }
      })
      .catch((err) => {
        setLoginErrorMessage(err.message);
        console.log(err.message);
      });
  }

  function google() {
    let login = false;
    const userInfo = signInWithGoogle()
      .then((result) => {
        const name = result.user.displayName;
        const email = result.user.email;
        const uid = result.user.uid;
        users.map((user) => {
          console.log(user.uid, uid);
          if (user.uid === uid) {
            login = true;
          }
        });
        let tryThisName = name;

        if (!login) {
          let numDuplicates = 2;
          while (true) {
            let ok = true;
            //eslint-disable-next-line
            users.map((user) => {
              if (user.displayName === tryThisName) {
                ok = false;
              }
            });
            if (ok) {
              createNewUser(uid, tryThisName, email);
              break;
            }
            tryThisName = `${tryThisName} (${numDuplicates})`;
            numDuplicates++;
          }
        }
        if (login) {
          window.location.replace(`/`);
        }
      })
      .catch((error) => {
        setLoginErrorMessage(error.message);
        console.log(error.message);
      });
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
      await updateProfile(auth.currentUser, {displayName: username}).catch((err) => console.log(err));

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

      setLoginErrorMessage("");
      window.location.replace("/");
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

  return (

    <Center>
      {" "}
      <Box marginTop="105px" borderRadius='15px' boxShadow={'0px 1px 15px 3px rgba(0,0,0, 0.12)'}
           minW={['80%', '70%', '30vw']} minH={'60vh'} bg={config["backgroundColor"]} className="whiteText  mainFont"
           width="50%">
        <Center>
          <Box paddingTop={'20px'}>
            <Stack direction="row">
              <Center>

                <Box width="80%">
                  {!loginPage && (
                    <Box>

                      <Center>
                        <Text paddingTop='30px' paddingBottom='50px' fontWeight={600} fontSize='30px'
                              color={config["mainText"]}> sign up </Text>
                      </Center>
                      <form onSubmit={register}>
                        <Box color={config['mainText']} className={'placeholder'} width="100%">
                          <Input
                            placeholder="Username"
                            _hover={{borderColor: config["mainText"]}}

                            borderColor={config["subtleText"]}
                            onChange={(event) => {
                              setUsername(event.target.value);
                            }}
                          />
                          <Input
                            placeholder="Email"
                            marginTop={'10px'}
                            _hover={{borderColor: config["mainText"]}}

                            borderColor={config["subtleText"]}
                            onChange={(event) => {
                              setRegisterEmail(event.target.value);
                            }}
                          />
                          <Input
                            placeholder="Password"
                            marginTop={'10px'}
                            _hover={{borderColor: config["mainText"]}}

                            borderColor={config["subtleText"]}
                            type="password"
                            onChange={(event) => {
                              setRegisterPassword(event.target.value);
                            }}
                          />
                          <Input
                            marginTop={'10px'}
                            _hover={{borderColor: config["mainText"]}}

                            borderColor={config["subtleText"]}
                            placeholder="Confirm Password"
                            type="password"

                            onChange={(event) => {
                              setConfirmPassword(event.target.value);
                            }}
                          />
                          <Center p={3}>
                            <p className="currentIncorrect">{registerErrorMessage}</p>
                          </Center>
                          <Center className="standardButton">

                            <Button marginTop="10px"
                                    type="submit"
                                    backgroundColor={"#555"}
                                    onClick={register}>
                              <Box px={5} borderRadius={5} paddingTop='10px' minWidth='150%' minHeight='100%'
                                   bg={config["themeInactiveButton"]}>
                                sign up
                              </Box>
                            </Button>

                          </Center>
                          <Center>
                            <Box py={'10px'} color={config["subtleText"]}>
                              have an account?{" "}<Button onClick={() => setLoginPage(true)}
                                                           color={config["subtleText"]} className={'underline'}
                                                           variant="link">log in</Button>
                            </Box>
                          </Center>
                        </Box>
                      </form>
                    </Box>
                  )}
                </Box>
              </Center>
              <Center>
                <Box width="80%">
                  {loginPage && (
                    <Box className='placeholder' textAlign={'center'}>

                      <Text paddingTop='30px' paddingBottom='50px' fontWeight={600} fontSize='30px'
                            color={config["mainText"]}>welcome back</Text>
                      <form onSubmit={login}>
                        <Input
                          _hover={{borderColor: config["mainText"]}}

                          borderColor={config["subtleText"]}
                          placeholder="Email"
                          color={config["mainText"]}

                          onChange={(event) => {
                            setLoginEmail(event.target.value);
                          }}
                        />


                        <Input
                          marginTop={'10px'}
                          _hover={{borderColor: config["mainText"]}}

                          borderColor={config["subtleText"]}
                          placeholder="Password"
                          type="password"
                          color={config["mainText"]}
                          onChange={(event) => {
                            setLoginPassword(event.target.value);
                          }}
                        />
                        <Center p={3}>
                          <Text color={config["incorrectText"]}>{loginErrorMessage}</Text>
                        </Center>
                        <Center className="standardButton">
                          <Button bg={config['subtleText']} marginTop="10px" paddingBottom={'10px'} type="submit"
                                  onClick={login}>
                            <Box px={5} borderRadius={5} paddingTop='8px' minWidth='150%' minHeight='120%'
                                 bg={config["themeInactiveButton"]}>
                              log in
                            </Box>
                          </Button>
                        </Center>
                        <Divider borderColor={config["subtleText"]}/>


                        <Center>
                          <VStack paddingTop={'20px'}>
                            <Box>
                              <Button
                                onClick={github}
                                className="loginFont"
                                bgColor={config["subtleText"]}
                                color={config["themeInactiveButton"]}
                                borderRadius={"3px"}
                                minHeight="45px"
                                maxW={'200px'}>
                                <Box fontSize="24px" paddingRight="10px" paddingTop="5px">
                                  <ion-icon name="logo-github"></ion-icon>
                                </Box>
                                Sign in with GitHub
                              </Button>
                            </Box>
                            <Box>
                              <Button
                                onClick={google}
                                className="loginFont"
                                bgColor={config["subtleText"]}
                                color={config["themeInactiveButton"]}
                                borderRadius={"3px"}
                                maxW={'200px'}
                                minHeight="45px">
                                <Box fontSize="24px" paddingRight="10px" paddingTop="5px">
                                  <ion-icon name="logo-google"></ion-icon>
                                </Box>
                                Sign in with Google
                              </Button>
                            </Box>
                          </VStack>


                        </Center>
                        <Box py={'10px'} color={config["subtleText"]}>
                          no account? <Button onClick={() => setLoginPage(false)} color={config["subtleText"]}
                                              className={'underline'} variant="link">sign up</Button>
                        </Box>


                      </form>
                    </Box>
                  )}
                </Box>

              </Center>
            </Stack>
          </Box>
        </Center>

      </Box>
    </Center>
  );
}
