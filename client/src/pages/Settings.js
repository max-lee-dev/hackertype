import React, { useState, useEffect } from "react";
import { Text, Box, Center, Button, Input, background, HStack } from "@chakra-ui/react";
import Section from "./components/Section";
import { SketchPicker } from "react-color";
import { Sketch } from "react-color/lib/components/sketch/Sketch";

export default function Settings({ setUpdatedConfig, setThemeBackground }) {
  const [stateConfig, setStateConfig] = useState(() => getConfigValues());
  const [displaySample, setDisplaySample] = useState(true);
  const [lastTheme, setLastTheme] = useState(stateConfig["theme"]);
  const [currentColor, setCurrentColor] = useState("#ffffff");

  function parseJSON(str) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return {};
    }
  }

  function resetSettings() {
    // this is so stupid
    setThemeBackground("#171717");
    darkTheme(true);
    setLastTheme("dark");

    setStateConfig({
      fontSize: 24,
      tabSize: 4,
      linesDisplayed: 5,
      showLiveWPM: true,
      showLinesLeft: true,
      language: "Java",
      toggleBrackets: false,
      font: "Lexend Deca",
      lastCheckedUpdate: 0,

      // theme
      theme: "dark",
      themeBackground: "#171717",
      logoColor: "#FFCD29",
      mainText: "#ededed",
      subtleText: "gray",
      caretColor: "#ffffff",
      correctText: "#d6d4d4",
      incorrectText: "#fabbbb",
      themeActiveButton: "#171721",
      themeInactiveButton: "#303038",
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
      font: "Lexend Deca",
      lastCheckedUpdate: 0,

      // theme
      theme: "dark",
      themeBackground: "#171717",
      logoColor: "#FFCD29",
      mainText: "#ededed",
      subtleText: "gray",
      caretColor: "#ffffff",
      correctText: "#d6d4d4",
      incorrectText: "#fabbbb",
      themeActiveButton: "#171721",
      themeInactiveButton: "#303038",
    };

    return { ...defaultConfig, ...config };
  }

  useEffect(() => {
    setUpdatedConfig(stateConfig);
    localStorage.setItem("config", JSON.stringify(stateConfig));
  }, [stateConfig]);

  function handleChange(event, bool, font, settingName) {
    let { name, value } = event.target;
    const parseBoolean = (value) => value === "true" || value === true;

    if (bool) value = !parseBoolean(stateConfig[name]);

    if (font) value = font;
    if (settingName) name = settingName;

    setStateConfig((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  var root = document.querySelector(":root");
  useEffect(() => {
    root.style.setProperty("background-color", stateConfig["themeBackground"]);
    root.style.setProperty("--backgroundColor", stateConfig["themeBackground"]);
    root.style.setProperty("--logoColor", stateConfig["logoColor"]);
    root.style.setProperty("--subtleText", stateConfig["subtleText"]);
    root.style.setProperty("--caretColor", stateConfig["caretColor"]);
    root.style.setProperty("--maintext", stateConfig["mainText"]);
    root.style.setProperty("--correctText", stateConfig["correctText"]);
    root.style.setProperty("--incorrectText", stateConfig["incorrectText"]);
    root.style.setProperty("--font", stateConfig["font"]);
  }, [stateConfig["themeBackground"], stateConfig["font"]]);

  function changeTheme(theme) {
    switch (theme) {
      case "dark":
        darkTheme();
        break;
      case "light":
        lightTheme();
        break;
      case "snooze":
        snoozeTheme();
        break;
      default:
        console.log("error");
    }
  }

  function darkTheme(temp) {
    if (!temp) setLastTheme("dark");
    let tempTheme = temp ? "temp" : "theme";

    const background = "#171717";

    setStateConfig((prevState) => ({
      ...prevState,
      [tempTheme]: "dark",
      ["themeBackground"]: background,
      ["transparentText"]: "#ffffff",
      ["mainText"]: "#ededed",
      ["subtleText"]: "gray",
      ["caretColor"]: "#ffffff",
      ["correctText"]: "#d6d4d4",
      ["incorrectText"]: "#fabbbb",
      ["logoColor"]: "#FFCD29",
      ["themeActiveButton"]: "#171721",
      ["themeInactiveButton"]: "#303038",

      // ["themeButton"]: "#ffffff",
      // ["themeButtonHover"]: "#ffffff",
      // ["themeButtonActive"]: "#ffffff",
      // ["themeButtonFocus"]: "#ffffff",
      // ["themeButtonDisabled"]: "#ffffff",
    }));
    setThemeBackground(background);
  }

  function lightTheme(temp) {
    if (!temp) setLastTheme("light");
    let tempTheme = temp ? "temp" : "theme";

    const background = "#ededed";

    setStateConfig((prevState) => ({
      ...prevState,
      [tempTheme]: "light",
      ["themeBackground"]: background,
      ["transparentText"]: "#000000",
      ["mainText"]: "#0e0e10",
      ["subtleText"]: "#8c8c8c",
      ["logoColor"]: "#FFCD29",
      ["caretColor"]: "#0e0e10",
      ["correctText"]: "#302d2d",
      ["incorrectText"]: "#fabbbb",
      ["themeActiveButton"]: "#adadb3",
      ["themeInactiveButton"]: "#d0d0d6",
    }));
    setThemeBackground(background);
  }

  function snoozeTheme(temp) {
    if (!temp) setLastTheme("snooze");
    let tempTheme = temp ? "temp" : "theme";

    const background = "#636387";

    setStateConfig((prevState) => ({
      ...prevState,
      [tempTheme]: "snooze",
      ["themeBackground"]: background,
      ["transparentText"]: "#000000",
      ["mainText"]: "#4ab5f7",
      ["subtleText"]: "#a1ade6",
      ["logoColor"]: "#ed9f39",
      ["caretColor"]: "#2884bd",
      ["correctText"]: "#cceafc",
      ["incorrectText"]: "#a6559e",
      ["themeActiveButton"]: "#54ddff",
      ["themeInactiveButton"]: "#def4fa",
    }));
    setThemeBackground(background);
  }

  function bubblegumTheme(temp) {
    if (!temp) setLastTheme("bubblegum");
    let tempTheme = temp ? "temp" : "theme";

    const background = "#f2d8ec";

    setStateConfig((prevState) => ({
      ...prevState,
      [tempTheme]: "bubblegum",
      ["themeBackground"]: background,
      ["mainText"]: "#eb8fd5",
      ["subtleText"]: "#b898b0",
      ["logoColor"]: "#e60b58",
      ["caretColor"]: "#cc72a2",
      ["correctText"]: "#ff73fd",
      ["incorrectText"]: "#940320",
      ["themeActiveButton"]: "#e036c4",
      ["themeInactiveButton"]: "#f5c9ed",
    }));
    setThemeBackground(background);
  }

  function tangerineTheme(temp) {
    if (!temp) setLastTheme("tangerine");
    let tempTheme = temp ? "temp" : "theme";

    const background = "#ffd0b2";

    setStateConfig((prevState) => ({
      ...prevState,
      [tempTheme]: "tangerine",
      // create a new theme using orange/yellow colors
      ["themeBackground"]: background,
      ["mainText"]: "#fd6023",
      ["subtleText"]: "rgb(255,158,90)",
      ["logoColor"]: "#ff4600",
      ["caretColor"]: "#a95316",
      ["correctText"]: "#fd6023",
      ["incorrectText"]: "#4d0101",
      ["themeActiveButton"]: "#ffa380",
      ["themeInactiveButton"]: "rgba(255,228,194,0.79)",
    }));
    setThemeBackground(background);
  }

  return (
    <Section delay={0.1}>
      <Center>
        <Box width="70%" className=" mainFont font500" paddingTop="50px">
          <Center>
            <Box width="100%" paddingTop="50px" color={stateConfig["mainText"]}>
              <Box>
                <Box>
                  <Section delay={0.2}>
                    <Box>
                      <Text color={stateConfig["subtleText"]} fontSize="45px">
                        typing
                      </Text>
                      <Box paddingLeft="1rem">
                        <Box paddingBottom="3rem" display="flex"
                          justifyContent={"space-between"}>
                          <Text fontSize="18px" color={stateConfig["subtleText"]}
                            className=" font600">
                            <Text color={stateConfig["mainText"]} fontSize="40px">
                              font size
                            </Text>
                            character size for the word set
                          </Text>

                          <Box width="100px" fontSize="30px">
                            <Input
                              value={stateConfig["fontSize"]}
                              autoComplete="off"
                              name="fontSize"
                              onChange={handleChange}
                              borderWidth={"3px"}
                              borderColor={stateConfig["mainText"]}
                              type="text"></Input>
                          </Box>
                        </Box>
                        <Box paddingBottom="3rem" display="flex"
                          justifyContent={"space-between"}>
                          <Text fontSize="18px" color={stateConfig["subtleText"]}
                            className=" font600">
                            <Text color={stateConfig["mainText"]} fontSize="40px">
                              tab size
                            </Text>
                            number of spaces for each indent in the word set
                          </Text>
                          <Box width="100px" fontSize="30px">
                            <Input
                              value={stateConfig["tabSize"]}
                              autoComplete="off"
                              name="tabSize"
                              onChange={handleChange}
                              borderWidth={"3px"}
                              borderColor={stateConfig["mainText"]}
                              type="text"></Input>
                          </Box>
                        </Box>
                        <Box paddingBottom="3rem" display="flex"
                          justifyContent={"space-between"}>
                          <Text fontSize="18px" color={stateConfig["subtleText"]}
                            className=" font600">
                            <Text color={stateConfig["mainText"]} fontSize="40px">
                              lines displayed
                            </Text>
                            number of lines displayed while typing
                          </Text>
                          <Box width="100px" fontSize="30px">
                            <Input
                              value={stateConfig["linesDisplayed"]}
                              name="linesDisplayed"
                              autoComplete="off"
                              onChange={handleChange}
                              borderWidth={"3px"}
                              borderColor={stateConfig["mainText"]}
                              type="text"></Input>
                          </Box>
                        </Box>

                        <Box>
                          <Box display="flex" justifyContent={"space-between"}>
                            <Text fontSize="18px" color={stateConfig["subtleText"]}
                              className=" font600">
                              <Box display="flex" className="standardButton">
                                <Text color={stateConfig["mainText"]} fontSize="40px">
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
                                  minWidth="6.5vw"
                                  name="font"
                                  value="Inconsolata"
                                  onClick={(e) => handleChange(e, false, "Inconsolata", "font")}
                                  _hover={{ bgColor: stateConfig["themeActiveButton"] }}
                                  bgColor={
                                    stateConfig["font"] === "Inconsolata"
                                      ? stateConfig["themeActiveButton"]
                                      : stateConfig["themeInactiveButton"]
                                  }>
                                  <Text fontSize="20px" paddingBottom="1px"
                                    fontFamily="Inconsolata" color={stateConfig["logoColor"]}>
                                    Inconsolata
                                  </Text>
                                </Button>
                              </Box>
                            </Box>
                            <Box paddingRight="10px">
                              <Box width="10%" fontSize="30px">
                                <Button
                                  minWidth="6.5vw"
                                  name="font"
                                  value="Fira Code"
                                  onClick={(e) => handleChange(e, false, "Fira Code", "font")}
                                  _hover={{ bgColor: stateConfig["themeActiveButton"] }}
                                  bgColor={
                                    stateConfig["font"] === "Fira Code"
                                      ? stateConfig["themeActiveButton"]
                                      : stateConfig["themeInactiveButton"]
                                  }>
                                  <Text fontFamily="Fira Code" color={stateConfig["logoColor"]}> Fira Code</Text>
                                </Button>
                              </Box>
                            </Box>

                            <Box paddingRight="10px">
                              <Box width="10%" fontSize="30px">
                                <Button
                                  minWidth="6.5vw"
                                  name="font"
                                  value="IBM Plex Serif"
                                  onClick={(e) => handleChange(e, false, "IBM Plex Serif", "font")}
                                  _hover={{ bgColor: stateConfig["themeActiveButton"] }}
                                  bgColor={
                                    stateConfig["font"] === "IBM Plex Serif"
                                      ? stateConfig["themeActiveButton"]
                                      : stateConfig["themeInactiveButton"]
                                  }>
                                  <Text fontFamily="IBM Plex Serif" color={stateConfig["logoColor"]}> IBM Plex
                                    Serif</Text>
                                </Button>
                              </Box>
                            </Box>
                            <Box paddingRight="10px">
                              <Box width="10%" fontSize="30px">
                                <Button
                                  minWidth="6.5vw"
                                  name="font"
                                  value="Roboto"
                                  onClick={(e) => handleChange(e, false, "Roboto", "font")}
                                  _hover={{ bgColor: stateConfig["themeActiveButton"] }}
                                  bgColor={
                                    stateConfig["font"] === "Roboto"
                                      ? stateConfig["themeActiveButton"]
                                      : stateConfig["themeInactiveButton"]
                                  }>
                                  <Text fontFamily="Roboto" color={stateConfig["logoColor"]}> Roboto</Text>
                                </Button>
                              </Box>
                            </Box>
                            <Box paddingRight="10px">
                              <Box width="10%" fontSize="30px">
                                <Button
                                  minWidth="6.5vw"
                                  name="font"
                                  value="Poppins"
                                  onClick={(e) => handleChange(e, false, "Poppins", "font")}
                                  _hover={{ bgColor: stateConfig["themeActiveButton"] }}
                                  bgColor={
                                    stateConfig["font"] === "Poppins"
                                      ? stateConfig["themeActiveButton"]
                                      : stateConfig["themeInactiveButton"]
                                  }>
                                  <Text fontFamily="Poppins" color={stateConfig["logoColor"]}> Poppins</Text>
                                </Button>
                              </Box>
                            </Box>
                            <Box paddingRight="10px">
                              <Box width="10%" fontSize="30px">
                                <Button
                                  minWidth="6.5vw"
                                  name="font"
                                  value="Inter"
                                  onClick={(e) => handleChange(e, false, "Inter", "font")}
                                  _hover={{ bgColor: stateConfig["themeActiveButton"] }}
                                  bgColor={
                                    stateConfig["font"] === "Inter"
                                      ? stateConfig["themeActiveButton"]
                                      : stateConfig["themeInactiveButton"]
                                  }>
                                  <Text fontFamily="Inter" color={stateConfig["logoColor"]}> Inter</Text>
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
                                  _hover={{ bgColor: stateConfig["themeActiveButton"] }}
                                  bgColor={
                                    stateConfig["font"] === "Source Code Pro"
                                      ? stateConfig["themeActiveButton"]
                                      : stateConfig["themeInactiveButton"]
                                  }>
                                  <Text fontFamily="Source Code Pro" color={stateConfig["logoColor"]}> Source Code
                                    Pro</Text>
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
                                  _hover={{ bgColor: stateConfig["themeActiveButton"] }}
                                  bgColor={
                                    stateConfig["font"] === "Lexend Deca"
                                      ? stateConfig["themeActiveButton"]
                                      : stateConfig["themeInactiveButton"]
                                  }>
                                  <Text fontFamily="Lexend Deca" color={stateConfig["logoColor"]}> Lexend Deca</Text>
                                </Button>
                              </Box>
                            </Box>
                            <Box paddingRight="10px">
                              <Box width="10%" fontSize="30px">
                                <Button
                                  minWidth="6.5vw"
                                  name="font"
                                  value="Comic Neue"
                                  onClick={(e) => handleChange(e, false, "Comic Neue", "font")}
                                  _hover={{ bgColor: stateConfig["themeActiveButton"] }}
                                  bgColor={
                                    stateConfig["font"] === "Comic Neue"
                                      ? stateConfig["themeActiveButton"]
                                      : stateConfig["themeInactiveButton"]
                                  }>
                                  <Text fontFamily="Comic Neue" color={stateConfig["logoColor"]}> Comic Neue</Text>
                                </Button>
                              </Box>
                            </Box>
                          </Box>
                          {displaySample && (
                            <Box paddingTop="10px" color={stateConfig["subtleText"]}>
                              <Text fontSize="16px" className=" font500">
                                <HStack spacing={0}>
                                  <Text color={stateConfig["correctText"]}
                                    fontFamily={stateConfig["font"]}>
                                    public class Solution {"{ "}
                                  </Text>
                                  <Text color={stateConfig["subtleText"]}
                                    fontFamily={stateConfig["font"]} className={'behindCursor'}>
                                    tion public int[] twoSum(int[] nums, int
                                    target) {"{ "}
                                  </Text>
                                </HStack>

                                <Text color={stateConfig["subtleText"]}
                                  fontFamily={stateConfig["font"]}>
                                  {"->, +, %, -, =, (, ), {, }, [, ], <, >, /, *, !, ~, ^, &, |, ? "}
                                </Text>
                                <Text color={stateConfig["subtleText"]}
                                  fontFamily={stateConfig["font"]}>
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
                  <Text color={stateConfig["subtleText"]} fontSize="45px">
                    ui
                  </Text>
                  <Box paddingLeft="1rem">
                    <Box paddingBottom="3rem" display="flex" justifyContent={"space-between"}>
                      <Text fontSize="18px" color={stateConfig["subtleText"]}
                        className=" font600">
                        <Text color={stateConfig["mainText"]} fontSize="40px">
                          live WPM display
                        </Text>
                        words per minute displayed while typing
                      </Text>
                      <Box width="10%" fontSize="30px">
                        <Button
                          color={stateConfig["logoColor"]}
                          width="6.5vw"
                          name="showLiveWPM"
                          onClick={(e) => handleChange(e, true)}
                          _hover={{ bgColor: stateConfig["themeActiveButton"] }}
                          bgColor={
                            stateConfig["showLiveWPM"]
                              ? stateConfig["themeActiveButton"]
                              : stateConfig["themeInactiveButton"]
                          }>
                          {stateConfig["showLiveWPM"] + ""}
                        </Button>
                      </Box>
                    </Box>
                    <Box paddingBottom="3rem" display="flex" justifyContent={"space-between"}>
                      <Text fontSize="18px" color={stateConfig["subtleText"]}
                        className=" font600">
                        <Text color={stateConfig["mainText"]} fontSize="40px">
                          show lines left
                        </Text>
                        show the number of lines left while typing
                      </Text>
                      <Box width="10%" fontSize="30px">
                        <Button
                          color={stateConfig["logoColor"]}
                          width="6.5vw"
                          name="showLinesLeft"
                          onClick={(e) => handleChange(e, true)}
                          _hover={{ bgColor: stateConfig["themeActiveButton"] }}
                          bgColor={
                            stateConfig["showLinesLeft"]
                              ? stateConfig["themeActiveButton"]
                              : stateConfig["themeInactiveButton"]
                          }>
                          {stateConfig["showLinesLeft"] + ""}
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Section>
              </Box>
              <Box paddingTop="24px">
                <Center className="standardButton">
                  <Button
                    fontSize="22px"
                    color={stateConfig["subtleText"]}
                    className="  font400"
                    onClick={() => resetSettings()}>
                    Reset to default
                  </Button>
                </Center>
              </Box>
            </Box>
          </Center>
        </Box>
      </Center>
    </Section>
  );

  function handleOnChange(color) {
    setCurrentColor(color.hex);
  }
}
