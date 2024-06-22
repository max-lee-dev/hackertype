import React, {useState, useEffect} from "react";
import dailySolutions from "./codefiles/dailySolutions.json";
import {
  Text,
  Box,
  Divider,
  Center,
  ModalFooter,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  FormControl,
  Input,
  FormHelperText,
  FormLabel,
  Button,
  useDisclosure,
  HStack,
  VStack,
  Tooltip,
  Link,
} from "@chakra-ui/react";

import {query, collection, getDocs, orderBy, where} from "firebase/firestore";
import {db} from "./firebase";
import Submission from "./Submission";
import {getAuth} from "firebase/auth";

export function formatDate(when) {
  const now = Date.parse(Date());

  const timeDiffInMs = Math.abs(now - when);
  const timeDiffInDays = Math.floor(timeDiffInMs / (1000 * 60 * 60 * 24));
  const timeDiffInHours = Math.floor(timeDiffInMs / (1000 * 60 * 60));
  const timeDiffInMinutes = Math.floor(timeDiffInMs / (1000 * 60));

  if (timeDiffInDays > 0) {
    return `${timeDiffInDays} days ago`;
  } else if (timeDiffInHours > 0) {
    return `${timeDiffInHours} hours ago`;
  } else if (timeDiffInMinutes > 0) {
    return `${timeDiffInMinutes} minutes ago`;
  } else {
    return "just now";
  }
}

