import React, { useState, useEffect } from "react";
import { Text, Box, Center, Button, HStack, VStack, Input } from "@chakra-ui/react";
export default function Settings() {
  const [stateConfig, setStateConfig] = useState(() => getConfigValues());

  function getConfigValues() {
    const config = localStorage.getItem("config");
    if (!config) {
      return {
        fontSize: 30,
        tabSize: 4,
        linesDisplayed: 5,
      };
    }
    return JSON.parse(config);
  }

  useEffect(() => {
    localStorage.setItem("config", JSON.stringify(stateConfig));
  }, [stateConfig]);

  function handleChange(event) {
    const { name, value } = event.target;
    setStateConfig((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  return (
    <Center>
      <Box width="70%" className=" mainFont font500">
        <Center>
          <Box width="100%" paddingTop="50px" className="whiteText">
            <Text color="gray" fontSize="66px">
              settings (wip)
            </Text>
            <Box>
              <Box>
                <Text color="gray" fontSize="45px">
                  typing
                </Text>
                <Box paddingLeft="5rem">
                  <Box paddingBottom="3rem" display="flex" justifyContent={"space-between"}>
                    <Text fontSize="18px" className="grayText font600">
                      <Text color="white" fontSize="40px">
                        font size
                      </Text>
                      character size for the word set
                    </Text>

                    <Box width="10%" fontSize="30px">
                      <Input
                        value={stateConfig["fontSize"]}
                        autoComplete="off"
                        name="fontSize"
                        onChange={handleChange}
                        type="text"></Input>
                    </Box>
                  </Box>
                  <Box paddingBottom="3rem" display="flex" justifyContent={"space-between"}>
                    <Text fontSize="18px" className="grayText font600">
                      <Text color="white" fontSize="40px">
                        tab size
                      </Text>
                      number of spaces for each indent in the word set
                    </Text>
                    <Box width="10%" fontSize="30px">
                      <Input
                        value={stateConfig["tabSize"]}
                        autoComplete="off"
                        name="tabSize"
                        onChange={handleChange}
                        type="text"></Input>
                    </Box>
                  </Box>
                  <Box paddingBottom="3rem" display="flex" justifyContent={"space-between"}>
                    <Text fontSize="18px" className="grayText font600">
                      <Text color="white" fontSize="40px">
                        lines displayed
                      </Text>
                      number of lines displayed while typing
                    </Text>
                    <Box width="10%" fontSize="30px">
                      <Input
                        value={stateConfig["linesDisplayed"]}
                        name="linesDisplayed"
                        autoComplete="off"
                        onChange={handleChange}
                        type="text"></Input>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Text color="gray" fontSize="45px">
                themes
              </Text>
              <Box paddingLeft="5rem">
                <Box paddingBottom="3rem" display="flex" justifyContent={"space-between"}>
                  wip
                </Box>
              </Box>
            </Box>

            <Text fontSize="22px" className="grayText font400"></Text>
          </Box>
        </Center>
      </Box>
    </Center>
  );
}
