import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { auth } from "./firebase";
import ExternalLink from "./ExternalLink";
import logo from "./assets/favicon.ico";
import { Divider, Text, Stack, Box, Button } from "@chakra-ui/react";
export default function Navbar() {
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState(window.location.pathname);

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
    <nav className="nav">
      <div className="Logo">
        <NavLink to="/" className="site-title">
          hackertype
        </NavLink>
        <NavLink to="/" className="site-title">
          <Text color="#FFCD29" marginLeft="-12px">
            .
          </Text>
          <Text color="#FFCD29" marginLeft="-5px">
            dev
          </Text>
        </NavLink>
      </div>

      <Box fontWeight={"200"}>
        <ul>
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
                  <Text
                    className="glow"
                    marginTop="12px"
                    fontSize="16px"
                    paddingRight="5px"
                    textColor="#FFCD29">
                    &lt;log in&gt;
                  </Text>
                </NavLink>
              )}
              {user && (
                <Box fontSize="40px">
                  <NavLink to={`/profile/${user.displayName}`}>
                    <li>
                      <Text
                        className="glow"
                        marginTop="12px"
                        fontSize="16px"
                        paddingRight="5px"
                        textColor="#FFCD29">
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
  );
}
