import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <Box marginTop="50px" bgColor={""} display="flex" justifyContent={"center"}>
      <Box fontSize="40px">
        <Link to="https://github.com/max-lee-dev/hackertype">
          <ion-icon name="logo-github"></ion-icon>
        </Link>
      </Box>
    </Box>
  );
}
