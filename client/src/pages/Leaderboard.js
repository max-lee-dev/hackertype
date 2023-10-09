import React, { useEffect, useState } from "react";
import { db } from "./components/firebase";
import { orderBy, where, query, collection, getDocs } from "@firebase/firestore";
import { Center, Stack, VStack, Text, Box, Button, HStack, Input, Divider, useDisclosure } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import LeaderboardModal from "./components/LeaderboardModal";
import Section from "./components/Section";

import WpmLineChart from "./components/WpmLineChart";
export default function Leaderboard({ config }) {
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
    <Section delay={0.3}>
      <Center>
        <Box className="profileContainer">
          <Box className="userTitle mainFont font500">
            <Box>
              <Box width={['100%', '80%', "100%"]} paddingTop="80px" color={config["mainText"]}>
                <HStack>
                  <Text fontSize={["40px", "40px", "56px"]}>leaderboard</Text>

                  <Box paddingLeft={["0px", "0px", "50%"]}>
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
              <Box display='flex' width="100%" paddingTop="8px" className="font400 standardButton ">
                <Button onClick={() => setLanguage("C++")}>
                  <Text fontSize="22px" color={language === "C++" ? config["mainText"] : ""}>
                    C++
                  </Text>
                </Button>
                <Button onClick={() => setLanguage("Java")}>
                  <Text fontSize="22px" color={language === "Java" ? config["mainText"] : ""}>
                    Java
                  </Text>
                </Button>
                <Button onClick={() => setLanguage("Python")}>
                  <Text fontSize="22px" color={language === "Python" ? config["mainText"] : ""}>
                    Python
                  </Text>
                </Button>
              </Box>

              <Box paddingLeft="30px" paddingTop="30px">
                <Box paddingTop="24px" paddingLeft="54px">
                  {loading && <Box className="loader"></Box>}
                </Box>
                <Section delay={0.5} maxWidth={'100%'}>
                  <Stack direction="column" justifyContent={'flex-start'} display={'flex'}>
                    {!loading &&
                      top.map((solution) => (
                        <Box
                          alignSelf={'flex-start'}
                          display={'flex'}

                          paddingTop="24px"
                          className="standardButton grayText font300"

                          minH="50px"
                          maxW={'100%'}
                          overflow={'hidden'}
                          bgColor="">
                          <VStack>
                            <Button onClick={() => showLeaderboardModal(solution.solution_id)}>
                              <Text
                                  display={'flex'}
                                  textAlign={'left'}
                                fontSize="25px"
                                color={selectedCode === solution.solution_id ? config["mainText"] : ""}>
                                {solution.solution_id}
                              </Text>
                            </Button>
                          </VStack>
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
