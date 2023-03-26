import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "./firebase";
import ExternalLink from "./ExternalLink";
import logo from "./assets/favicon.ico";
import { Divider, Text, Stack, Box } from "@chakra-ui/react";
export default function Navbar() {
  const [user, setUser] = useState(null);

  auth.onAuthStateChanged((user) => {
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
  });

  //eslint-disable-next-line
  return (
    <nav className="nav">
      <div className="Logo">
        <Link to="/" className="site-title">
          hackertype
        </Link>
        <Link to="/" className="site-title">
          <Text color="#FFCD29" marginLeft="-7px">
            .dev
          </Text>
        </Link>
      </div>

      <Box fontWeight={"200"}>
        <ul>
          <li>
            <Link to="/solutions">&lt;solutions&gt;</Link>
          </li>
          <li>
            <Link to="/leaderboard">&lt;leaderboard&gt;</Link>
          </li>
          <li>
            <Link to="/about">&lt;about&gt;</Link>
          </li>
          <li>
            <Stack direction="row">
              {!user && (
                <Link to="/login">
                  <Text
                    className="glow"
                    marginTop="12px"
                    fontSize="16px"
                    paddingRight="5px"
                    textColor="#FFCD29">
                    &lt;log in&gt;
                  </Text>
                </Link>
              )}
              {user && (
                <Box fontSize="40px">
                  <Link to={`/profile/${user.displayName}`}>
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
                  </Link>
                </Box>
              )}
            </Stack>
          </li>
        </ul>
      </Box>
    </nav>
  );
}
