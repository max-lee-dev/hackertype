import React, { useState, useEffect } from "react";
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
  Link,
} from "@chakra-ui/react";

import { query, collection, getDocs, orderBy, where } from "firebase/firestore";
import { db } from "./firebase";
import Submission from "./Submission";

export default function LeaderboardModal({
  isLeaderboardOpen,

  onLeaderboardClose,
  givenSolName,
  selectedLanguage,
}) {
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [solutionList, setSolutionList] = useState([]);

  const titleArray = givenSolName.split(".");

  const solutionNumber = parseInt(titleArray[0]);
  useEffect(() => {
    setLoading(true);
    setUserList([]);

    async function getSolutionList() {
      const tempArr = [];

      const q = query(collection(db, "submissions"));

      const thisLanguage = query(q, where("language", "==", selectedLanguage));
      console.log("hi");

      const thisSolution = query(thisLanguage, where("solution_id", "==", givenSolName));

      const isBest = query(thisSolution, where("isBestSubmission", "==", true));
      const sortedQ = query(isBest, orderBy("rank", "asc"));

      const querySnapshot = await getDocs(sortedQ);

      querySnapshot.forEach((doc) => {
        console.log("HO: " + doc.data());
        tempArr.push(doc.data());
      });
      setSolutionList(tempArr);
    }

    getSolutionList().then(() => setLoading(false));
  }, [userInput, isLeaderboardOpen]);

  return (
    <Center>
      <Modal
        isOpen={isLeaderboardOpen}
        onClose={closeModal}
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        size="6xl">
        <ModalOverlay />
        <ModalContent backgroundColor="#0e0e10" minHeight={"500px"}>
          <ModalHeader>
            <Box className="searchModal">
              <Text className="whiteText mainFont whiteUnderline" fontSize="32px">
                <Link href={`solutions/${selectedLanguage}/${solutionNumber}`}>{givenSolName}</Link>
              </Text>
              <Text>
                <Text className="grayText mainFont" fontSize="32px">
                  {selectedLanguage}
                </Text>
              </Text>
              <ModalCloseButton />
            </Box>
          </ModalHeader>

          <ModalBody>
            <Box className="whiteText mainFont">
              <HStack className="whiteText mainFont"></HStack>
              <Box display="flex">
                <Box width="100%">
                  <Box paddingTop="15px">
                    <Box display="flex" color="gray">
                      <Box width="25%">
                        <Text fontSize="32px">users</Text>
                      </Box>

                      <Box width="25%">
                        <Text fontSize="32px">wpm</Text>
                      </Box>
                      <Box width="25%">
                        <Text fontSize="32px">rank</Text>
                      </Box>
                      <Box width="25%">
                        <Text fontSize="32px">date</Text>
                      </Box>
                    </Box>
                    {loading && <Text>Loading...</Text>}
                    {!loading && (
                      <Box paddingTop="0px">
                        {solutionList.map((sol) => (
                          <Box paddingBottom="30px">
                            <Box display="flex" fontSize="20px">
                              <Box width="25%">
                                <Link textDecoration={"underline"} href={`/profile/${sol.user}`}>
                                  <Text>{sol.user}</Text>
                                </Link>
                              </Box>
                              <Box width="25%">
                                <Text>{sol.wpm}</Text>
                              </Box>
                              <Box width="25%">
                                <Text>#{sol.rank}</Text>
                              </Box>

                              <Box width="25%">
                                <Text>{sol.date}</Text>
                              </Box>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
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
    setUserInput("");
    setUserList([]);
  }
}
