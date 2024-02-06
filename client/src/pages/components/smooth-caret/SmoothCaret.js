import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { coordinatesOfChar } from "../utils/utils";

export default function SmoothCaret({ id }) {
  const { x, y } = coordinatesOfChar(id);
  return (
    <Box
      color="white"
      top={y - 213}
      left={x - 27}
      w={0.5}
      h={8}
      transition={"all 0.1s"}
      bg=""
      position="absolute"
      className="cursor"></Box>
  );
}
