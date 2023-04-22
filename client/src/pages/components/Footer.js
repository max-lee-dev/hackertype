import React from "react";
import { Box, Text, Center, useDisclosure, HStack, VStack, Tooltip, Badge } from "@chakra-ui/react";
import { Link, NavLink } from "react-router-dom";
import ChangelogModal from "./ChangelogModal.js";
export default function Footer() {
  const { isOpen: isChangeOpen, onClose: onChangeClose, onOpen: onChangeOpen } = useDisclosure();
  const updateName = "update3";

  const seenUpdate = localStorage.getItem(updateName);
  function open() {
    onChangeOpen();
    localStorage.setItem(updateName, true);
  }
  return (
    <Box marginTop="110px" bgColor={""} display="flex" justifyContent={"center"}>
      <HStack spacing="0">
        <Box fontSize="40px">
          <Link to="https://github.com/max-lee-dev/hackertype">
            <Center>
              <ion-icon name="logo-github"></ion-icon>
            </Center>
          </Link>
        </Box>
        <Box paddingTop="12px" fontSize="34px" paddingLeft="50px" className="mainFont">
          <Tooltip label="Change log">
            <NavLink onClick={open}>
              <VStack>
                {!seenUpdate && <Badge colorScheme="green">new</Badge>}
                <Box paddingBottom="3px" color={seenUpdate ? "gray" : "white"}>
                  <ion-icon name="clipboard"></ion-icon>
                </Box>
                {!seenUpdate && <Box paddingBottom="18px"></Box>}
              </VStack>
            </NavLink>
          </Tooltip>
        </Box>
      </HStack>

      <ChangelogModal isChangeOpen={isChangeOpen} onChangeClose={onChangeClose} />
    </Box>
  );
}
