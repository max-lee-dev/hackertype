import React from "react";
import { Text, Box, Center, Button } from "@chakra-ui/react";
export default function Settings() {
  return (
    <Center>
      <Box className="profileContainer">
        <Box className="userTitle mainFont font500">
          <Center>
            <Box width="70%" paddingTop="50px" className="whiteText">
              <Text fontSize="56px">settings</Text>

              <Text fontSize="22px" className="grayText font400"></Text>
            </Box>
          </Center>
        </Box>
      </Box>
    </Center>
  );
}
