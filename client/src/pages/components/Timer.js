import { useState, useEffect } from "react";
import { addDoc } from "firebase/firestore";
import { db } from "./firebase";
import { collection, increment, updateDoc, doc, getDocs } from "firebase/firestore";
import { StarIcon } from "@chakra-ui/icons";
import { Text, Box, Center, Stack, Divider } from "@chakra-ui/react";
import WpmLineChart from "./WpmLineChart";

function Timer({
  language,
  thisSolutionPR,
  user,
  leetcodeTitle,
  submitted,
  setSubmitted,
  correctWords,
  startCounting,
  pause,
  totalWords,
  correctCharacterArray,
}) {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const actualPR = thisSolutionPR;
  const [finalWPM, setFinalWPM] = useState(0);
  const submissionsCollectionRef = collection(db, "submissions");
  const [submissions, setSubmissions] = useState([]);
  const [done, setDone] = useState(pause);
  const [addedOne, setAddedOne] = useState(false);
  const [newAcc, setNewAcc] = useState(0);
  const [rank, setRank] = useState(1);
  const [totalOpponents, setTotalOpponents] = useState(1);
  console.log("START: " + startCounting);
  let totalCorrectChars = 0;
  for (let i = 0; i < correctCharacterArray.length; i++) {
    totalCorrectChars += correctCharacterArray[i];
  }
  let fakeCorrectWords = totalCorrectChars / 4.7;
  const wpm = (fakeCorrectWords / (timeElapsed / 60) || 0).toFixed(0);
  const [wpmGraph, setWPMGraph] = useState([]);

  useEffect(() => {
    if (!pause) {
      const tempArray = [...wpmGraph];
      tempArray[timeElapsed] = wpm;
      setWPMGraph(tempArray);
    }
  }, [timeElapsed, wpm]);

  useEffect(() => {
    let id;
    if (startCounting) {
      startedTest();
      id = setInterval(() => {
        setTimeElapsed((oldTime) => oldTime + 1);
      }, 1000);
    }
    return () => {
      setTimeElapsed(0);
      clearInterval(id);
    };
    //eslint-disable-next-line
  }, [startCounting]);

  useEffect(() => {
    if (done) {
      createSubmission();
    }
    //eslint-disable-next-line
  }, [done]);

  useEffect(() => {
    const getSubmissions = async () => {
      const data = await getDocs(submissionsCollectionRef);
      setSubmissions(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getSubmissions();

    //eslint-disable-next-line
  }, []);

  if (!pause && startCounting) {
    console.log(wpmGraph);
    if (wpm === "Infinity") return <p className="wpm mainFont">{0}</p>;
    return <Text className="wpm mainFont">{wpm}</Text>;
  } else if (pause) {
    const accuracy = (correctWords / totalWords || 0).toFixed(3) * 100;
    const acc = accuracy.toFixed(0);
    if (!done) {
      setFinalWPM((fakeCorrectWords / (timeElapsed / 60) || 0).toFixed(0));
      setDone(true);
      setNewAcc(acc);
    }

    const isPR = user ? parseInt(finalWPM) > parseInt(actualPR) : false;
    // specify language using BADGES (CHAKRA)
    return (
      <Box className="aboutContainer mainFont">
        <Text>{leetcodeTitle}</Text>
        {isPR && (
          <Box>
            <Center>
              <Stack direction="row">
                <StarIcon fontSize="24px" paddingTop="10px" />
                <Text className="glow" color="yellow.300">
                  NEW PR!
                </Text>
              </Stack>
            </Center>
          </Box>
        )}

        <Center>
          <Box style={{ width: 750 }}>
            <WpmLineChart givenData={wpmGraph} />
          </Box>
        </Center>
        <Center>
          <Text
            userSelect="none"
            alignSelf="center"
            color="gray"
            fontSize="15px"
            className="mainFont"
            fontWeight="200">
            wpm graph
          </Text>
        </Center>

        <Box paddingTop="24px" className="mainFont" fontSize="44px">
          <Center>
            <Stack direction="row" spacing="10">
              <Box>
                <Text>{finalWPM}</Text>
                <Text color="grey" fontSize="18px">
                  {" "}
                  WPM
                </Text>
              </Box>
              <Box>
                <Text>{acc}%</Text>
                <Text color="grey" fontSize="18px">
                  {" "}
                  accuracy
                </Text>
              </Box>
              <Box>
                <Text>
                  {rank}/{totalOpponents}
                </Text>
                <Text color="grey" fontSize="18px">
                  {" "}
                  rank
                </Text>
              </Box>
              <Box paddingTop="10px">
                <Divider
                  orientation="vertical"
                  height="20"
                  border={"1px solid"}
                  borderColor="white"
                  variant="none"
                />
              </Box>
              <Box fontWeight={300} color="grey">
                <Box>
                  {!isPR && (
                    <Box>
                      <Text>{actualPR}</Text>
                      <Text color="grey" fontSize="18px">
                        pr
                      </Text>
                    </Box>
                  )}

                  {user && isPR && (
                    <Box>
                      <Text>{actualPR}</Text>
                      <Text color="grey" fontSize="18px">
                        old pr
                      </Text>
                    </Box>
                  )}
                </Box>
              </Box>
            </Stack>
          </Center>
        </Box>
      </Box>
    );
  }

  async function createSubmission() {
    if (user) {
      let totalWpm = parseInt(finalWPM); // database doesnt update during this func so start with the current wpm
      let testsCompleted = 1;
      let firstTime = true;

      let isBestSubmission = true;
      const oldBestSubmission = submissions.filter(function (submission) {
        return (
          submission.isBestSubmission === true &&
          submission.user === user.displayName &&
          submission.language === language &&
          submission.solution_id === leetcodeTitle
        );
      });
      submissions.map((submission) => {
        if (submission.user === user.displayName) {
          // This user's submissions
          // calculate rank
          if (submission.language === language && submission.solution_id === leetcodeTitle) {
            // This user's submissions in this language and this problem
            firstTime = false;
            if (submission.isBestSubmission) {
              // remove its status if the current one is best, it cant be the best anymore
            }
            if (parseInt(submission.wpm) > parseInt(finalWPM)) {
              isBestSubmission = false;
            }
          }

          // calculate new average wpm
          totalWpm += parseInt(submission.wpm);
          testsCompleted++;
        }
        return "";
      });
      let amountBetter = 1;
      let totalOppo = 1;
      if (isBestSubmission) {
        // first update last one,
        oldBestSubmission.map((submission) => {
          updateDoc(doc(db, "submissions", submission.id), {
            isBestSubmission: false,
          });
          return "";
        });

        submissions
          .filter(function (submission) {
            return (
              submission.isBestSubmission === true &&
              submission.user !== user.displayName &&
              submission.language === language &&
              submission.solution_id === leetcodeTitle
            );
          })
          .map((submission) => {
            totalOppo++;
            if (parseInt(submission.wpm) > parseInt(finalWPM)) {
              amountBetter++;
            } else {
              decreaseRank(submission);
            }
            if (firstTime) addNewOpponent(submission, totalOppo);
            return "";
          });
        setTotalOpponents(totalOppo);
        setRank(amountBetter);
      }
      const avgWpm = (totalWpm / testsCompleted).toFixed(0);
      console.log(avgWpm);
      await updateDoc(doc(db, "users", user?.uid), {
        tests_completed: increment(1),
        average_wpm: avgWpm,
      });
      await addDoc(submissionsCollectionRef, {
        solution_id: leetcodeTitle,
        user: user.displayName,
        wpm: finalWPM,
        acc: newAcc,
        language: language,
        user_uid: user.uid,
        date: new Date().toLocaleString(),
        when: Date.parse(new Date().toLocaleString()),
        isBestSubmission: isBestSubmission,
        rank: amountBetter,
        totalOpponents: totalOppo,
      });
    }
  }

  async function decreaseRank(submission) {
    await updateDoc(doc(db, "submissions", submission?.id), {
      rank: increment(1),
    });
  }

  async function addNewOpponent(submission, numOppo) {
    await updateDoc(doc(db, "submissions", submission?.id), {
      totalOpponents: numOppo,
    });
  }

  async function startedTest() {
    if (!addedOne) {
      await updateDoc(doc(db, "users", user?.uid), {
        tests_started: increment(1), // this runs twice for some reason lol
      });
      setAddedOne(true);
    }
  }
}

export default Timer;
