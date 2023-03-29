import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { auth } from "./firebase";
import logo from "./assets/favicon.ico";

import { Text, Stack, Box, Center } from "@chakra-ui/react";
export default function Navbar() {
  const [user, setUser] = useState(null);

  auth.onAuthStateChanged((user) => {
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
      <Box width="70%">
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
          </Box>

          <Box fontWeight={"200"}>
            <ul>
              <li>
                <NavLink to="/settings">&lt;settings&gt;</NavLink>
              </li>
              <li>
                <NavLink to="/solutions">&lt;solutions&gt;</NavLink>
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
                      <Text marginTop="12px" fontSize="16px" paddingRight="5px" textColor="">
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
                  @
                </Stack>
              </li>
            </ul>
          </Box>
        </nav>
      </Box>
    </Center>
  );
}
