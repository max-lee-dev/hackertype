import React, { useState, useEffect } from "react";
import {
  Text,
  Box,
  Divider,
  ModalFooter,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Badge,
} from "@chakra-ui/react";

export default function ChangelogModal({ isChangeOpen, onChangeClose }) {
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const addedGreen = "#37c47b";
  const fixedYellow = "#ffe91f";
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
                change log
              </Text>
              <ModalCloseButton />
            </Box>
          </ModalHeader>

          <ModalBody>
            <Box paddingRight="30px" paddingTop="30px" height="520px" overflow="auto" className="scroll">
              <Box paddingBottom="30px">
                <Text className="whiteText mainFont">
                  <Text fontSize="24px" color="#FFCD29">
                    4/23/2023
                    <Badge marginBottom="3px" fontSize={"14px"} ml="2" colorScheme="green">
                      new
                    </Badge>
                    <Text color="gray">v2.1.0</Text>
                  </Text>
                  <Text>
                    thanks for everyone sticking with for this journey. really cool to see all the new users
                    from around the world (we crossed 100+ users in a month). also seriously appreciate anyone
                    who reads this :). if you're apart of the few who read this, maybe drop an email to say hi
                    lol. also pls show to any friends who might be interested :D. the next thing i plan to add
                    is daily solutions (like leetcode) and fixing up the login screen cuz it looks garbo --
                    stick around if you want to see that.
                  </Text>
                  <Box paddingTop="15px">
                    <Text color={addedGreen}>added: </Text>
                    <Text>- github login</Text>
                    <Text>- font family customization</Text>
                    <Text paddingLeft="18px" fontSize="14px" color="gray">
                      email me additional fonts you want to see
                    </Text>
                    <Text>- scroll bar on modals look the same as the main site</Text>
                  </Box>
                  <Box paddingTop="15px">
                    <Text color={fixedYellow}>fixed: </Text>
                    <Text>- made logo, leetcode title, and default font size all smaller</Text>
                    <Text paddingLeft="18px" fontSize="14px" color="gray">
                      hopefully this will make the site less claustrophobic
                    </Text>
                  </Box>
                </Text>
              </Box>
              <Divider />
              <Box paddingTop="30px" paddingBottom="30px">
                <Text className="whiteText mainFont">
                  <Text fontSize="24px">4/22/2023</Text>
                  <Text>
                    fixed the issues with ranks on the leaderboard not corresponding as well as the initial
                    bugs with google authentication. everything should be functional now but let me know via
                    email if there are any major bugs! (if you made an account while the google auth was
                    broken, you have to recreate it sry)
                  </Text>
                  <Box paddingTop="15px">
                    <Text color={fixedYellow}>fixed: </Text>
                    <Text>- fixed rank calculation</Text>
                    <Text>- fixed google auth sign in</Text>
                  </Box>
                </Text>
              </Box>
              <Divider />
              <Box paddingTop="30px" paddingBottom="30px">
                <Text className="whiteText mainFont">
                  <Text fontSize="24px">4/21/2023</Text>
                  <Text>
                    hi! excited to see all of the new users on the site! i know there are certain bugs with
                    leaderboard rankings and currently working on it! but right now heres a small update :)
                  </Text>
                  <Box paddingTop="15px">
                    <Text color={addedGreen}>added: </Text>
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
