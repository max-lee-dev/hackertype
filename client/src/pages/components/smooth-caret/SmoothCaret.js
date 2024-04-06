import React, {useEffect} from "react";
import {Box, Text} from "@chakra-ui/react";
import {coordinatesOfChar} from "../utils/utils";

export default function SmoothCaret({loading, id, curWord}) {
  const config = localStorage.getItem("config") ? JSON.parse(localStorage.getItem("config")) : {};
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
      h={`${config["fontSize"]}px`}
      transition={"all 0.1s"}
      position="absolute"
      className="newcursor"/>
  );
}
