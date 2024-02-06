import React from "react";
import {Box, Text} from "@chakra-ui/react";
import {coordinatesOfChar} from "../utils/utils";

export default function SmoothCaret({id}) {
  const {x, y} = coordinatesOfChar(id);
  return (
    <Box
      color="white"
      top={y - 203}
      left={x - 182}
      w={1}
      h={8}
      transition={"all 0.1s"}
      bg=""
      position="absolute"
      className="cursor"></Box>
  );
}
