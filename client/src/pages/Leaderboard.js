import React, { useEffect, useState } from "react";
import { db } from "./components/firebase";
import { orderBy, where, limit, query, collection, getDocs } from "@firebase/firestore";
import { Center, Stack, VStack, Text, Box, Button, HStack, Input, Divider, useDisclosure } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import LeaderboardModal from "./components/LeaderboardModal";
import { formatDate } from "./components/LeaderboardModal";
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
        const q = query(collection(db, "submissions"), limit(20), orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);
        const submissions = [];
        querySnapshot.forEach((doc) => {
            submissions.push(doc.data());
        });
        setTop(submissions);
        setLoading(false);
        }
        getSubmissions();
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
                  <Text fontSize={["40px", "40px", "56px"]}>recent submissions</Text>


                </HStack>
              </Box>

              <Box paddingLeft="30px" paddingTop="30px">
                <Box paddingTop="24px" paddingLeft="54px">
                  {loading && <Box className="loader"></Box>}
                </Box>
                <Section delay={0.5} maxWidth={'100%'}>
                  <Stack direction="column" >
                    {!loading &&
                      top.map((solution)  => (
                          <Box>
                          {solution.user !== "joemama234" && solution.user !== "starin" && (
                        <Box

                            minH={'200px'}
                          display={'flex'}

                          className="standardButton grayText font300"

                          bgColor="">
                          <VStack>
                            <Button onClick={() => showLeaderboardModal(solution.solution_id)}>
                              <VStack>

                              <Text
                                  display={'flex'}
                                  textAlign={'left'}
                                fontSize="20px"
                                color={config["mainText"]}>
                                {solution.solution_id}


                              </Text>
                                <Text
                                    display={'flex'}
                                    textAlign={'left'}
                                    fontSize="20px"
                                    color={selectedCode === solution.solution_id ? config["mainText"] : ""}>
                                    {solution.user}
                                </Text>



                                <Text
                                    display={'flex'}
                                    textAlign={'left'}
                                    fontSize="20px"
                                    color={selectedCode === solution.solution_id ? config["mainText"] : ""}>
                                    {solution.language}
                                </Text>

                              <Text fontSize="20px" color={selectedCode === solution.solution_id ? config["mainText"] : ""}>
                                {solution.wpm} WPM
                                </Text>

                              <Text fontSize="20px" color={selectedCode === solution.solution_id ? config["mainText"] : ""}>
                                  {formatDate(solution.when)}
                              </Text>
                              </VStack>

                            </Button>

                          </VStack>


                        </Box>
                          )}
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
