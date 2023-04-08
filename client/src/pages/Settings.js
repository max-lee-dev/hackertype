import React, { useState, useEffect } from "react";
import { Text, Box, Center, Button, HStack, VStack, Input } from "@chakra-ui/react";
import Section from "./components/Section";
export default function Settings() {
  const [stateConfig, setStateConfig] = useState(() => getConfigValues());

  function parseJSON(str) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return {};
    }
  }

  function getConfigValues() {
    const config = parseJSON(localStorage.getItem("config"));
    const defaultConfig = {
      fontSize: 30,
      tabSize: 4,
      linesDisplayed: 5,
      showLiveWPM: true,
      showLinesLeft: true,
      language: "Java",
    };
    return { ...defaultConfig, ...config };
  }

  useEffect(() => {
    localStorage.setItem("config", JSON.stringify(stateConfig));
  }, [stateConfig]);

  function handleChange(event, bool) {
    let { name, value } = event.target;
    const parseBoolean = (value) => value === "true" || value === true;

    if (bool) value = !parseBoolean(stateConfig[name]);

    setStateConfig((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function resetSettings() {
    setStateConfig({
      fontSize: 30,
      tabSize: 4,
      linesDisplayed: 5,
      showLiveWPM: true,
      showLinesLeft: true,
      retrySame: false,
    });
  }

  return (
    <Section delay={0.1}>
      <Center>
        <Box width="70%" className=" mainFont font500">
          <Center>
            <Box width="100%" paddingTop="50px" className="whiteText">
              <Box>
                <Box>
                  <Section delay={0.2}>
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
                  </Section>
                </Box>
                <Section delay={0.3}>
                  <Text color="gray" fontSize="45px">
                    ui
                  </Text>
                  <Box paddingLeft="5rem">
                    <Box paddingBottom="3rem" display="flex" justifyContent={"space-between"}>
                      <Text fontSize="18px" className="grayText font600">
                        <Text color="white" fontSize="40px">
                          live WPM display
                        </Text>
                        words per minute displayed while typing
                      </Text>
                      <Box width="10%" fontSize="30px">
                        <Button
                          width="6.5vw"
                          name="showLiveWPM"
                          onClick={(e) => handleChange(e, true)}
                          colorScheme={stateConfig["showLiveWPM"] ? "green" : "red"}>
                          {stateConfig["showLiveWPM"] + ""}
                        </Button>
                      </Box>
                    </Box>
                    <Box paddingBottom="3rem" display="flex" justifyContent={"space-between"}>
                      <Text fontSize="18px" className="grayText font600">
                        <Text color="white" fontSize="40px">
                          show lines left
                        </Text>
                        show the number of lines left while typing
                      </Text>
                      <Box width="10%" fontSize="30px">
                        <Button
                          width="6.5vw"
                          name="showLinesLeft"
                          onClick={(e) => handleChange(e, true)}
                          colorScheme={stateConfig["showLinesLeft"] ? "green" : "red"}>
                          {stateConfig["showLinesLeft"] + ""}
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Section>
              </Box>
              <Center className="standardButton">
                <Button fontSize="22px" className=" grayText font400" onClick={() => resetSettings()}>
                  Reset to default
                </Button>
              </Center>
            </Box>
          </Center>
        </Box>
      </Center>
    </Section>
  );
}
