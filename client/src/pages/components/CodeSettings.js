import React from "react";
import { auth } from "./firebase";
import {
  Center,
  Input,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  FormHelperText,
  ModalFooter,
  Button,
  Stack,
  HStack,
  Tooltip,
  IconButton,
  Text,
  Box,
  VStack,
} from "@chakra-ui/react";

import { Search2Icon, EditIcon, CheckIcon } from "@chakra-ui/icons";

export default function CodeSettings({
  startCounting,
  leetcodeTitle,
  id,
  language,
  isSearchOpen,
  onSearchOpen,
  onSearchClose,
  isWordsOpen,
  onWordsOpen,
  onWordsClose,
  wordLimit,
  handleWordLimit,
  Restart,
  cppRange,
  javaRange,
  pythonRange,
  setId,
  changeLastId,
}) {
  const lcNumber = leetcodeTitle.split(".")[0];
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const displayLimit = wordLimit === 50000 ? "" : wordLimit;
  const displayId = id === "" || id === undefined ? "" : id;
  function test(e) {
    console.log(e.target.value);
    changeLastId(e.target.value);
    setId(e.target.value);
  }
  return (
    <Center>
      <Box width="90%">
        {!startCounting && (
          <Box borderRadius={"15px"} className="mainFont" width="100%" marginTop="30px" bgColor="transparent">
            <Stack direction="row" justifyContent="space-between" spacing="5">
              <Box display="flex">
                <VStack spacing="-2" fontSize="13px" className="grayText">
                  <IconButton
                    width={"50px"}
                    className="standardButton"
                    fontSize="20px"
                    _hover={{ color: "white" }}
                    _active={{ background: "transparent" }}
                    icon={<EditIcon />}
                    variant="outline"
                    borderColor="transparent"
                    colorScheme="whiteAlpha"
                    onClick={onWordsOpen}></IconButton>
                  <Text>{displayLimit}</Text>
                </VStack>
                <VStack spacing="-2" fontSize="13px" className="grayText">
                  <IconButton
                    width={"50px"}
                    className="standardButton"
                    fontSize="20px"
                    _hover={{ color: "white" }}
                    _active={{ background: "transparent" }}
                    icon={<Search2Icon />}
                    variant="outline"
                    borderColor="transparent"
                    colorScheme="whiteAlpha"
                    onClick={onSearchOpen}></IconButton>
                  <Text marginTop="0x">{displayId}</Text>
                </VStack>
              </Box>

              <Box className="standardButton" marginBottom="50px">
                <HStack>
                  <Box>
                    <Button _hover={{ bg: "#a0a0a0" }} onClick={() => Restart("C++", wordLimit)}>
                      <Text color={language === "C++" ? "white" : ""}> C++</Text>
                    </Button>
                    <Center>
                      <Text fontSize="14px" fontWeight="300" className="grayText">
                        {cppRange}
                      </Text>
                    </Center>
                  </Box>
                  <Box>
                    <Button
                      _hover={{ bg: "#a0a0a0" }}
                      backgroundColor={language === "Java" ? "" : "#404040"}
                      onClick={() => Restart("Java", wordLimit)}>
                      <Text color={language === "Java" ? "white" : ""}> Java</Text>
                    </Button>
                    <Center>
                      <Text fontSize="14px" fontWeight="300" className="grayText">
                        {javaRange}
                      </Text>
                    </Center>
                  </Box>
                  <Box>
                    <Button
                      _active={{ color: "#a0a0a0" }}
                      _hover={{ bg: "#a0a0a0" }}
                      backgroundColor={language === "Python" ? "" : "#404040"}
                      onClick={() => Restart("Python", wordLimit)}>
                      <Text color={language === "Python" ? "white" : ""}> Python</Text>
                    </Button>
                    <Center>
                      <Text fontSize="14px" fontWeight="300" className="grayText">
                        {pythonRange}
                      </Text>
                    </Center>
                  </Box>
                </HStack>
              </Box>
            </Stack>
          </Box>
        )}

        <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={isWordsOpen}
          onClose={onWordsClose}>
          <ModalOverlay />
          <ModalContent backgroundColor="#0e0e10">
            <form>
              <ModalHeader className="mainFont" color="white">
                Line Limit
                <ModalCloseButton />
              </ModalHeader>

              <ModalBody>
                <Box className="mainFont whiteText">
                  <FormControl>
                    <Input
                      ref={initialRef}
                      className="maxWordsForm"
                      placeholder={`Enter a line limit (e.g. 5)`}
                      type="text"
                      onChange={(e) => handleWordLimit(e.target.value)}
                    />

                    <FormHelperText></FormHelperText>
                  </FormControl>
                </Box>
                <Box className="trashButton">
                  <Button maxWidth={"10px"} bgColor="transparent" onClick={() => trashButton()}>
                    <Box className="trashIcon">
                      <ion-icon name="trash-sharp"></ion-icon>
                    </Box>
                  </Button>
                </Box>
              </ModalBody>

              <ModalFooter>
                <Box>
                  <Button
                    _hover={{ background: "" }}
                    width="50%"
                    color="white"
                    backgroundColor="transparent"
                    type="submit"
                    onClick={(e) => closeLimitModal(e)}>
                    <CheckIcon />
                  </Button>
                </Box>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>

        <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={isSearchOpen}
          onClose={onSearchClose}>
          <ModalOverlay />
          <ModalContent backgroundColor="#0e0e10">
            <form>
              <ModalHeader className="mainFont" color="white">
                ID Search
                <ModalCloseButton />
              </ModalHeader>

              <ModalBody>
                <Box className="mainFont whiteText">
                  <FormControl>
                    <Input
                      ref={initialRef}
                      className="maxWordsForm"
                      placeholder={`Enter an ID (e.g. 124)`}
                      type="text"
                      onChange={(e) => test(e)}
                    />

                    <FormHelperText></FormHelperText>
                  </FormControl>
                </Box>
                <Box className="trashButton">
                  <Button maxWidth={"10px"} bgColor="transparent" onClick={() => trashSearchButton()}>
                    <Box className="trashIcon">
                      <ion-icon name="trash-sharp"></ion-icon>
                    </Box>
                  </Button>
                </Box>
              </ModalBody>

              <ModalFooter>
                <Box>
                  <Button
                    _hover={{ background: "" }}
                    width="50%"
                    color="white"
                    backgroundColor="transparent"
                    type="submit"
                    onClick={(e) => closeSearchModal(e)}>
                    <CheckIcon />
                  </Button>
                </Box>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </Box>
    </Center>
  );

  function trashButton() {
    handleWordLimit("");
    onWordsClose();
  }

  function trashSearchButton() {
    changeLastId("");
    setId("");
    onSearchClose();
  }

  function closeLimitModal(e) {
    e.preventDefault();
    onWordsClose();
    Restart(language === "" ? "Java" : language, wordLimit, id === "" ? undefined : id);
  }

  function closeSearchModal(e) {
    e.preventDefault();
    onSearchClose();
    Restart(language === "" ? "Java" : language, wordLimit, id === "" ? id : undefined);
  }
}
