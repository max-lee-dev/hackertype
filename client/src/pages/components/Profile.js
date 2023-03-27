import React from "react";

import { signOut, getAuth } from "firebase/auth";
import { auth } from "./firebase";
import { Button, Center, Stack, Divider, Text, Box } from "@chakra-ui/react";

import { Line } from "react-chartjs-2";
import LineChart from "./LineChart";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, doc, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "./firebase"; // import your Firebase app instance
import Submission from "./Submission";
import DailySolutionChart from "./DailySolutionChart";

export default function Profile({ setId }) {
  async function signout() {
    await signOut(auth);
    window.location.replace("/");
  }

  const [profileUserData, setUserData] = useState(null);
  const auth = getAuth();
  const { username } = useParams();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [bestSubmissions, setBestSubmissions] = useState([]);
  const [numberWorldRecords, setNumberWorldRecords] = useState(0);

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
      const q = query(collection(db, "users"));

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots

        if (doc.data().displayName === username) setUserData(doc.data());
      });
    }
    async function getRecentSubmissions() {
      const q = query(submissionsCollectionRef, where("user", "==", username));
      const top = query(q, orderBy("when", "desc"), limit(5));
      const recentQuerySnapshot = await getDocs(top);
      const tempArray = [];
      console.log(top);
      recentQuerySnapshot.forEach((doc) => {
        console.log(Date.parse(doc.data().date));
        tempArray.push(doc.id);
      });
      setRecentSubmissions(tempArray);
    }

    async function getBestSubmissions() {
      const q = query(submissionsCollectionRef, where("user", "==", username));
      const best = query(q, where("isBestSubmission", "==", true));
      const top = query(best, orderBy("rank", "asc"), limit(5));
      const topr = query(top, orderBy("when", "desc"));

      const bestQuerySnapshot = await getDocs(topr);
      const tempArray = [];

      bestQuerySnapshot.forEach((doc) => {
        tempArray.push(doc.id);
      });
      setBestSubmissions(tempArray);
    }

    async function getNumberWorldRecords() {
      const q = query(submissionsCollectionRef, where("user", "==", username));
      const top = query(q, where("rank", "==", 1));
      const isBest = query(top, where("isBestSubmission", "==", true));
      const bestQuerySnapshot = await getDocs(isBest);
      const size = bestQuerySnapshot.size;
      setNumberWorldRecords(size);
    }

    getNumberWorldRecords();
    getUserSettings();
    getBestSubmissions();
    getRecentSubmissions().then(() => setLoading(false));
  }, [username]);

  const submissionsCollectionRef = collection(db, "submissions");

  var date = new Date(profileUserData?.account_created);
  var dateArr = date.toDateString().split(" ");

  return (
    <Center>
      <Box className="profileContainer">
        <Box className="userTitleContainer">
          <Box className="userTitleCard whiteText">
            <Box className="userTitle mainFont font500">
              {!loading && !profileUserData && <Text fontSize="56px">User not found...</Text>}
              <Text fontSize="56px">{profileUserData?.displayName}</Text>

              {profileUserData && (
                <Text fontSize="22px" className="grayText font400">
                  joined {dateArr[1]} {dateArr[2]}, {dateArr[3]}
                </Text>
              )}
              {!loading && username === user?.displayName && (
                <Button
                  width={"75px"}
                  marginTop="10px"
                  fontSize="13px"
                  bgColor="transparent"
                  onClick={signout}>
                  sign out
                </Button>
              )}
            </Box>{" "}
            <Box className="signoutButton"></Box>
            <Divider orientation="vertical" border={"20px solid"} borderColor="transparent" variant="none" />
            <Stack>
              <Box className="generalUserInfo mainFont">
                <Stack direction="row" spacing={6}>
                  <Box className="generalInfoCard">
                    {profileUserData?.average_wpm && (
                      <Text fontSize="36px" className="font400">
                        {numberWorldRecords}
                      </Text>
                    )}
                    <Text fontSize="22px" className="grayText font400">
                      world records
                    </Text>
                  </Box>

                  <Box className="generalInfoCard">
                    {profileUserData?.average_wpm && (
                      <Text fontSize="36px" className="font400">
                        {profileUserData?.average_wpm}
                      </Text>
                    )}
                    <Text fontSize="22px" className="grayText font400">
                      average WPM
                    </Text>
                  </Box>

                  <Box className="generalInfoCard">
                    <Text fontSize="36px" className="font400">
                      {profileUserData?.tests_started}
                    </Text>
                    <Text fontSize="22px" className="grayText font400">
                      started
                    </Text>
                  </Box>

                  <Box className="generalInfoCard">
                    <Text fontSize="36px" className="font400">
                      {profileUserData?.tests_completed}
                    </Text>
                    <Text fontSize="22px" className="grayText font400">
                      completed
                    </Text>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Box>

        <Box className="graphContentContainer">
          <Box width="50%">
            <Box className="graphContainer">
              <Center>
                <Box marginBottom="50px" style={{ width: 600 }}>
                  <LineChart username={username} />
                </Box>
              </Center>

              <Center>
                <Text
                  alignSelf="center"
                  paddingLeft="20px"
                  color="gray"
                  fontSize="15px"
                  className="mainFont"
                  fontWeight="200">
                  submission history
                </Text>
              </Center>
            </Box>
          </Box>
          <Box width="50%">
            <Box className="dailySolutionGraph">
              <Center>
                <Box marginBottom="50px" style={{ width: 600 }}>
                  <DailySolutionChart username={username} />
                </Box>
              </Center>
              <Center>
                <Text
                  alignSelf="center"
                  paddingLeft="20px"
                  color="gray"
                  fontSize="15px"
                  className="mainFont"
                  fontWeight="200">
                  daily submissions
                </Text>
              </Center>
            </Box>
          </Box>
        </Box>
        <Center>
          <Box paddingTop="60px">
            <Box className="submissionContentContainer whiteText">
              <Box className="submissionContainer" width="100%" marginLeft={"44px"}>
                <Box className="submissionCard mainFont">
                  <Stack direction="row" spacing="2">
                    <Box className="mainFont font500" width="100%">
                      {!loading && (
                        <Text fontSize="28px" fontWeight={"300"} paddingLeft={"22px"}>
                          recent
                        </Text>
                      )}

                      {!loading && recentSubmissions.map((submission) => <Submission uid={submission} />)}

                      {!loading && !recentSubmissions[0] && (
                        <Text fontSize="22px" className="grayText font400">
                          no recent submissions
                        </Text>
                      )}
                    </Box>

                    <Divider
                      orientation="vertical"
                      border={"20px solid"}
                      borderColor="transparent"
                      variant="none"
                    />
                    <Box className="bestSubmissionsContainer mainFont font500">
                      {!loading && (
                        <Text fontSize="28px" fontWeight="300" paddingLeft={"22px"}>
                          best
                        </Text>
                      )}

                      {!loading && bestSubmissions.map((submission) => <Submission uid={submission} />)}

                      {!loading && !bestSubmissions[0] && (
                        <Text fontSize="22px" className="grayText font400">
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

        <Box className="aboutContainer">
          <Center>{loading && <Box className="site-title">Loading...</Box>}</Center>
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
      </Box>
    </Center>
  );
}
