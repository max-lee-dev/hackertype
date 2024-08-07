import React from "react";

import {signOut, getAuth} from "firebase/auth";
import {Button, Center, Stack, SimpleGrid, VStack, Divider, Text, Box, HStack, Tooltip} from "@chakra-ui/react";

import LineChart from "./LineChart";

import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {collection, getDocs, query, where, orderBy, limit, doc, getDoc} from "firebase/firestore";
import {db} from "./firebase"; // import your Firebase app instance
import Submission from "./Submission";
import DailySolutionChart from "./DailySolutionChart";
import Section from "./Section";
import StreakGraph from "./ProfileGraphs/StreakGraph";
import {updateDoc} from "firebase/firestore";

export default function Profile({config}) {
  async function signout() {
    await signOut(auth);
    window.location.replace("/");
  }

  const [profileUserData, setUserData] = useState(null);
  const auth = getAuth();
  const {username} = useParams();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [days, setDays] = useState(365);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [bestSubmissions, setBestSubmissions] = useState([]);


  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    //eslint-disable-next-line
  }, [loading]);

  useEffect(() => {
    setLoading(true);

    async function getUserSettings() {

      const userDoc = doc(db, "usermap", username);
      const usernameDocSnap = await getDoc(userDoc);
      const uid = usernameDocSnap.data().uid;
      const userRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userRef);
      setUserData(userDocSnap.data());
      const user = userDocSnap.data();
      let submissions = user.submissions ? user.submissions : [];
      setAllSubmissions(submissions);
      const recentSubs = submissions.slice(Math.max(submissions.length - 5, 0)).reverse();
      setRecentSubmissions(recentSubs);
      submissions.sort((a, b) => b.wpm - a.wpm);
      const bestSubs = submissions.slice(0, 5);
      setBestSubmissions(bestSubs);


    }

    getUserSettings().then(() => setLoading(false));
  }, [username]);

  var dateArr = profileUserData?.account_created.split(" ");
  var dateString = "";

  // pre update fix
  if (profileUserData && dateArr.length === 3) {
    // american
    dateString = dateArr[0].substring(0, dateArr[0].length - 1);
  } else if (profileUserData && !dateArr[2]) {
    dateString = dateArr[1];
    // vietnamese
  } else if (profileUserData) {
    dateString = dateArr[2] + " " + dateArr[1] + ", " + dateArr[3];
  }

  return (
    <Section delay={0.1}>

      <Center>

        <VStack width={['90%', '90%', '90%', '70%']} paddingTop="30px" spacing={5}>
          <Box className="userTitleContainer">
            <Section delay={0.1}>
              <Box display={'flex'} flexDir={['column', 'column', 'column', 'row']}

                   justifyContent={'space-between'} mt={30}
                   color={config["mainText"]}>
                <Box mt={5} className="mainFont font500" width={['100%', '100%', '100%', '50%']}>
                  <HStack spacing="-1">
                    {!loading && !profileUserData &&
                      <Text fontSize="40px">User not found...</Text>}
                    <Text fontSize="2em" width={'90%'}>{profileUserData?.displayName}</Text>
                    {!loading && username === user?.displayName && (
                      <Tooltip label="Sign out" aria-label="A tooltip">
                        <Button
                          color={config["logoColor"]}
                          _hover={{bgColor: "transparent", color: config["mainText"]}}
                          marginTop="20px"
                          fontSize="40px"
                          bgColor="transparent"
                          onClick={signout}>
                          <ion-icon name="log-out-outline"></ion-icon>
                        </Button>
                      </Tooltip>
                    )}
                  </HStack>
                  {profileUserData && (
                    <Text fontSize="22px" color={config["subtleText"]} className=" font400">
                      joined {dateString}
                    </Text>
                  )}
                  <Box className="signoutButton"></Box>
                </Box>


                <Box justifyContent={'space-between'} pt={[0, 0, 0, 5]}
                     width={['80%', '100%', '100%', '100%']}
                     className={'mainFont'}
                     display={'flex'}
                     flexDir={['row']} flexWrap={'wrap'}>


                  <Box width={'fit-content'}>
                    <Text fontSize="26px" className="font400">
                      {profileUserData?.avgWpm ? profileUserData?.avgWpm : 0}
                    </Text>
                    <Text fontSize="18px" color={config["subtleText"]}
                          className=" font400">
                      average WPM
                    </Text>
                  </Box>

                  <Box>
                    <Text fontSize="26px" className="font400">
                      {profileUserData?.tests_started ? profileUserData?.tests_started : 0}
                    </Text>
                    <Text fontSize="18px" color={config["subtleText"]}
                          className=" font400">
                      started
                    </Text>
                  </Box>

                  <Box>
                    <Text fontSize="26px" className="font400">
                      {profileUserData?.tests_completed ? profileUserData?.tests_completed : 0}
                    </Text>
                    <Text fontSize="18px" color={config["subtleText"]}
                          className=" font400">
                      completed
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="26px" className="font400">
                      <HStack>
                        <Box fontSize={'20px'} paddingTop={2}>
                          <ion-icon icon={'flame'}></ion-icon>
                        </Box>
                        <Text>
                          {profileUserData?.streak ? profileUserData?.streak : 0}
                        </Text>
                      </HStack>
                    </Text>
                    <Text fontSize="18px" color={config["subtleText"]}
                          className=" font400">
                      streak
                    </Text>

                  </Box>

                </Box>
              </Box>
            </Section>
          </Box>
          <Box paddingTop="0px">
            {loading && (
              <Center>
                <Box className="loader"></Box>
              </Center>
            )}
          </Box>
          <Box width={'100%'}>
            <Section delay={0.2}>
              <Center>
                <HStack h={'fit-content'} width={'100%'} mt={[100, 100, 100, 0]}>
                  <Box width={'50%'}>
                    <Box>
                      <Center>
                        <Box style={{
                          width: '100%',

                        }}>
                          {!loading &&
                            <LineChart q={allSubmissions} days={days}/>
                          }
                        </Box>
                      </Center>

                      <Box display={'flex'} justifyContent={'space-between'} pt={[0, 0, 0, 0]}>
                        {!loading && (
                          <Text
                            alignSelf="flex-start"
                            paddingLeft="20px"
                            color={config["subtleText"]}
                            fontSize="15px"
                            pt={0.5}
                            className="mainFont"
                            fontWeight="200">
                            submission history
                          </Text>
                        )}
                        {!loading && (
                          <HStack pt={0} spacing={2}>
                            <Button
                              height={4}
                              fontWeight={500}
                              onClick={() => setDays(7)}
                              color={days === 7 ? config["logoColor"] : config["subtleText"]}
                              borderColor={days === 7 ? config["logoColor"] : "transparent"}
                              p={1}
                              _hover={{bgColor: "transparent", color: config["mainText"]}}
                            >
                              week
                            </Button>
                            <Button
                              height={4}
                              fontWeight={500}
                              onClick={() => setDays(30)}
                              color={days === 30 ? config["logoColor"] : config["subtleText"]}
                              borderColor={days === 30 ? config["logoColor"] : "transparent"}
                              p={1}

                              _hover={{bgColor: "transparent", color: config["mainText"]}}
                            >
                              month
                            </Button>
                            <Button
                              fontWeight={500}
                              onClick={() => setDays(365)}
                              color={days === 365 ? config["logoColor"] : config["subtleText"]}
                              height={4}
                              borderColor={days === 365 ? config["logoColor"] : "transparent"}
                              p={1}
                              _hover={{bgColor: "transparent", color: config["mainText"]}}
                            >
                              year
                            </Button>

                            <Button
                              fontWeight={500}
                              height={4}
                              onClick={() => setDays(Number.MAX_SAFE_INTEGER)}
                              color={days === Number.MAX_SAFE_INTEGER ? config["logoColor"] : config["subtleText"]}
                              borderColor={days === Number.MAX_SAFE_INTEGER ? config["logoColor"] : "transparent"}
                              p={1}
                              _hover={{bgColor: "transparent", color: config["mainText"]}}
                            >
                              all
                            </Button>


                          </HStack>
                        )}
                      </Box>
                    </Box>
                  </Box>
                  <Box width="50%">
                    <Box>
                      <Center>
                        <Box style={{
                          width: '100%',
                        }}>
                          {!loading && profileUserData &&
                            <StreakGraph user={profileUserData}/>
                          }
                        </Box>
                      </Center>
                      <Center>
                        {!loading && (
                          <Text
                            alignSelf="center"
                            paddingLeft="20px"
                            color={config["subtleText"]}
                            fontSize="15px"
                            className="mainFont"
                            fontWeight="200">
                            streak history
                          </Text>
                        )}
                      </Center>
                    </Box>
                  </Box>
                </HStack>
              </Center>
            </Section>
          </Box>
          <Box width={'100%'}>
            <Section delay={0.4}>
              <Box width={'100%'}>
                <Center>
                  <Box className="mainFont" width={'100%'}>
                    <Box color={config["mainText"]}>
                      <Box width="100%" marginLeft={"0px"}>
                        <Box>
                          <Stack direction={["column", "row", "row", "row"]}>
                            <Box className="mainFont" width={["100%", "50%", "50%", "50%"]}>
                              {!loading && (
                                <Text fontSize="20px" color={config["subtleText"]}
                                      fontWeight={600}
                                >
                                  recent
                                </Text>
                              )}

                              <VStack spacing={5}>
                                {!loading &&
                                  recentSubmissions.map((submission) => (
                                    <Box width={'100%'}>
                                      <Submission submission={submission}
                                                  config={config}/>

                                    </Box>

                                  ))}
                              </VStack>

                              {!loading && !recentSubmissions[0] && (
                                <Text fontSize="22px" color={config["subtleText"]}
                                      className=" font400">
                                  no recent submissions
                                </Text>
                              )}
                            </Box>

                            <Divider
                              orientation="vertical"
                              border={"1px solid"}
                              borderColor="transparent"
                              variant="none"
                            />
                            <Box className="mainFont" width={["100%", "50%", "50%", "50%"]}>
                              {!loading && (
                                <Text fontSize="20px" color={config["subtleText"]}
                                      fontWeight={600}>
                                  best
                                </Text>
                              )}
                              <VStack spacing={5}>

                                {!loading && bestSubmissions.map((submission) =>
                                  <Box width={'100%'}>
                                    <Submission submission={submission}/>
                                  </Box>
                                )}
                              </VStack>

                              {!loading && !bestSubmissions[0] && (
                                <Text fontSize="22px" color={config["subtleText"]}
                                      className=" font400">
                                  no recent submissions
                                </Text>
                              )}
                            </Box>
                          </Stack>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Center>
              </Box>
            </Section>
          </Box>
          {/* {!loading && profileUserData && <Box className = 'about'>
                                        <h1>WPM: {profileUserData?.wpm}</h1>
                                        <h1>Accuracy: {profileUserData?.accuracy}</h1>
                                        <h1>Last Language: {profileUserData?.lastLanguage}</h1>
                                        <br/>
                                </Box>}


                                <Box>
                                        {!loading && profileUserData && <Box className = 'smallerMainFont site-title correct'>Recent Submissions</Box>}
                                        {submissions.map(submission => {
                                                if (submission.user === profileUserData?.displayName) {
                                                        return (
                                                                <Box key={submission.id}>
                                                                        <br/>
                                                                        <h1>{submission.user}</h1>
                                                                        <h1>{submission.solution_id}</h1>
                                                                        <h1>WPM: {submission.wpm}</h1>
                                                                </Box>
                                                        )
                                                }
                                                return ''
                                        })}



                                </Box> */}
        </VStack>
      </Center>
    </Section>
  );
}
