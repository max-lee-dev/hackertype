import React from "react";
import {Box, Link, Text, Center, useDisclosure, HStack, VStack, Tooltip, Badge} from "@chakra-ui/react";
import {NavLink} from "react-router-dom";
import ChangelogModal from "./ChangelogModal.js";
import FeedbackModal from "./FeedbackModal";

export default function Footer({config}) {
  const {isOpen: isChangeOpen, onClose: onChangeClose, onOpen: onChangeOpen} = useDisclosure();
  const {isOpen: isFeedbackOpen, onClose: onFeedbackClose, onOpen: onFeedbackOpen} = useDisclosure();
  const lastUpdateTime = 1708455059000;
  // console.log(Date.parse(new Date()));
  const seenUpdate = localStorage.getItem("lastCheckedUpdate") > lastUpdateTime;

  function open() {
    onChangeOpen();
    localStorage.setItem("lastCheckedUpdate", Date.parse(new Date()));
  }

  return (
    <Box display="flex" justifyContent={"center"}>
      <HStack spacing={5} paddingTop="12px">
        <Tooltip label={"github"}>
          <Box pb={2} fontSize="34px">
            <Link isExternal href="https://github.com/max-lee-dev/hackertype">

              <Center>
                <Box color={config["subtleText"]}>
                  <ion-icon name="logo-github"></ion-icon>
                </Box>
              </Center>
            </Link>
          </Box>
        </Tooltip>
        <Box fontSize="30px" className="mainFont">
          <Tooltip label="change log">
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
        <Box fontSize="30px" className="mainFont">
          <Tooltip label="feedback">
            <NavLink onClick={onFeedbackOpen}>

              <Box paddingBottom="4px" color={config["subtleText"]}>
                <ion-icon name="chatbox-ellipses"></ion-icon>
              </Box>

            </NavLink>
          </Tooltip>
        </Box>
        <Box fontSize="30px" className="mainFont">
          <Tooltip label="join the discord!">
            <Link href={'https://discord.gg/wUVBsts7VJ'} isExternal>

              <Box paddingBottom="4px" color={config["subtleText"]}>
                <ion-icon name="logo-discord"></ion-icon>
              </Box>

            </Link>
          </Tooltip>
        </Box>
      </HStack>

      <ChangelogModal isChangeOpen={isChangeOpen} onChangeClose={onChangeClose}/>
      <FeedbackModal isFeedbackOpen={isFeedbackOpen} onFeedbackClose={onFeedbackClose}/>

    </Box>
  );
}
