import "./App.css";
import Home from "./pages/Home.js";
import React, { useState, useEffect } from "react";
import NavBar from "./pages/components/Navbar.js";
import About from "./pages/About.js";
import Leaderboard from "./pages/Leaderboard.js";
import UserLogin from "./pages/components/UserLogin";
import Profile from "./pages/components/Profile";
import Settings from "./pages/Settings";
import { Routes, Route, Link } from "react-router-dom";
import Footer from "./pages/components/Footer";

import { db } from "./pages/components/firebase";
import { collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { ChakraProvider, extendTheme, Box, useDisclosure } from "@chakra-ui/react";

function App() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [id, setId] = useState("");
  const [users, setUsers] = useState([]);
  const { isOpen: isSearchOpen, onClose: onSearchClose, onOpen: onSearchOpen } = useDisclosure();

  const auth = getAuth();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    //eslint-disable-next-line
  }, []);

  const usersCollectionRef = collection(db, "users");
  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getUsers();
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
    },
    components: {
      Button: {
        baseStyle: {
          _focus: {
            boxShadow: "none",
            outline: "none",
            color: "white",
          },
          _hover: {
            color: "white",
          },
        },
      },
    },
  });

  return (
    <>
      <ChakraProvider theme={theme}>
        <NavBar isSearchOpen={isSearchOpen} onSearchClose={onSearchClose} onSearchOpen={onSearchOpen} />
        <Box minHeight="90vh">
          <Routes>
            <Route path="/" element={<Home user={user} givenId={id} />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/leaderboard"
              element={<Leaderboard submissions={submissions} loading={loading} />}
            />
            <Route path="/login" element={<UserLogin user={user} setUser={setUser} />} />
            <Route path="/profile/:username" element={<Profile setId={setId} />} />
            <Route path="/solutions/:givenLanguage/:number" element={<Home user={user} givenId={id} />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Box>
        <Footer />
      </ChakraProvider>
    </>
  );
}

export default App;
