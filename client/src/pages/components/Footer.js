import React from "react";
import { Box, Text, Center } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <Box paddingLeft="50px" marginTop="110px" bgColor={""} display="flex" justifyContent={"center"}>
      <Box fontSize="40px">
        <Link to="https://github.com/max-lee-dev/hackertype">
          <Center>
            <ion-icon name="logo-github"></ion-icon>
          </Center>
          <Text paddingTop="10px" paddingBottom="5px" className="mainFont" fontSize="12px" color="gray">
            last updated 4/5/2023
          </Text>
        </Link>
      </Box>
    </Box>
  );
}