export default function LeaderboardModal({
                                           isLeaderboardOpen,

                                           onLeaderboardClose,
                                           givenSolName,
                                           selectedLanguage,
                                         }) {
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const [loading, setLoading] = useState(false);
  const [solutionList, setSolutionList] = useState([]);
  const [user, setUser] = useState({});

  const titleArray = givenSolName.split(".");

  const solutionNumber = parseInt(titleArray[0]);
  const auth = getAuth();
  const ogDay = 1703662239000 - 27039000;
  const today = Date.parse(new Date());
  const dailyNum = Math.floor((today - ogDay) / (1000 * 60 * 60 * 24));


  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    //eslint-disable-next-line
  }, []);
  useEffect(() => {
    setLoading(true);

    async function getSolutionList() {
      const tempArr = [];
      const dateArrs = [];

      const q = query(collection(db, givenSolName), where("language", "==", selectedLanguage), where("isBestSubmission", "==", true));
      // , where("language", "==", selectedLanguage), where("solution_id", "==", givenSolName), orderBy("rank", "asc"), where("isBestSubmission", "==", true))

      const querySnapshot = await getDocs(q);

      // sort both date arrs and temp arr


      querySnapshot.forEach((doc) => {
        tempArr.push(doc.data());
      });
      tempArr.sort((a, b) => a.rank - b.rank);

      setSolutionList(tempArr);
    }

    if (isLeaderboardOpen) {
      getSolutionList().then(() => setLoading(false));
    }
  }, [isLeaderboardOpen]);


  const css = document.querySelector(":root");
  const style = getComputedStyle(css);
  const logoC = style.getPropertyValue("--logoColor");
  var bgcolor = style.getPropertyValue("--backgroundColor");
  var subtleText = style.getPropertyValue("--subtleText");
  return (
    <Center>
      <Modal
        isOpen={isLeaderboardOpen}
        onClose={closeModal}
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        size="6xl">
        <ModalOverlay/>
        <ModalContent bgColor={bgcolor} minHeight={"800px"}>
          <ModalHeader>
            <Box className="searchModal">
              <Text className="mainTextClass mainFont whiteUnderline" fontSize="32px">
                <HStack>
                  {dailySolutions[dailyNum] === solutionNumber && (
                    <Tooltip label="daily solution" placement="left">
                      <Box paddingTop={2} paddingBottom={0} color={logoC}>
                        <ion-icon name="flame"></ion-icon>

                      </Box>
                    </Tooltip>
                  )}

                  <Link
                    href={`/solutions/${selectedLanguage}/${solutionNumber}`}>{givenSolName}</Link>
                </HStack>
              </Text>
              <Text>
                <Text className="subtleTextColor mainFont" fontSize="32px">
                  {selectedLanguage}
                </Text>
              </Text>
              <ModalCloseButton/>
            </Box>
          </ModalHeader>

          <ModalBody>
            <Box className="mainTextClass mainFont">
              <HStack className="whiteText mainFont"></HStack>
              <Box display="flex">
                <Box width="100%">
                  <Box paddingTop="15px">
                    <Box display="flex" color={subtleText}>
                      <Box width="25%">
                        <Text fontSize="32px">rank</Text>
                      </Box>
                      <Box width="25%">
                        <Text fontSize="32px">user</Text>
                      </Box>

                      <Box width="25%">
                        <Text fontSize="32px">wpm</Text>
                        <Text marginTop="-10px" fontSize="18px">
                          acc
                        </Text>
                      </Box>
                      <Box width="25%">
                        <Text fontSize="32px">date</Text>
                      </Box>
                    </Box>
                    {loading && solutionList.length > 0 && <Text>Loading...</Text>}
                    {solutionList.length === 0 && !loading && <Text>no submissions yet...</Text>}
                    {!loading && (
                      <Box paddingTop="5px" overflow="auto" height="520px" className="scroll">
                        {solutionList.map((sol, i) => (
                          <Box key={i} paddingBottom="20px">
                            <Box display="flex" fontSize="24px">
                              <Box width="25%">
                                <Text>#{sol.rank}</Text>
                              </Box>
                              <Box width="25%">
                                <Link textDecoration={"underline"}
                                      href={`/profile/${sol.user}`}>
                                  <Text width={'80%'}>{sol.user}</Text>
                                </Link>
                              </Box>
                              <Box width="25%">
                                <Text>{sol.wpm}</Text>
                                <Tooltip label="accuracy" placement="left">
                                  <Box width="15%">
                                    <Text fontSize="14px" color={subtleText}>
                                      {sol.acc}%
                                    </Text>
                                  </Box>
                                </Tooltip>
                              </Box>

                              <Box width="25%">
                                <HStack>
                                  <Text>
                                    {sol.date[0]}
                                    <HStack>
                                      <Text fontSize="18px" color={subtleText}>
                                        {" "}
                                        {formatDate(sol.when)}
                                      </Text>
                                    </HStack>
                                  </Text>
                                </HStack>
                                <Tooltip label="UTC" placement="left">
                                  <Text fontWeight="200" color={subtleText}
                                        fontSize="14px">
                                    {" "}
                                    <Text></Text>
                                    {sol.date[1]}
                                  </Text>
                                </Tooltip>
                              </Box>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                  {!loading && (
                    <Box>
                      {solutionList.map((sol, i) => (
                        <Box>
                          {sol.user === user?.displayName && (
                            <Box paddingTop="0px">
                              <Text className="mainFont" color="#FFCD29">
                                YOU
                              </Text>
                              <Box display="flex" fontSize="24px">
                                <Box width="25%">
                                  <Text>#{sol.rank}</Text>
                                </Box>
                                <Box width="25%">
                                  <Link textDecoration={"underline"}
                                        href={`/profile/${sol.user}`}>
                                    <Text>{sol.user}</Text>
                                  </Link>
                                </Box>
                                <Box width="25%">
                                  <Text>{sol.wpm}</Text>
                                  <Tooltip label="accuracy" placement="left">
                                    <Box width="15%">
                                      <Text fontSize="14px" color={subtleText}>
                                        {sol.acc}%
                                      </Text>
                                    </Box>
                                  </Tooltip>
                                </Box>

                                <Box width="25%">
                                  <HStack>
                                    <Text>
                                      {sol.date[0]}
                                      <HStack>
                                        <Text fontSize="18px"
                                              color={subtleText}>
                                          {" "}
                                          {formatDate(sol.when)}
                                        </Text>
                                      </HStack>
                                    </Text>
                                  </HStack>
                                  <Tooltip label="UTC" placement="left">
                                    <Text fontWeight="200" color={subtleText}
                                          fontSize="14px">
                                      {" "}
                                      <Text></Text>
                                      {sol.date[1]}
                                    </Text>
                                  </Tooltip>
                                </Box>
                              </Box>
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
  );

  function closeModal() {
    onLeaderboardClose();
  }
}
