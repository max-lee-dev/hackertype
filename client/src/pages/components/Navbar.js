import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { auth } from "./firebase";
import logo from "./assets/favicon.ico";
import ChangelogModal from "./ChangelogModal.js";

import { Menu, MenuList, MenuButton, MenuItem, MenuDivider, Text, Box, Divider, Center, Button, Stack, useDisclosure } from "@chakra-ui/react";
export default function Navbar({ updatedConfig }) {
  const [user, setUser] = useState(null);

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, [auth]);

  function changeLocation() {
    const currentLocation = window.location.pathname;
    if (currentLocation === "/") {
      window.location.replace(`/`);
    }
  }

  //eslint-disable-next-line
  return (
    <Center>
      <Box width="100%">
        <Center>
          <Box as="nav" className="nav" bgColor={updatedConfig["themeBackground"]}>
            <Box className="Logo whiteText" fontWeight="500">
              <NavLink onClick={changeLocation} to="/" className="site-title">
                <Box fontSize="24px" className="Logo">
                  {" "}
                  <Text color={updatedConfig["mainText"]}>hackertype </Text>
                </Box>
              </NavLink>
              <NavLink onClick={changeLocation} to="/" className="site-title">
                <Text fontSize="24px" color={updatedConfig["logoColor"]} marginLeft="-11px">
                  .
                </Text>
                <Text
                  fontSize="23px"
                  onClick={changeLocation}
                  color={updatedConfig["logoColor"]}
                  marginLeft="-4px">
                  dev
                </Text>
              </NavLink>

              <Divider marginLeft="10px" marginRight="10px" />
            </Box>
            <Box fontWeight={"500"} display={["none", "none", "inline-block"]}>
              <ul>
                <li>
                      <NavLink to="/recent">
                        <Text fontSize="16px" paddingRight="5px" textColor="">
                          &lt;recent&gt;
                        </Text>
                      </NavLink>
                </li>
                <li>
                  <NavLink to={'/settings'}>
                    <Text fontSize="16px" paddingRight="5px" textColor="">
                        &lt;settings&gt;
                    </Text>

                  </NavLink>
                </li>


                <li>
                  <NavLink to="/about">&lt;about&gt;</NavLink>
                </li>
                <li>
                  <Stack direction="row">
                    {!user && (
                      <NavLink to="/login">
                        <Text marginTop="6px" fontSize="16px" paddingRight="5px" textColor="">
                          &lt;log in&gt;
                        </Text>
                      </NavLink>
                    )}
                    {user && (
                      <Box fontSize="40px" paddingTop="3px">
                        <NavLink to={`/profile/${user.displayName}`}>
                          <li>
                            <Text marginTop="3px" fontSize="16px" paddingRight="5px" textColor="">
                              &lt;{user.displayName}&gt;
                            </Text>
                          </li>
                        </NavLink>
                      </Box>
                    )}

                  </Stack>
                </li>

              </ul>
            </Box>
            <Box
                paddingTop="5px"
                paddingRight="20px"
                opacity="1"
                color={updatedConfig["mainText"]}
                display={["block", "block", "none"]}
            >
              <Menu>
                <MenuButton
                    as={Text}
                    fontSize="27px"
                    fontWeight="400"
                    color={updatedConfig["mainText"]}
                    _hover={{ color: "#5180c4" }}
                >
                  &#9776;
                </MenuButton>
                <MenuList color="black" zIndex="101">
                  <MenuItem>
                    <Box minW="100%" as="a" href="/">
                      Home
                    </Box>
                  </MenuItem>
                  <MenuItem>
                    <Box minW="100%" as="a" href="/about">
                      About
                    </Box>
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem>
                    <Box minW="100%" as="a" href="/leaderboard">
                      Leaderboard
                    </Box>
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem>
                    {!user && (
                        <Box minW="100%" as="a" href="/login">
                            Log In
                        </Box>
                    )}
                    {user && (
                        <Box minW="100%" as="a" href={`/profile/${user.displayName}`}>
                            Profile
                        </Box>
                    )}



                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          </Box>
        </Center>
      </Box>
    </Center>
  );
}
