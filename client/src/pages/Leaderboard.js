import React, { useEffect, useState } from "react";
import { db } from "./components/firebase";
import { orderBy, where, query, collection, getDocs } from "@firebase/firestore";
import { Center, Stack, Text, Box, Button, HStack, Input, Divider, useDisclosure } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import LeaderboardModal from "./components/LeaderboardModal";
import Section from "./components/Section";

import WpmLineChart from "./components/WpmLineChart";
export default function Leaderboard() {
  const [loading, setLoading] = useState(true);
  const [top, setTop] = useState([]);
  const [language, setLanguage] = useState("Java");
  const [userInput, setUserInput] = useState("");
  const [selectedCode, setSelectedCode] = useState("");
  const [showGraph, setShowGraph] = useState(false);
  const [selectedGraphCode, setSelectedGraphCode] = useState("");
  const {
    isOpen: isLeaderboardOpen,
    onClose: onLeaderboardClose,
    onOpen: onLeaderboardOpen,
  } = useDisclosure();
  useEffect(() => {
    setLoading(true);
    console.log("huh");
    async function getSubmissions() {
      const tempTopArray = [];
      const lowerUserInput = userInput.toLowerCase();
      if (language === "Java") {
        const solutionsCollectionRef = collection(db, "javaSolutions");
        const top = query(solutionsCollectionRef, orderBy("solutionNum", "asc"));
        const topQuerySnapshot = await getDocs(top);
        topQuerySnapshot.forEach((doc) => {
          if (tempTopArray.length > 49) return;
          const solutionIDLower = doc.data().solution_id.toLowerCase();
          if (lowerUserInput === "" || solutionIDLower.includes(lowerUserInput))
            tempTopArray.push(doc.data());
        });
      } else if (language === "C++") {
        const solutionsCollectionRef = collection(db, "cppSolutions");
        const top = query(solutionsCollectionRef, orderBy("solutionNum", "asc"));
        const topQuerySnapshot = await getDocs(top);
        topQuerySnapshot.forEach((doc) => {
          if (tempTopArray.length > 49) return;
          const solutionIDLower = doc.data().solution_id.toLowerCase();
          if (lowerUserInput === "" || solutionIDLower.includes(lowerUserInput))
            tempTopArray.push(doc.data());
        });
      } else if (language === "Python") {
        const solutionsCollectionRef = collection(db, "pythonSolutions");
        const top = query(solutionsCollectionRef, orderBy("solutionNum", "asc"));
        const topQuerySnapshot = await getDocs(top);
        topQuerySnapshot.forEach((doc) => {
          if (tempTopArray.length > 49) return;
          const solutionIDLower = doc.data().solution_id.toLowerCase();
          if (lowerUserInput === "" || solutionIDLower.includes(lowerUserInput))
            tempTopArray.push(doc.data());
        });
      }

      setTop(tempTopArray);
    }
    getSubmissions().then(() => setLoading(false));
  }, [language, userInput]);

  function showLeaderboardModal(id) {
    setSelectedCode(id);
    setSelectedGraphCode(id);
    onLeaderboardOpen();
  }

  return (
    <Section delay={0.1}>
      <Center>
        <Box className="profileContainer">
          <Box className="userTitle mainFont font500">
            <Box>
              <Box width="100%" paddingTop="80px" className="whiteText">
                <HStack>
                  <Text fontSize="56px">leaderboard</Text>

                  <Box paddingLeft="50%">
                    <Box className="standardButton" bgColor="" width="100%">
                      <HStack>
                        <SearchIcon
                          fontSize="24px"
                          onClick={() => {
                            setLanguage("Java");
                          }}
                        />
                        <Input
                          borderColor={"transparent"}
                          type="text"
                          placeholder="search for a solution"
                          onChange={(e) => setUserInput(e.target.value)}></Input>
                      </HStack>
                    </Box>
                  </Box>
                </HStack>
              </Box>
              <Box width="100%" paddingTop="8px" className="font400 standardButton whiteText">
                <Button onClick={() => setLanguage("C++")}>
                  <Text fontSize="22px" className={language === "C++" ? "whiteText" : ""}>
                    C++
                  </Text>
                </Button>
                <Button onClick={() => setLanguage("Java")}>
                  <Text fontSize="22px" className={language === "Java" ? "whiteText" : ""}>
                    Java
                  </Text>
                </Button>
                <Button onClick={() => setLanguage("Python")}>
                  <Text fontSize="22px" className={language === "Python" ? "whiteText" : ""}>
                    Python
                  </Text>
                </Button>
              </Box>

              <Box paddingLeft="30px" paddingTop="30px">
                <Box paddingTop="24px" paddingLeft="54px">
                  {loading && <Box className="loader"></Box>}
                </Box>
                <Section delay={0.3}>
                  <Stack direction="column">
                    {!loading &&
                      top.map((solution) => (
                        <Box
                          paddingTop="24px"
                          className="standardButton grayText font300"
                          minH="50px"
                          bgColor="">
                          <HStack>
                            <Button onClick={() => showLeaderboardModal(solution.solution_id)}>
                              <Text
                                fontSize="25px"
                                className={selectedCode === solution.solution_id ? "whiteText" : ""}>
                                {solution.solution_id}
                              </Text>
                            </Button>
                          </HStack>
                          {/* {selectedCode === solution.solution_id && (
                        <Box paddingLeft="13px" width="100%" paddingTop={"5px"}>
                          <HStack justifyContent={"space-between"}>
                            <Box paddingTop="10px">
                              <Text fontSize="22px" className="whiteText font500">
                                {solution.wr_user}
                                {!solution.wr_user && <Text>no user</Text>}
                              </Text>

                              <Text className="font300" textAlign={"center"}>
                                user
                              </Text>
                            </Box>
                            <Box paddingTop="10px">
                              <Text fontSize="22px" className="whiteText font500">
                                {solution.wr_wpm}
                                {!solution.wr_wpm && <Text>no user</Text>}
                              </Text>
                              <Text textAlign="center" className="font300">
                                wpm
                              </Text>
                            </Box>
                            <Box paddingTop="10px">
                              <Text fontSize="22px" className="whiteText font500">
                                {solution.wr_date}
                                {!solution.wr_wpm && <Text>no user</Text>}
                              </Text>
                              <Text textAlign="center" className="font300">
                                date
                              </Text>
                            </Box>
                            <Box paddingTop="10px">
                              <Text fontSize="22px" className="whiteText font500">
                                {solution.wr_wpm}
                                {!solution.wr_wpm && <Text>no user</Text>}
                              </Text>
                              <Text textAlign="center" className="font300">
                                wpm
                              </Text>
                            </Box>
                          </HStack>
                        </Box>
                      )} */}
                        </Box>
                      ))}
                  </Stack>
                </Section>
              </Box>
            </Box>
          </Box>
        </Box>
        <LeaderboardModal
          isLeaderboardOpen={isLeaderboardOpen}
          onLeaderboardClose={onLeaderboardClose}
          givenSolName={selectedGraphCode}
          selectedLanguage={language}
        />
      </Center>
    </Section>
  );
}
