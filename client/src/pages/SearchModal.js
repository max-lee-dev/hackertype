import React, {useState, useEffect} from "react";
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
import javaCode from "./components/codefiles/javaCode.json";

import {query, collection, getDocs, orderBy} from "firebase/firestore";
import {db} from "./components/firebase";
import Submission from "./components/Submission";

export default function SearchModal({isSearchOpen, onSearchClose}) {
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [fullUserList, setFullUserList] = useState(null);
  const [solutionList, setSolutionList] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("Java");
  const css = document.querySelector(":root");
  const style = getComputedStyle(css);
  var bgcolor = style.getPropertyValue("--backgroundColor");
  var mainText = style.getPropertyValue("--maintext");
  var subtleText = style.getPropertyValue("--subtleText");


  useEffect(() => {
    setLoading(true);
    setUserList([]);
    if (!fullUserList) {
      async function getUsers() {
        const usersRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersRef);
        const tempArr = [];
        usersSnapshot.forEach((doc) => {
          tempArr.push(doc);
        });
        setFullUserList(tempArr);
      }

      getUsers().then(() => setLoading(false));
    }


    async function getUserList() {
      const tempArr = [];
      fullUserList.forEach((doc) => {
        if (tempArr.length > 4) return;
        const displayName = doc.data().displayName.toLowerCase();
        const userInputLower = userInput.toLowerCase();
        if (userInput === "") tempArr.push(doc.data());
        else if (displayName.includes(userInputLower)) tempArr.push(doc.data());
      });
      setUserList(tempArr);
    }

    getUserList().then(() => setLoading(false));
  }, [userInput, isSearchOpen]);
  useEffect(() => {

    let tempArr = [];
    for (let i = 0; i < javaCode.length; i++) {
      if (!javaCode[i]) continue;
      const sol = javaCode[i][0];
      if (sol.id.toLowerCase().includes(userInput.toLowerCase())) {
        const name = sol.id;
        const solObj = {
          data: () => {
            return {solution_id: name, solutionNum: i + 1};
          },
        };

        if (tempArr.length < 5) tempArr.push(solObj);

      }
    }
    setSolutionList(tempArr);

  }, [userInput]);


  return (
    <Center>
      <Modal
        isOpen={isSearchOpen}
        onClose={closeModal}
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        size="6xl">
        <ModalOverlay/>
        <ModalContent backgroundColor={bgcolor} minHeight={"500px"}>
          <ModalHeader>
            <Box className="searchModal">
              <Text color={mainText} className=" mainFont" fontSize="32px">
                search
              </Text>
              <ModalCloseButton/>
            </Box>
          </ModalHeader>

          <ModalBody>
            <Box paddingBottom="25px">
              <FormControl className="whiteText mainFont">
                <Input
                  _selected={{outline: "none"}}
                  _focus={{outline: "none"}}
                  ref={initialRef}
                  borderColor={mainText}
                  color={mainText}
                  autoComplete="off"
                  _placeholder={{color: subtleText}}
                  placeholder={`search a solution/username`}
                  type="text"
                  onChange={(e) => setUserInput(e.target.value)}
                />
              </FormControl>
            </Box>

            <Box className="mainFont" color={mainText}>
              <HStack className="whiteText mainFont"></HStack>
              <Box display="flex">
                <Box width="100%">
                  <Box>
                    <Box width="50%">
                      {(loading || userList.length > 0) && (
                        <Text color={subtleText} fontSize="32px">
                          users
                        </Text>
                      )}
                    </Box>
                    <Box>{loading && <Box className="loader"></Box>}</Box>
                    {userList.map((user, i) => (
                      <Box key={i} paddingTop="10px">
                        <Link textDecoration={"underline"} href={`/profile/${user.displayName}`}>
                          {user.displayName}
                        </Link>
                      </Box>
                    ))}
                    <Box paddingTop="20px" width="50%">
                      {(loading || solutionList.length > 0) && (
                        <Text color={subtleText} fontSize="32px">
                          solutions
                        </Text>
                      )}
                    </Box>
                    <Box>
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
