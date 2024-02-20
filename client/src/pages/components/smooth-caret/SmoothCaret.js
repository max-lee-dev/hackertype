import React, {useEffect} from "react";
import {Box, Text} from "@chakra-ui/react";
import {coordinatesOfChar} from "../utils/utils";

export default function SmoothCaret({loading, id, curWord}) {
  let {x, y} = coordinatesOfChar(id, curWord.length);
  useEffect(() => {
    if (loading) {
      x = coordinatesOfChar(id, curWord.length).x;
      y = coordinatesOfChar(id, curWord.length).y;
    }

  }, [loading]);

  if (loading) {
    return (
      <Box/>
    );
  }

  return (
    <Box
      color="white"
      top={y + 2}
      left={x - 5}
      w={"3px"}
      h={7}
      transition={"all 0.1s"}
      position="absolute"
      className="newcursor"/>
  );
}
