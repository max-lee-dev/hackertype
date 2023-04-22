import React from "react";
import SearchModal from "../SearchModal";
import {
  Center,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormHelperText,
  ModalFooter,
  Button,
  Stack,
  HStack,
  Tooltip,
  IconButton,
  Text,
  Box,
  Badge,
  VStack,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

import { EditIcon, CheckIcon } from "@chakra-ui/icons";

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

  retrySame,
  setRetrySame,
}) {
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const displayLimit = wordLimit === 50000 ? "" : wordLimit;

  function handleChange(name, value, bool) {
    value = value === "true" || value === true;

    setRetrySame(value);
  }

  return (
    <Center>
      <Box width="90%">
        {!startCounting && (
          <Box borderRadius={"15px"} className="mainFont" width="100%" marginTop="30px" bgColor="transparent">
            <Stack direction="row" justifyContent="space-between" spacing="5">
              <Box display="flex">
                <HStack spacing="-1">
                  <Tooltip label="Line limit">
                    <VStack spacing="-2" fontSize="12px" className="grayText">
                      <IconButton
                        className="standardButton"
                        fontSize="20px"
                        _hover={{ color: "white" }}
                        _active={{ background: "transparent" }}
                        icon={<EditIcon />}
                        variant="outline"
                        borderColor="transparent"
                        name="retrySame"
                        colorScheme="whiteAlpha"
                        onClick={onWordsOpen}></IconButton>

                      <Text color={displayLimit ? "gray" : "transparent"}>
                        {!displayLimit ? "all" : displayLimit}
                      </Text>
                    </VStack>
                  </Tooltip>
                  <Tooltip label="Lock solution">
                    <Box paddingBottom="6px">
                      {retrySame && (
                        <VStack spacing="-2" fontSize="13px" className="grayText">
                          <IconButton
                            width={"50px"}
                            className="standardButton"
                            fontSize="20px"
                            _hover={{ color: "white" }}
                            _active={{ background: "transparent" }}
                            variant="outline"
                            borderColor="transparent"
                            colorScheme="whiteAlpha"
                            name="retrySame"
                            onClick={(e) => handleChange("retrySame", false, "bool")}>
                            <Box color="#FFCD29">
                              <ion-icon name="lock-closed"></ion-icon>
                            </Box>
                          </IconButton>
                        </VStack>
                      )}
                      {!retrySame && (
                        <VStack spacing="-2" fontSize="13px" className="grayText">
                          <IconButton
                            width={"50px"}
                            className="standardButton"
                            fontSize="20px"
                            _hover={{ color: "white" }}
                            _active={{ background: "transparent" }}
                            variant="outline"
                            borderColor="transparent"
                            colorScheme="whiteAlpha"
                            name="retrySame"
                            onClick={(e) => handleChange("retrySame", true, "bool")}>
                            <Box>
                              <ion-icon name="lock-open"></ion-icon>
                            </Box>
                          </IconButton>
                        </VStack>
                      )}
                    </Box>
                  </Tooltip>
                </HStack>

                <Box paddingBottom="10px">
                  <HStack spacing="4">
                    <Box>
                      <Tooltip label="Settings">
                        <NavLink
                          to="/settings"
                          className="standardButton"
                          _hover={{ color: "white" }}
                          _active={{ background: "transparent" }}
                          variant="outline"
                          borderColor="transparent"
                          colorScheme="gray">
                          <Box fontSize="28px" marginTop="0.7rem" color="gray" _hover={{ color: "white" }}>
                            <ion-icon name="cog"></ion-icon>
                          </Box>
                        </NavLink>
                      </Tooltip>
                    </Box>

                    <Tooltip label="Search">
                      <NavLink
                        onClick={onSearchOpen}
                        className="standardButton"
                        _hover={{ color: "white" }}
                        _active={{ background: "transparent" }}
                        variant="outline"
                        borderColor="transparent"
                        colorScheme="gray">
                        <Box fontSize="28px" marginTop="0.7rem" color="gray" _hover={{ color: "white" }}>
                          <ion-icon name="search-outline"></ion-icon>
                        </Box>
                      </NavLink>
                    </Tooltip>
                  </HStack>
                </Box>
              </Box>

              <Box className="standardButton" marginBottom="50px">
                <HStack>
                  <Box>
                    <Button _hover={{ bg: "#a0a0a0" }} onClick={() => Restart("C++", wordLimit)}>
                      <Text color={language === "C++" ? "white" : ""}> C++</Text>
                    </Button>
                    <Center>
                      <Tooltip label={`Picking from ${cppRange} C++ solutions`}>
                        <Text fontSize="14px" fontWeight="300" className="grayText">
                          {cppRange}
                        </Text>
                      </Tooltip>
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
                      <Tooltip label={`Picking from ${javaRange} Java solutions`}>
                        <Text fontSize="14px" fontWeight="300" className="grayText">
                          {javaRange}
                        </Text>
                      </Tooltip>
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
                      <Tooltip label={`Picking from ${pythonRange} Python solutions`}>
                        <Text fontSize="14px" fontWeight="300" className="grayText">
                          {pythonRange}
                        </Text>
                      </Tooltip>
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
        <SearchModal isSearchOpen={isSearchOpen} onSearchClose={onSearchClose} />
      </Box>
    </Center>
  );

  function trashButton() {
    handleWordLimit("");
    onWordsClose();
  }

  function closeLimitModal(e) {
    e.preventDefault();
    onWordsClose();
    Restart(language === "" ? "Java" : language, wordLimit, id === "" ? undefined : id);
  }
}
