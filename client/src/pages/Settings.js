import React, { useState, useEffect } from "react";
import { Text, Box, Center, Button, Input } from "@chakra-ui/react";
import Section from "./components/Section";
export default function Settings() {
  const [stateConfig, setStateConfig] = useState(() => getConfigValues());
  const [displaySample, setDisplaySample] = useState(true);

  function parseJSON(str) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return {};
    }
  }

  function resetSettings() {
    setStateConfig({
      fontSize: 24,
      tabSize: 4,
      linesDisplayed: 5,
      showLiveWPM: true,
      showLinesLeft: true,
      retrySame: false,
      language: "Java",
      toggleBrackets: false,
      font: "Inconsolata",
    });
  }

  function getConfigValues() {
    const config = parseJSON(localStorage.getItem("config"));
    const defaultConfig = {
      fontSize: 24,
      tabSize: 4,
      linesDisplayed: 5,
      showLiveWPM: true,
      showLinesLeft: true,
      language: "Java",
      toggleBrackets: false,
      font: "Inconsolata",
    };
    return { ...defaultConfig, ...config };
  }

  useEffect(() => {
    localStorage.setItem("config", JSON.stringify(stateConfig));
  }, [stateConfig]);

  function handleChange(event, bool, font, settingName) {
    let { name, value } = event.target;
    const parseBoolean = (value) => value === "true" || value === true;

    if (bool) value = !parseBoolean(stateConfig[name]);

    if (font) value = font;
    if (settingName) name = settingName;
    console.log("hio " + name);

    setStateConfig((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
                        <Box paddingBottom="3rem" display="flex" justifyContent={"space-between"}>
                          <Text fontSize="18px" className="grayText font600">
                            <Text color="white" fontSize="40px">
                              toggle closing brackets
                            </Text>
                            automatically fill in closing brackets: ] } ) (a lil broken rn)
                          </Text>
                          <Box width="10%" fontSize="30px">
                            <Button
                              width="6.5vw"
                              name="toggleBrackets"
                              onClick={(e) => handleChange(e, true)}
                              colorScheme={stateConfig["toggleBrackets"] ? "green" : "red"}>
                              {stateConfig["toggleBrackets"] + ""}
                            </Button>
                          </Box>
                        </Box>
                        <Box>
                          <Box display="flex" justifyContent={"space-between"}>
                            <Text fontSize="18px" className="grayText font600">
                              <Box display="flex" className="standardButton">
                                <Text color="white" fontSize="40px">
                                  font family
                                </Text>
                              </Box>
                              font for the word set
                            </Text>
                          </Box>

                          <Box width="100%" flexWrap={"wrap"} display="flex">
                            <Box paddingRight="10px">
                              <Box width="10%" fontSize="30px">
                                <Button
                                  width="6.5vw"
                                  name="font"
                                  value="Inconsolata"
                                  onClick={(e) => handleChange(e, false, "Inconsolata", "font")}
                                  colorScheme={stateConfig["font"] === "Inconsolata" ? "green" : "red"}>
                                  <Text fontSize="20px" paddingBottom="1px" fontFamily="Inconsolata">
                                    Inconsolata
                                  </Text>
                                </Button>
                              </Box>
                            </Box>
                            <Box paddingRight="10px">
                              <Box width="10%" fontSize="30px">
                                <Button
                                  width="6.5vw"
                                  name="font"
                                  value="Fira Code"
                                  onClick={(e) => handleChange(e, false, "Fira Code", "font")}
                                  colorScheme={stateConfig["font"] === "Fira Code" ? "green" : "red"}>
                                  <Text fontFamily="Fira Code"> Fira Code</Text>
                                </Button>
                              </Box>
                            </Box>
                            <Box paddingRight="10px">
                              <Box width="10%" fontSize="30px">
                                <Button
                                  width="6.5vw"
                                  name="font"
                                  value="IBM Plex Serif"
                                  onClick={(e) => handleChange(e, false, "IBM Plex Serif", "font")}
                                  colorScheme={stateConfig["font"] === "IBM Plex Serif" ? "green" : "red"}>
                                  <Text fontFamily="IBM Plex Serif"> IBM Plex Serif</Text>
                                </Button>
                              </Box>
                            </Box>
                            <Box paddingRight="10px">
                              <Box width="10%" fontSize="30px">
                                <Button
                                  width="6.5vw"
                                  name="font"
                                  value="Roboto"
                                  onClick={(e) => handleChange(e, false, "Roboto", "font")}
                                  colorScheme={stateConfig["font"] === "Roboto" ? "green" : "red"}>
                                  <Text fontFamily="Roboto"> Roboto</Text>
                                </Button>
                              </Box>
                            </Box>
                            <Box paddingRight="10px">
                              <Box width="10%" fontSize="30px">
                                <Button
                                  width="6.5vw"
                                  name="font"
                                  value="Poppins"
                                  onClick={(e) => handleChange(e, false, "Poppins", "font")}
                                  colorScheme={stateConfig["font"] === "Poppins" ? "green" : "red"}>
                                  <Text fontFamily="Poppins"> Poppins</Text>
                                </Button>
                              </Box>
                            </Box>
                            <Box paddingRight="10px">
                              <Box width="10%" fontSize="30px">
                                <Button
                                  width="6.5vw"
                                  name="font"
                                  value="Inter"
                                  onClick={(e) => handleChange(e, false, "Inter", "font")}
                                  colorScheme={stateConfig["font"] === "Inter" ? "green" : "red"}>
                                  <Text fontFamily="Inter"> Inter</Text>
                                </Button>
                              </Box>
                            </Box>
                            <Box paddingRight="10px">
                              <Box width="10%" fontSize="30px">
                                <Button
                                  minWidth="6.5vw"
                                  name="font"
                                  value="Source Code Pro"
                                  onClick={(e) => handleChange(e, false, "Source Code Pro", "font")}
                                  colorScheme={stateConfig["font"] === "Source Code Pro" ? "green" : "red"}>
                                  <Text fontFamily="Source Code Pro"> Source Code Pro</Text>
                                </Button>
                              </Box>
                            </Box>
                            <Box paddingRight="10px">
                              <Box width="10%" fontSize="30px">
                                <Button
                                  minWidth="6.5vw"
                                  name="font"
                                  value="Lexend Deca"
                                  onClick={(e) => handleChange(e, false, "Lexend Deca", "font")}
                                  colorScheme={stateConfig["font"] === "Lexend Deca" ? "green" : "red"}>
                                  <Text fontFamily="Lexend Deca"> Lexend Deca</Text>
                                </Button>
                              </Box>
                            </Box>
                          </Box>
                          {displaySample && (
                            <Box paddingTop="10px" color="gray">
                              <Text fontSize="16px" className="grayText font500">
                                <Text color="gray" fontFamily={stateConfig["font"]}>
                                  class Solution public int[] twoSum(int[] nums, int target) {"{ "}
                                </Text>

                                <Text color="gray" fontFamily={stateConfig["font"]}>
                                  {"->, +, %, -, =, (, ), {, }, [, ], <, >, /, *, !, ~, ^, &, |, ? "}
                                </Text>
                                <Text color="gray" fontFamily={stateConfig["font"]}>
                                  {"0, 1, 2, 3, 4, 5, 6, 7, 8, 9"}
                                </Text>
                              </Text>
                            </Box>
                          )}
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
