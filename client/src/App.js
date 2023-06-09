import "./App.css";
import Home from "./pages/Home.js";
import React, { useState, useEffect } from "react";
import NavBar from "./pages/components/Navbar.js";
import About from "./pages/About.js";
import Leaderboard from "./pages/Leaderboard.js";
import UserLogin from "./pages/components/UserLogin";
import Profile from "./pages/components/Profile";
import Settings from "./pages/Settings";
import { Routes, Route } from "react-router-dom";
import Footer from "./pages/components/Footer";

import { db } from "./pages/components/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Analytics } from "@vercel/analytics/react";
import { ChakraProvider, extendTheme, Box, useDisclosure } from "@chakra-ui/react";

function App() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [userData, setUserData] = useState({});
  const [id, setId] = useState("");
  const [gitLogin, setGitLogin] = useState(false);
  //eslint-disable-next-line
  const [users, setUsers] = useState([]);

  //eslint-disable-next-line
  const [stateConfig, setStateConfig] = useState(() => getConfigValues());
  const [themeBackground, setThemeBackground] = useState(stateConfig["themeBackground"]);
  const [updatedConfig, setUpdatedConfig] = useState(stateConfig);

  // thank you samyok
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
      fontSize: 24,
      tabSize: 4,
      linesDisplayed: 5,
      showLiveWPM: true,
      showLinesLeft: true,
      language: "Java",
      toggleBrackets: false,
      font: "Inconsolata",
      lastCheckedUpdate: 0,

      // theme
      theme: "dark",
      themeBackground: "#171717",
      logoColor: "#FFCD29",
      mainText: "#d9d9d9",
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
    localStorage.setItem("config", JSON.stringify(stateConfig));
  }, [stateConfig]);
  const auth = getAuth();
  var root = document.querySelector(":root");
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    // reload css properties on refresh
    root.style.setProperty("background-color", stateConfig["themeBackground"]);
    root.style.setProperty("--backgroundColor", stateConfig["themeBackground"]);
    root.style.setProperty("--subtleText", stateConfig["subtleText"]);
    root.style.setProperty("--logoColor", stateConfig["logoColor"]);

    root.style.setProperty("--maintext", stateConfig["mainText"]);
    root.style.setProperty("--caretColor", stateConfig["caretColor"]);
    root.style.setProperty("--correctText", stateConfig["correctText"]);
    root.style.setProperty("--incorrectText", stateConfig["incorrectText"]);

    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    setLoading(true);
    async function getUserSettings() {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUserData(doc.data());
      });
    }
    if (user) getUserSettings().then(() => setLoading(false));
    else setLoading(false);
  }, [user]);

  const usersCollectionRef = collection(db, "users");
  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getUsers();
    //eslint-disable-next-line
  }, []);

  const submissionsCollectionRef = collection(db, "submissions");
  useEffect(() => {
    setLoading(true);
    const getSubmissions = async () => {
      const data = await getDocs(submissionsCollectionRef);
      setSubmissions(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getSubmissions().then(() => setLoading(false));
    //eslint-disable-next-line
  }, []);

  const theme = extendTheme({
    colors: {
      brand: {
        100: "#545e56",

        // ...
        900: "#1a202c",
      },
      background: {
        100: "#f7fafc",
      },
    },
    components: {
      Button: {
        baseStyle: {
          _focus: {
            boxShadow: "none",
            outline: "none",
          },
        },
        variants: {
          base: {},
        },
        defaultProps: {
          variant: "base",
        },
      },
    },
  });

  if (userData && !loading) {
    return (
      <Box bgColor={themeBackground}>
        <ChakraProvider theme={theme}>
          <NavBar gitLogin={gitLogin} updatedConfig={updatedConfig} />
          <Box minHeight="80vh">
            <Routes>
              <Route path="/" element={<Home user={user} givenId={userData.lastId} />} />
              <Route path="/about" element={<About updatedConfig={updatedConfig} />} />
              <Route
                path="/leaderboard"
                element={<Leaderboard submissions={submissions} loading={loading} config={updatedConfig} />}
              />
              <Route
                path="/login"
                element={<UserLogin setGitLogin={setGitLogin} config={updatedConfig} user={user} setUser={setUser} />}
              />
              <Route path="/profile/:username" element={<Profile setId={setId} config={updatedConfig} />} />
              <Route path="/solutions/:givenLanguage/:number" element={<Home user={user} givenId={id} />} />
              <Route
                path="/settings"
                element={
                  <Settings setUpdatedConfig={setUpdatedConfig} setThemeBackground={setThemeBackground} />
                }
              />
            </Routes>
          </Box>
          <Footer config={updatedConfig} />
        </ChakraProvider>
        <Analytics />
      </Box>
    );
  }
}

export default App;
