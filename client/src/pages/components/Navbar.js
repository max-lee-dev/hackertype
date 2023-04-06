import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { auth } from "./firebase";
import logo from "./assets/favicon.ico";
import SearchModal from "../SearchModal";

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
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
export default function Navbar({ isSearchOpen, onSearchClose, onSearchOpen }) {
  const [user, setUser] = useState(null);
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  auth.onAuthStateChanged((user) => {
    if (isSearchOpen) return;
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
  });

  useEffect(() => {}, [user]);

  //eslint-disable-next-line
  return (
    <Center>
      <Box width="100%">
        <Center>
          <nav className="nav">
            <Box className="Logo whiteText">
              <NavLink to="/" className="site-title">
                <Box className="Logo"> hackertype </Box>
              </NavLink>
              <NavLink to="/" className="site-title">
                <Text color="#FFCD29" marginLeft="-12px">
                  .
                </Text>
                <Text color="#FFCD29" marginLeft="-5px">
                  dev
                </Text>
              </NavLink>
              <Divider marginLeft="10px" marginRight="10px" />
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
            </Box>
            <Box fontWeight={"100"}>
              <ul>
                <li></li>
                <li>
                  <NavLink className="settingsNavButton" onClick={onSearchOpen}>
                    <Text color="#a1a1a1">&lt;search&gt;</Text>
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/leaderboard">&lt;leaderboard&gt;</NavLink>
                </li>
                <li>
                  <NavLink to="/about">&lt;about&gt;</NavLink>
                </li>
                <li>
                  <Stack direction="row">
                    {!user && (
                      <NavLink to="/login">
                        <Text marginTop="16px" fontSize="16px" paddingRight="5px" textColor="">
                          &lt;log in&gt;
                        </Text>
                      </NavLink>
                    )}
                    {user && (
                      <Box fontSize="40px">
                        <NavLink to={`/profile/${user.displayName}`}>
                          <li>
                            <Text marginTop="12px" fontSize="16px" paddingRight="5px" textColor="">
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
          </nav>
        </Center>
      </Box>
      <SearchModal isSearchOpen={isSearchOpen} onSearchClose={onSearchClose} />
    </Center>
  );
}
