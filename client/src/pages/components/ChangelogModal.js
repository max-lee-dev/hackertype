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

export default function ChangelogModal({ isChangeOpen, onChangeClose }) {
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  console.log(isChangeOpen);
  return (
    <>
      <Modal
        isOpen={isChangeOpen}
        onClose={onChangeClose}
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        size="6xl">
        <ModalOverlay />
        <ModalContent backgroundColor="#0e0e10" minHeight={"500px"}>
          <ModalHeader>
            <Box className="searchModal">
              <Text className="whiteText mainFont" fontSize="32px">
                changelog
              </Text>
              <ModalCloseButton />
            </Box>
          </ModalHeader>

          <ModalBody>
            <Box height="520px" overflow="auto">
              <Box paddingBottom="25px">
                <Text className="whiteText mainFont">
                  <b>4/21/2023</b>
                  <Text>
                    hi! excited to see all of the new users on the site! i know there are certain bugs with
                    leaderboard rankings and currently working on it! but right now heres a small update :)
                  </Text>
                  <Box paddingTop="15px">
                    <Text>- added a changelog page</Text>
                    <Text>- added google auth sign in</Text>
                  </Box>
                </Text>
              </Box>
            </Box>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
