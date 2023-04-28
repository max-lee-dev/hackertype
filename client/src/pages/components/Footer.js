import React from "react";
import { Box, Text, Center, useDisclosure, HStack, VStack, Tooltip, Badge } from "@chakra-ui/react";
import { Link, NavLink } from "react-router-dom";
import ChangelogModal from "./ChangelogModal.js";
export default function Footer({ config }) {
  const { isOpen: isChangeOpen, onClose: onChangeClose, onOpen: onChangeOpen } = useDisclosure();
  const lastUpdateTime = 1682646974000;
  // console.log(Date.parse(new Date()));
  const seenUpdate = localStorage.getItem("lastCheckedUpdate") > lastUpdateTime;
  function open() {
    onChangeOpen();
    localStorage.setItem("lastCheckedUpdate", Date.parse(new Date()));
  }
  return (
    <Box paddingTop="110px" display="flex" justifyContent={"center"}>
      <HStack spacing="0">
        <Box fontSize="36px">
          <Link to="https://github.com/max-lee-dev/hackertype">
            <Center>
              <Box color={config["subtleText"]}>
                <ion-icon name="logo-github"></ion-icon>
              </Box>
            </Center>
          </Link>
        </Box>
        <Box paddingTop="12px" fontSize="30px" paddingLeft="50px" className="mainFont">
          <Tooltip label="Change log">
            <NavLink onClick={open}>
              <VStack>
                {!seenUpdate && (
                  <Badge bgColor={config["subtleText"]} color={config["themeBackground"]}>
                    new
                  </Badge>
                )}
                <Box paddingBottom="4px" color={seenUpdate ? config["subtleText"] : config["mainText"]}>
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
