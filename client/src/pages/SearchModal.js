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

import { query, collection, getDocs, orderBy } from "firebase/firestore";
import { db } from "./components/firebase";
import Submission from "./components/Submission";

export default function SearchModal({ isSearchOpen, onSearchClose }) {
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [solutionList, setSolutionList] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("Java");
  const css = document.querySelector(":root");
  const style = getComputedStyle(css);
  var bgcolor = style.getPropertyValue("--backgroundColor");
  useEffect(() => {
    setLoading(true);
    setUserList([]);
    async function getUserList() {
      const tempArr = [];
      const q = query(collection(db, "users"));

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        if (tempArr.length > 4) return;
        const displayName = doc.data().displayName.toLowerCase();
        const userInputLower = userInput.toLowerCase();
        if (userInput === "") tempArr.push(doc.data());
        else if (displayName.includes(userInputLower)) tempArr.push(doc.data());
      });
      setUserList(tempArr);
    }

    async function getSolutionList() {
      const tempArr = [];
      const q = query(collection(db, "javaSolutions"));
      const sortedQ = query(q, orderBy("solutionNum", "asc"));

      const querySnapshot = await getDocs(sortedQ);

      querySnapshot.forEach((doc) => {
        if (tempArr.length > 4) return;
        const displayName = doc.data().solution_id.toLowerCase();
        const userInputLower = userInput.toLowerCase();
        if (userInput === "") tempArr.push(doc);
        else if (displayName.includes(userInputLower)) tempArr.push(doc);
        console.log(doc.id);
      });
      setSolutionList(tempArr);
    }

    getSolutionList();
    getUserList().then(() => setLoading(false));
  }, [userInput, isSearchOpen]);

  return (
    <Center>
      <Modal
        isOpen={isSearchOpen}
        onClose={closeModal}
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        size="6xl">
        <ModalOverlay />
        <ModalContent backgroundColor={bgcolor} minHeight={"500px"}>
          <ModalHeader>
            <Box className="searchModal">
              <Text className="whiteText mainFont" fontSize="32px">
                search
              </Text>
              <ModalCloseButton />
            </Box>
          </ModalHeader>

          <ModalBody>
            <Box paddingBottom="25px">
              <FormControl className="whiteText mainFont">
                <Input
                  _selected={{ outline: "none" }}
                  _focus={{ outline: "none" }}
                  ref={initialRef}
                  placeholder={`search a solution/username`}
                  type="text"
                  onChange={(e) => setUserInput(e.target.value)}
                />
              </FormControl>
            </Box>

            <Box className="whiteText mainFont">
              <HStack className="whiteText mainFont"></HStack>
              <Box display="flex">
                <Box width="100%">
                  <Box paddingTop="15px">
                    <Box width="50%">
                      {(loading || userList.length > 0) && <Text fontSize="32px">users</Text>}
                    </Box>
                    <Box paddingTop="24px">{loading && <Box className="loader"></Box>}</Box>
                    {userList.map((user, i) => (
                      <Box key={i} paddingTop="10px">
                        <Link textDecoration={"underline"} href={`/profile/${user.displayName}`}>
                          {user.displayName}
                        </Link>
                      </Box>
                    ))}
                    <Box paddingTop="20px" width="50%">
                      {(loading || solutionList.length > 0) && <Text fontSize="32px">solutions</Text>}
                    </Box>
                    <Box paddingTop="24px">
                      {loading && solutionList.length === 0 && <Box className="loader"></Box>}
                    </Box>
                    {solutionList.map((sol, i) => (
                      <Box key={i} paddingTop="10px">
                        <Link textDecoration={"underline"} href={`/solutions/Java/${sol.data().solutionNum}`}>
                          {sol.data().solution_id}
                        </Link>
                      </Box>
                    ))}
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
    onSearchClose();
    setUserInput("");
    setUserList([]);
  }
}
