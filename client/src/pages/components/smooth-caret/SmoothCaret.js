import React, {useEffect} from "react";
import {Box, Text} from "@chakra-ui/react";
import {coordinatesOfChar} from "../utils/utils";

export default function SmoothCaret({loading, id, curWord}) {
  let {x, y} = coordinatesOfChar(id, curWord.length);
  useEffect(() => {
    if (loading) {
      x = 0;
      y = 0;
    }
  }, [loading]);

  return (
    <Box
      color="white"
      top={y}
      left={x}
      w={1}
      h={8}
      transition={"all 0.1s"}
      position="absolute"
      bg={'red'}
      className="cursor"></Box>
  );
}
