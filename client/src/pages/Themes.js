import React, { useState, useEffect } from "react";
import { Heading, Text, ListItem, List, Box, Center, Link, Button } from "@chakra-ui/react";
import Section from "./components/Section.js";

import { } from "@chakra-ui/icons";

export default function Themes({ setUpdatedConfig, setThemeBackground, updatedConfig }) {
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

  function darkenHex(hex, amount) {
    hex = hex.replace(/^#/, '');

    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    r = Math.max(0, r - amount);
    g = Math.max(0, g - amount);
    b = Math.max(0, b - amount);

    const newHex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

    return newHex;
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
      ["themeActiveButton"]: darkenHex("#303038", 20),
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
      ["themeActiveButton"]: darkenHex("#B9B9BF", 20),
      ["themeInactiveButton"]: "#B9B9BF",
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
      ["mainText"]: "#4ab5f7", // text for hackertpye, and num. problem name
      ["subtleText"]: "#a1ade6", // text for prompt
      ["logoColor"]: "#ed9f39", // .dev text and all links
      ["caretColor"]: "#2884bd", // for blinking thing
      ["correctText"]: "#cceafc",
      ["incorrectText"]: "#a6559e",
      ["themeActiveButton"]: darkenHex("#E8EDFF", 35), // for buttons that are "pressed"
      ["themeInactiveButton"]: "#E8EDFF", //"#def4fa", // for default button color
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
      ["themeActiveButton"]: darkenHex("#f5c9ed", 20),
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
      ["themeActiveButton"]: "#FFE4C2",
      ["themeInactiveButton"]: "#FFFFDD",
    }));
    setThemeBackground(background);
  }

  function draculaTheme(temp) {
    if (!temp) setLastTheme("dracula");
    let tempTheme = temp ? "temp" : "theme";

    const background = "#282a36";

    setStateConfig((prevState) => ({
      ...prevState,
      [tempTheme]: "dracula",
      ["themeBackground"]: background,
      ["transparentText"]: "#ffffff",
      ["mainText"]: "#6272a4", // text for hackertpye, and num. problem name
      ["subtleText"]: "#b2c4d1", // text for prompt
      ["logoColor"]: "#c5619c", // .dev text and all links
      ["caretColor"]: "#ffffff", // for blinking thing
      ["correctText"]: "#ffffff",
      ["incorrectText"]: "#ff4661",
      ["themeActiveButton"]: darkenHex("#FFBB6E", 35), // for buttons that are "pressed"
      ["themeInactiveButton"]: "#FFBB6E", //"#def4fa", // for default button color
    }));
    setThemeBackground(background);
  }

  function nordTheme(temp) {
    if (!temp) setLastTheme("nordk");
    let tempTheme = temp ? "temp" : "theme";

    const background = "#2E3440";

    setStateConfig((prevState) => ({
      ...prevState,
      [tempTheme]: "nord",
      ["themeBackground"]: background,
      ["transparentText"]: "#ffffff", // fff for dark theme 000 for light
      ["mainText"]: "#87C0D1", // text for hackertpye, and num. problem name
      ["subtleText"]: "#8F9E9E", // text for prompt
      ["logoColor"]: "#81A4C5", // .dev text and all links
      ["caretColor"]: "#E0E0E0", // for blinking thing
      ["correctText"]: "#E0E0E0",
      ["incorrectText"]: "#FF4200",
      ["themeActiveButton"]: darkenHex("#3B4251", 15), // for buttons that are "pressed"
      ["themeInactiveButton"]: "#3B4251", //"#def4fa", // for default button color
    }));
    setThemeBackground(background);
  }

  function monokaiTheme(temp) {
    if (!temp) setLastTheme("monokai");
    let tempTheme = temp ? "temp" : "theme";

    const background = "#272822";

    setStateConfig((prevState) => ({
      ...prevState,
      [tempTheme]: "monokai",
      ["themeBackground"]: background,
      ["transparentText"]: "#ffffff",
      ["mainText"]: "#65D7ED", // text for hackertpye, and num. problem name
      ["subtleText"]: "#E6DB74", // text for prompt
      ["logoColor"]: "#A3DD2C", // .dev text and all links
      ["caretColor"]: "#ffffff", // for blinking thing
      ["correctText"]: "#ffffff",
      ["incorrectText"]: "#F92672",
      ["themeActiveButton"]: darkenHex("#49483E", 15), // for buttons that are "pressed"
      ["themeInactiveButton"]: "#49483E", //"#def4fa", // for default button color
    }));
    setThemeBackground(background);
  }

  function ninezerozeronineTheme(temp) {
    if (!temp) setLastTheme("9009");
    let tempTheme = temp ? "temp" : "theme";

    const background = "#EDEDED";

    setStateConfig((prevState) => ({
      ...prevState,
      [tempTheme]: "9009",
      ["themeBackground"]: background,
      ["transparentText"]: "#000000",
      ["mainText"]: "#ABC0B1", // text for hackertpye, and num. problem name
      ["subtleText"]: "#969696", // text for prompt
      ["logoColor"]: "#E4AA9E", // .dev text and all links
      ["caretColor"]: "#000000", // for blinking thing
      ["correctText"]: "#000000",
      ["incorrectText"]: "#E4AA9E",
      ["themeActiveButton"]: darkenHex("#57585C", 25), // for buttons that are "pressed"
      ["themeInactiveButton"]: "#57585C", //"#def4fa", // for default button color
    }));
    setThemeBackground(background);
  }

  function crimsonTheme(temp) {
    if (!temp) setLastTheme("crimson");
    let tempTheme = temp ? "temp" : "theme";

    const background = "#131416";

    setStateConfig((prevState) => ({
      ...prevState,
      [tempTheme]: "crimson",
      ["themeBackground"]: background,
      ["transparentText"]: "#ffffff",
      ["mainText"]: "#910921", // text for hackertpye, and num. problem name
      ["subtleText"]: "#AA6060", // text for prompt
      ["logoColor"]: "#ffffff", // .dev text and all links
      ["caretColor"]: "#ffffff", // for blinking thing
      ["correctText"]: "#ffffff",
      ["incorrectText"]: "#0B5370",
      ["themeActiveButton"]: darkenHex("#520E19", 25), // for buttons that are "pressed"
      ["themeInactiveButton"]: "#520E19", //"#def4fa", // for default button color
    }));
    setThemeBackground(background);
  }

  function evaTheme(temp) {
    if (!temp) setLastTheme("eva");
    let tempTheme = temp ? "temp" : "theme";

    const background = "#8543C1";

    setStateConfig((prevState) => ({
      ...prevState,
      [tempTheme]: "eva",
      ["themeBackground"]: background,
      ["transparentText"]: "#ffffff",
      ["mainText"]: "#55DD4B", // text for hackertpye, and num. problem name
      ["subtleText"]: "#ADADAD", // text for prompt
      ["logoColor"]: "#E09304", // .dev text and all links
      ["caretColor"]: "#ffffff", // for blinking thing
      ["correctText"]: "#ffffff",
      ["incorrectText"]: "#FF3E37",
      ["themeActiveButton"]: darkenHex("#ffffff", 45), // for buttons that are "pressed"
      ["themeInactiveButton"]: "#ffffff", //"#def4fa", // for default button color
    }));
    setThemeBackground(background);
  }

  function lasersTheme(temp) {
    if (!temp) setLastTheme("lasers");
    let tempTheme = temp ? "temp" : "theme";

    const background = "#27214D";

    setStateConfig((prevState) => ({
      ...prevState,
      [tempTheme]: "lasers",
      ["themeBackground"]: background,
      ["transparentText"]: "#ffffff",
      ["mainText"]: "#0BA8A4", // text for hackertpye, and num. problem name
      ["subtleText"]: "#8E8E8E", // text for prompt
      ["logoColor"]: "#D42450", // .dev text and all links
      ["caretColor"]: "#ffffff", // for blinking thing
      ["correctText"]: "#ffffff",
      ["incorrectText"]: "#D85914",
      ["themeActiveButton"]: darkenHex("#372289", 15), // for buttons that are "pressed"
      ["themeInactiveButton"]: "#372289", //"#def4fa", // for default button color
    }));
    setThemeBackground(background);
  }

  function slackTheme(temp) {
    if (!temp) setLastTheme("slack");
    let tempTheme = temp ? "temp" : "theme";

    const background = "#3E313C";

    setStateConfig((prevState) => ({
      ...prevState,
      [tempTheme]: "slack",
      ["themeBackground"]: background,
      ["transparentText"]: "#ffffff",
      ["mainText"]: "#FFCB68", // text for hackertpye, and num. problem name
      ["subtleText"]: "#B79FB7", // text for prompt
      ["logoColor"]: "#B79FB7", // .dev text and all links
      ["caretColor"]: "#ffffff", // for blinking thing
      ["correctText"]: "#ffffff",
      ["incorrectText"]: "#FF556C",
      ["themeActiveButton"]: darkenHex("#4F384A", 15), // for buttons that are "pressed"
      ["themeInactiveButton"]: "#4F384A", //"#def4fa", // for default button color
    }));
    setThemeBackground(background);
  }

  function latteTheme(temp) {
    if (!temp) setLastTheme("latte");
    let tempTheme = temp ? "temp" : "theme";

    const background = "#483F30";

    setStateConfig((prevState) => ({
      ...prevState,
      [tempTheme]: "latte",
      ["themeBackground"]: background,
      ["transparentText"]: "#ffffff",
      ["mainText"]: "#D9BA8C", // text for hackertpye, and num. problem name
      ["subtleText"]: "#BCA99A", // text for prompt
      ["logoColor"]: "#6B583A", // .dev text and all links
      ["caretColor"]: "#ffffff", // for blinking thing
      ["correctText"]: "#ffffff",
      ["incorrectText"]: "#8A2920",
      ["themeActiveButton"]: darkenHex("#FFFFFF", 50), // for buttons that are "pressed"
      ["themeInactiveButton"]: "#FFFFFF", //"#def4fa", // for default button color
    }));
    setThemeBackground(background);
  }

  function synthwaveTheme(temp) {
    if (!temp) setLastTheme("synthwave");
    let tempTheme = temp ? "temp" : "theme";

    const background = "#2B203B";

    setStateConfig((prevState) => ({
      ...prevState,
      [tempTheme]: "synthwave",
      ["themeBackground"]: background,
      ["transparentText"]: "#ffffff",
      ["mainText"]: "#DB33A1", // text for hackertpye, and num. problem name
      ["subtleText"]: "#EFE6AA", // text for prompt
      ["logoColor"]: "#6DFFFF", // .dev text and all links
      ["caretColor"]: "#ffffff", // for blinking thing
      ["correctText"]: "#ffffff",
      ["incorrectText"]: "#D16F6B",
      ["themeActiveButton"]: darkenHex("#241C31", 10), // for buttons that are "pressed"
      ["themeInactiveButton"]: "#241C31", //"#def4fa", // for default button color
    }));
    setThemeBackground(background);
  }

  function hackerTheme(temp) {
    if (!temp) setLastTheme("hacker");
    let tempTheme = temp ? "temp" : "theme";

    const background = "#000000";

    setStateConfig((prevState) => ({
      ...prevState,
      [tempTheme]: "hacker",
      ["themeBackground"]: background,
      ["transparentText"]: "#ffffff",
      ["mainText"]: "#00FF00", // text for hackertpye, and num. problem name
      ["subtleText"]: "#007700", // text for prompt
      ["logoColor"]: "#00FF00", // .dev text and all links
      ["caretColor"]: "#ffffff", // for blinking thing
      ["correctText"]: "#00FF00",
      ["incorrectText"]: "#FF3A00",
      ["themeActiveButton"]: darkenHex("#191919", 15), // for buttons that are "pressed"
      ["themeInactiveButton"]: "#191919", //"#def4fa", // for default button color
    }));
    setThemeBackground(background);
  }



  return (
    <Box paddingTop="50px" color={updatedConfig["mainText"]} className="mainFont">
      <Center>
        <Box paddingLeft="25px" width="70%">
          <Section delay={0.05}>
            <Heading as="h1" size="xl" mt="10">
              <Text fontWeight="500" color={updatedConfig["subtleText"]} className="mainFont">
                themes
              </Text>
            </Heading>
          </Section>

          <Center marginTop="150px">
            <Section delay={0.1}>
              <Box display="flex" gap="10px">
                <Box>
                  <Button
                    width="15rem"
                    height="5rem"
                    minWidth="6.5vw"
                    name="theme"
                    onClick={() => darkTheme()}
                    _hover={{ bgColor: darkenHex("#363636", 16) }}
                    bgColor={"#363636"}>
                    <Text fontSize="20px" color="white"
                      fontFamily={stateConfig["font"]}>
                      dark
                    </Text>
                  </Button>
                </Box>

                <Box>
                  <Button
                    width="15rem"
                    height="5rem"
                    minWidth="6.5vw"
                    name="theme"
                    onClick={() => lightTheme()}
                    _hover={{ bgColor: darkenHex("#ffffff", 60) }}
                    bgColor={"#ffffff"}>
                    <Text fontSize="20px" color="#000000"
                      fontFamily={stateConfig["font"]}>
                      light
                    </Text>
                  </Button>
                </Box>

                <Box>
                  <Button
                    width="15rem"
                    height="5rem"
                    minWidth="6.5vw"
                    name="theme"
                    onClick={() => snoozeTheme()}
                    _hover={{ bgColor: darkenHex("#a1ade6", 30) }}
                    bgColor={"#a1ade6"}>
                    <Text fontSize="20px" color="#737397"
                      fontFamily={stateConfig["font"]}>
                      snooze
                    </Text>
                  </Button>
                </Box>

                <Box>
                  <Button
                    width="15rem"
                    height="5rem"
                    minWidth="6.5vw"
                    name="theme"
                    onClick={() => bubblegumTheme()}
                    _hover={{ bgColor: darkenHex("#ffadf1", 30) }}
                    bgColor={"#ffadf1"}>
                    <Text fontSize="20px" color="#e60b58"
                      fontFamily={stateConfig["font"]}>
                      bubblegum
                    </Text>
                  </Button>
                </Box>
              </Box>
            </Section>
          </Center>

          <Center marginTop="-10px">
            <Section delay={0.2}>
              <Box display="flex" gap="10px">
                <Button
                  width="15rem"
                  height="5rem"
                  minWidth="6.5vw"
                  name="theme"
                  onClick={() => tangerineTheme()}
                  _hover={{ bgColor: darkenHex("#ffdfc3", 35) }}
                  bgColor={"#ffdfc3"}>
                  <Text fontSize="20px" color="#f58100"
                    fontFamily={stateConfig["font"]}>
                    tangerine
                  </Text>
                </Button>

                <Button
                  width="15rem"
                  height="5rem"
                  minWidth="6.5vw"
                  name="theme"
                  onClick={() => draculaTheme()}
                  _hover={{ bgColor: darkenHex("#1A1E35", 20) }}
                  bgColor={"#1A1E35"}>
                  <Text fontSize="20px" color="#c5619c"
                    fontFamily={stateConfig["font"]}>
                    dracula
                  </Text>
                </Button>

                <Button
                  width="15rem"
                  height="5rem"
                  minWidth="6.5vw"
                  name="theme"
                  onClick={() => nordTheme()}
                  _hover={{ bgColor: darkenHex("#232D3F", 15) }}
                  bgColor={"#232D3F"}>
                  <Text fontSize="20px" color="#87C0D1"
                    fontFamily={stateConfig["font"]}>
                    nord
                  </Text>
                </Button>

                <Button
                  width="15rem"
                  height="5rem"
                  minWidth="6.5vw"
                  name="theme"
                  onClick={() => monokaiTheme()}
                  _hover={{ bgColor: darkenHex("#49483E", 20) }}
                  bgColor={"#49483E"}>
                  <Text fontSize="20px" color="#A3DD2C"
                    fontFamily={stateConfig["font"]}>
                    monokai
                  </Text>
                </Button>
              </Box>
            </Section>
          </Center>

          <Center marginTop="-10px">
            <Section delay={0.3}>
              <Box display="flex" gap="10px">
                <Button
                  width="15rem"
                  height="5rem"
                  minWidth="6.5vw"
                  name="theme"
                  onClick={() => ninezerozeronineTheme()}
                  _hover={{ bgColor: darkenHex("#DDDDDD", 15) }}
                  bgColor={"#DDDDDD"}>
                  <Text fontSize="20px" color="#ABC0B1"
                    fontFamily={stateConfig["font"]}>
                    9009
                  </Text>
                </Button>

                <Button
                  width="15rem"
                  height="5rem"
                  minWidth="6.5vw"
                  name="theme"
                  onClick={() => crimsonTheme()}
                  _hover={{ bgColor: darkenHex("#381618", 15) }}
                  bgColor={"#381618"}>
                  <Text fontSize="20px" color="#910921"
                    fontFamily={stateConfig["font"]}>
                    crimson
                  </Text>
                </Button>

                <Button
                  width="15rem"
                  height="5rem"
                  minWidth="6.5vw"
                  name="theme"
                  onClick={() => evaTheme()}
                  _hover={{ bgColor: darkenHex("#713AA5", 15) }}
                  bgColor={"#713AA5"}>
                  <Text fontSize="20px" color="#55DD4B"
                    fontFamily={stateConfig["font"]}>
                    eva
                  </Text>
                </Button>

                <Button
                  width="15rem"
                  height="5rem"
                  minWidth="6.5vw"
                  name="theme"
                  onClick={() => lasersTheme()}
                  _hover={{ bgColor: darkenHex("#181A3D", 15) }}
                  bgColor={"#181A3D"}>
                  <Text fontSize="20px" color="#D42450"
                    fontFamily={stateConfig["font"]}>
                    lasers
                  </Text>
                </Button>
              </Box>
            </Section>
          </Center>

          <Center marginTop="-10px">
            <Section delay={0.4}>
              <Box display="flex" gap="10px">
                <Button
                  width="15rem"
                  height="5rem"
                  minWidth="6.5vw"
                  name="theme"
                  onClick={() => slackTheme()}
                  _hover={{ bgColor: darkenHex("#4F384A", 10) }}
                  bgColor={"#4F384A"}>
                  <Text fontSize="20px" color="#FFCB68"
                    fontFamily={stateConfig["font"]}>
                    slack
                  </Text>
                </Button>

                <Button
                  width="15rem"
                  height="5rem"
                  minWidth="6.5vw"
                  name="theme"
                  onClick={() => latteTheme()}
                  _hover={{ bgColor: darkenHex("#514736", 10) }}
                  bgColor={"#514736"}>
                  <Text fontSize="20px" color="#D9BA8C"
                    fontFamily={stateConfig["font"]}>
                    latte
                  </Text>
                </Button>

                <Button
                  width="15rem"
                  height="5rem"
                  minWidth="6.5vw"
                  name="theme"
                  onClick={() => synthwaveTheme()}
                  _hover={{ bgColor: darkenHex("#2E2044", 15) }}
                  bgColor={"#2E2044"}>
                  <Text fontSize="20px" color="#DB33A1"
                    fontFamily={stateConfig["font"]}>
                    synthwave
                  </Text>
                </Button>

                <Button
                  width="15rem"
                  height="5rem"
                  minWidth="6.5vw"
                  name="theme"
                  onClick={() => hackerTheme()}
                  _hover={{ bgColor: darkenHex("#191919", 10) }}
                  bgColor={"#191919"}>
                  <Text fontSize="20px" color="#00FF00"
                    fontFamily={stateConfig["font"]}>
                    hacker
                  </Text>
                </Button>
              </Box>
            </Section>
          </Center>
        </Box>
      </Center>
    </Box>
  );
}
