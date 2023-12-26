import React, {useState, useEffect} from "react";
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

export default function ChangelogModal({isChangeOpen, onChangeClose}) {
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);
    const addedGreen = "#37c47b";
    const fixedYellow = "#ffe91f";
    const css = document.querySelector(":root");
    const style = getComputedStyle(css);
    var bgcolor = style.getPropertyValue("--backgroundColor");
    var mainText = style.getPropertyValue("--mainText");
    var logoColor = style.getPropertyValue("--logoColor");
    var subtleText = style.getPropertyValue("--subtleText");
    return (
        <>
            <Modal
                isOpen={isChangeOpen}
                onClose={onChangeClose}
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                size="6xl">
                <ModalOverlay/>
                <ModalContent bgColor={bgcolor} minHeight={"500px"}>
                    <ModalHeader>
                        <Box className="searchModal">
                            <Text className="mainTextClass mainFont" fontSize="32px">
                                change log
                            </Text>
                            <ModalCloseButton/>
                        </Box>
                    </ModalHeader>

                    <ModalBody>


                        <Box paddingRight="30px" height="520px" overflow="auto" className="scroll">
                            <Box paddingBottom="30px">
                                <Text className="mainTextClass mainFont">
                                    <Text fontSize="24px" fontWeight={600} color={mainText}>
                                        12/26/2023
                                        <Badge marginBottom="3px" fontSize={"14px"} ml="2" colorScheme="green">
                                            new
                                        </Badge>
                                    </Text>
                                    <Box paddingTop="15px">
                                        <Text color={subtleText}>added: </Text>
                                        <Text>- recent submissions page (revamp leaderboard) </Text>
                                    </Box>
                                    <Box paddingTop="15px">
                                        <Text color={subtleText}>fixed: </Text>
                                        <Text>- python submissions 488 & 161 indentations (thank you @drdilyor)</Text>
                                    </Box>
                                </Text>
                            </Box>
                            <Divider borderColor={subtleText}/>
                            <Box paddingBottom="30px">
                                <Text className="mainTextClass mainFont">
                                    <Text fontSize="24px" color={subtleText}>
                                        6/8/2023

                                    </Text>
                                    yo! im still alive :o
                                    <Box paddingTop="15px">
                                        <Text color={addedGreen}>added: </Text>
                                        <Text>- new login page :) </Text>
                                    </Box>
                                </Text>
                            </Box>
                            <Divider borderColor={subtleText}/>
                            <Box paddingBottom="30px">
                                <Text className="mainTextClass mainFont">
                                    <Text fontSize="24px" className={"subtleTextColor"}>
                                        5/1/2023

                                    </Text>
                                    smol update
                                    <Box paddingTop="15px">
                                        <Text color={fixedYellow}>fixed: </Text>
                                        <Text>- fixed search and word limit modal not changing for theme color</Text>
                                        <Text>- color fixed for "(x) lines not shown..." text</Text>
                                        <Text>- wpm line chart not taking theme colors (should be fixed?)</Text>
                                    </Box>
                                </Text>
                            </Box>
                            <Divider borderColor={subtleText}/>
                            <Box paddingBottom="30px">
                                <Text className="mainTextClass mainFont">
                                    <Text fontSize="24px" className="subtleTextColor">
                                        4/28/2023
                                    </Text>
                                    <Box paddingTop="15px">
                                        <Text color={addedGreen}>added: </Text>
                                        <Text>- OwO theme</Text>
                                        <Text>- Comic Neue font (comic sans)</Text>
                                    </Box>
                                </Text>
                            </Box>
                            <Divider borderColor={subtleText}/>
                            <Box paddingBottom="30px">
                                <Text className="mainTextClass mainFont">
                                    <Text fontSize="24px" className="subtleTextColor">
                                        4/27/2023
                                    </Text>
                                    <Text>😁heyyyy😁</Text>
                                    <Box paddingTop="15px">
                                        <Text color={addedGreen}>added: </Text>
                                        <Text>- snooze theme</Text>
                                    </Box>
                                </Text>
                            </Box>
                            <Divider borderColor={subtleText}/>
                            <Box paddingTop="30px" paddingBottom="30px">
                                <Text className="mainTextClass mainFont">
                                    <Text className="subtleTextColor" fontSize="24px">
                                        4/26/2023
                                    </Text>
                                    <Text>
                                        quick update. started adding themes instead cuz i felt like it. lots of things
                                        wrong
                                        currently with light theme but will fix soon.
                                    </Text>
                                    <Box paddingTop="15px">
                                        <Text color={addedGreen}>added: </Text>
                                        <Text>- light theme</Text>
                                    </Box>
                                </Text>
                            </Box>
                            <Divider borderColor={subtleText}/>
                            <Box paddingTop="30px" paddingBottom="30px">
                                <Text className="mainTextClass mainFont">
                                    <Text fontSize="24px" className="subtleTextColor">
                                        4/23/2023
                                        <Text className="subtleTextColor">v2.1.0</Text>
                                    </Text>
                                    <Text>
                                        thanks for everyone sticking with for this journey. really cool to see all the
                                        new users
                                        from around the world (we crossed 100+ users in a month). also seriously
                                        appreciate anyone
                                        who reads this :). if you're apart of the few who read this, maybe drop an email
                                        to say hi
                                        lol. also pls show to any friends who might be interested :D. the next thing i
                                        plan to add
                                        is daily solutions (like leetcode) and fixing up the login screen cuz it looks
                                        garbo --
                                        stick around if you want to see that.
                                    </Text>
                                    <Box paddingTop="15px">
                                        <Text color={addedGreen}>added: </Text>
                                        <Text>- github login</Text>
                                        <Text>- font family customization</Text>
                                        <Text paddingLeft="18px" fontSize="14px" className="subtleTextColor">
                                            email me additional fonts you want to see
                                        </Text>
                                        <Text>- scroll bar on modals look the same as the main site</Text>
                                    </Box>
                                    <Box paddingTop="15px">
                                        <Text color={fixedYellow}>fixed: </Text>
                                        <Text>- made logo, leetcode title, and default font size all smaller</Text>
                                        <Text paddingLeft="18px" fontSize="14px" className="subtleTextColor">
                                            hopefully this will make the site less claustrophobic
                                        </Text>
                                    </Box>
                                </Text>
                            </Box>
                            <Divider borderColor={subtleText}/>
                            <Box paddingTop="30px" paddingBottom="30px">
                                <Text className="mainTextClass mainFont">
                                    <Text className="subtleTextColor" fontSize="24px">
                                        4/22/2023
                                    </Text>
                                    <Text>
                                        fixed the issues with ranks on the leaderboard not corresponding as well as the
                                        initial
                                        bugs with google authentication. everything should be functional now but let me
                                        know via
                                        email if there are any major bugs! (if you made an account while the google auth
                                        was
                                        broken, you have to recreate it sry)
                                    </Text>
                                    <Box paddingTop="15px">
                                        <Text color={fixedYellow}>fixed: </Text>
                                        <Text>- fixed rank calculation</Text>
                                        <Text>- fixed google auth sign in</Text>
                                    </Box>
                                </Text>
                            </Box>
                            <Divider borderColor={subtleText}/>
                            <Box paddingTop="30px" paddingBottom="30px">
                                <Text className="mainTextClass mainFont">
                                    <Text className="subtleTextColor" fontSize="24px">
                                        4/21/2023
                                    </Text>
                                    <Text>
                                        hi! excited to see all of the new users on the site! i know there are certain
                                        bugs with
                                        leaderboard rankings and currently working on it! but right now heres a small
                                        update :)
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
