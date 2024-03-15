import {useState, useEffect} from "react";
import dailySolutions from "./codefiles/dailySolutions";
import {addDoc, getDoc} from "firebase/firestore";
import {db} from "./firebase";
import {collection, increment, updateDoc, doc, getDocs} from "firebase/firestore";
import {StarIcon} from "@chakra-ui/icons";
import {
  Text,
  Box,
  Center,
  Stack,
  Divider,
  useDisclosure,
  Button,
  Tooltip,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import LeaderboardModal from "./LeaderboardModal";
import WpmLineChart from "./WpmLineChart";
import Section from "./Section";
import {RepeatIcon} from "@chakra-ui/icons";

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
                 last_daily,
                 correctCharacterArray,
                 wordLimit,
                 Restart,
                 showLiveWPM,
                 config,
               }) {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const actualPR = thisSolutionPR;
  const [finalWPM, setFinalWPM] = useState(0);
  const submissionsCollectionRef = collection(db, leetcodeTitle);
  const [preSubmissions, setPreSubmissions] = useState([]);
  const [done, setDone] = useState(pause);
  const [addedOne, setAddedOne] = useState(false);
  const [newAcc, setNewAcc] = useState(0);
  const [rank, setRank] = useState(1);
  const [totalOpponents, setTotalOpponents] = useState(1);
  const {
    isOpen: isLeaderboardOpen,
    onClose: onLeaderboardClose,
    onOpen: onLeaderboardOpen,
  } = useDisclosure();

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
    async function getSubmissions() {
      const querySnapshot = await getDocs(collection(db, leetcodeTitle));
      let tempSubmissions = [];
      querySnapshot.forEach((doc) => {
        tempSubmissions.push(doc.data());
      });
      setPreSubmissions(tempSubmissions);
      return tempSubmissions;
    }

    if (done) {
      getSubmissions().then((submissions) => {
        if (submissions) {
          console.log("yo: " + submissions)
          createSubmission(submissions);

        }
      });
    }

    //eslint-disable-next-line
  }, [done]);


  if (!pause && startCounting) {
    return (
      <Box className="timerContainer " fontFamily={config["font"]} minHeight={"15vh"}>
        {showLiveWPM && (
          <Box>
            {wpm === "Infinity" && (
              <Text color={config["subtleText"]} className="wpm">
                {0}
              </Text>
            )}
            {wpm !== "Infinity" && (
              <Text color={config["subtleText"]} className="wpm">
                {wpm}
              </Text>
            )}
          </Box>
        )}
      </Box>
    );
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
      <Section delay={0.15}>
        <Box className="aboutContainer mainFont" color={config["mainText"]} paddingTop="30px">
          <Text>{leetcodeTitle}</Text>
          {isPR && (
            <Box>
              <Center>
                <Stack direction="row">
                  <StarIcon fontSize="24px" paddingTop="10px"/>
                  <Text fontWeight={600} color={config["logoColor"]}>
                    NEW PR!
                  </Text>
                </Stack>
              </Center>
            </Box>
          )}

          <Center>
            <Box style={{width: 750}}>
              <WpmLineChart givenData={wpmGraph}/>
            </Box>
          </Center>
          <Center>
            <Text
              userSelect="none"
              alignSelf="center"
              color={config["subtleText"]}
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
                  <Text color={config["subtleText"]} fontSize="18px">
                    {" "}
                    WPM
                  </Text>
                </Box>
                <Box>
                  <Text>{acc}%</Text>
                  <Text color={config["subtleText"]} fontSize="18px">
                    {" "}
                    accuracy
                  </Text>
                </Box>
                <Box>
                  <Text>
                    {user && (
                      <Box>
                        {rank}/{totalOpponents}
                      </Box>
                    )}
                    {!user && (
                      <Tooltip label="Rank not saved">
                        <Box>
                          {rank}/{countOpponents(finalWPM)[1] + 1}
                        </Box>
                      </Tooltip>
                    )}
                  </Text>
                  <Text color={config["subtleText"]} fontSize="18px">
                    {" "}
                    rank
                  </Text>
                </Box>
                <Box paddingTop="10px">
                  <Divider
                    orientation="vertical"
                    height="20"
                    border={"1px solid"}
                    borderColor={config["mainText"]}
                    variant="none"
                  />
                </Box>
                <Box fontWeight={300} color={config["subtleText"]}>
                  <Box>
                    {!isPR && (
                      <Box>
                        <Text>{actualPR}</Text>
                        <Text color={config["subtleText"]} fontSize="18px">
                          pr
                        </Text>
                      </Box>
                    )}

                    {user && isPR && (
                      <Box>
                        <Text>{actualPR}</Text>
                        <Text color={config["subtleText"]} fontSize="18px">
                          old pr
                        </Text>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Stack>

              <LeaderboardModal
                isLeaderboardOpen={isLeaderboardOpen}
                onLeaderboardClose={onLeaderboardClose}
                givenSolName={leetcodeTitle}
                selectedLanguage={language}
              />
            </Center>
            <Box className="standardButton">
              <Button onClick={() => onLeaderboardOpen()} className={"standardButton"}>
                <Text fontSize="12px">view leaderboard</Text>
                <Box paddingLeft="10px" fontSize="24px">
                  <ion-icon name="podium"></ion-icon>
                </Box>
              </Button>
            </Box>
          </Box>
        </Box>
        <Center>
          <Box>
            <HStack className="mainFont standardButton">
              <Box>
                <Button
                  style={{}}
                  className={"standardButton"}
                  _hover={{backgroundColor: "transparent"}}
                  color={config["mainText"]}
                  backgroundColor="transparent"
                  _pressed={{backgroundColor: 'red'}}
                  _active={{backgroundColor: 'red'}}
                  onClick={() => Restart(language, wordLimit, "retry")}>
                  Retry Test
                </Button>
              </Box>
              <Box>
                <Button
                  _hover={{backgroundColor: "transparent"}}
                  color={config["mainText"]}
                  _pressed={{backgroundColor: 'red'}}
                  _active={{backgroundColor: 'red'}}
                  backgroundColor="transparent"
                  onClick={() => Restart(language, wordLimit)}>
                  <Text>New Test</Text>
                </Button>
              </Box>
            </HStack>
          </Box>
        </Center>
      </Section>
    );
  }

  function countOpponents(wpm) {
    let totalOppo = 0;
    let rank = 1;
    const array = [];
    preSubmissions
      .filter(function (submission) {
        return (
          submission.isBestSubmission === true &&
          submission.language === language &&
          submission.solution_id === leetcodeTitle
        );
      })
      .map((submission) => {
        if (submission.wpm > wpm) rank++;

        totalOppo++;
      });
    array[0] = rank;
    array[1] = totalOppo;
    return array;
  }

  async function checkDaily() {
    const ogDay = 1703662239000 - 27039000;
    const today = Date.parse(new Date());
    const dailyNum = Math.floor((today - ogDay) / (1000 * 60 * 60 * 24));

    if (parseInt(leetcodeTitle.split(".")[0]) === dailySolutions[dailyNum] && parseInt(last_daily) !== parseInt(dailyNum)) {
      // this is the daily problem

      console.log('hi' + dailyNum + " " + last_daily)
      await updateDoc(doc(db, "users", user?.uid), {
        last_daily: dailyNum,
        streak: increment(1),
      });

    }
  }

  async function createSubmission(submissions) {

    if (user) {
      await checkDaily();
      console.log("one")
      let totalWpm = parseInt(finalWPM); // database doesnt update during this func so start with the current wpm
      let testsCompleted = 1;
      let firstTime = true;

      let isBestSubmission = true;
      const oldBestSubmission = submissions.filter(function (submission) {
        return (
          submission.isBestSubmission === true &&
          submission.user === user.displayName &&
          submission.language === language
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
      console.log("two " + oldBestSubmission + isBestSubmission + " " + firstTime)
      let myRank = 1;
      let totalOppo = 1;
      // first update last one,
      let oldRank = -1; // if -1, then no old rank

      if (isBestSubmission) {
        oldBestSubmission.map((submission) => {
          console.log("old rank: " + submission.wpm)
          oldRank = parseInt(submission.rank);
          console.log("hi")
          const title = leetcodeTitle;
          updateBestSubmission(submission);

          return "";
        });
      }
      console.log("three")
      // AMOUNT BETTER = RANK
      // totalOppo = TOTAL
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

          // find if old pr was already better than opponents pr

          if (parseInt(submission.wpm) > parseInt(finalWPM)) {
            myRank++;
          } else {
            // if we're better than this submission
            // if we werent already better as well
            if (
              isBestSubmission &&
              parseInt(finalWPM) >= parseInt(submission.wpm) &&
              (firstTime || parseInt(oldRank) >= parseInt(submission.rank))
            ) {
              console.log("we're better than this submission");
              decreaseRank(submission);
            }
          }

          // handles total opponents, unrelated to rank
          if (firstTime && isBestSubmission) addNewOpponent(submission, totalOppo);
          return "";
        });

      console.log("four")

      setTotalOpponents(totalOppo);
      setRank(myRank);

      const avgWpm = (totalWpm / testsCompleted).toFixed(0);
      console.log(avgWpm)
      try {
        const docRef = doc(db, "users", user?.uid);
        await updateDoc(docRef, {
          tests_completed: increment(1),
          average_wpm: avgWpm,
        });
      } catch (e) {
        console.log("Error updating document: ", e);
      }
      console.log("five")

      function createDate() {
        const convert = new Date();
        const UTCDate = convert.toUTCString();
        const dateArray = [];
        var month = UTCDate.split(" ")[2];
        var monthNum = "0";
        if (month === "Jan") {
          monthNum += 1;
        } else if (month === "Feb") {
          monthNum += 2;
        } else if (month === "Mar") {
          monthNum += 3;
        } else if (month === "Apr") {
          monthNum += 4;
        } else if (month === "May") {
          monthNum += 5;
        } else if (month === "Jun") {
          monthNum += 6;
        } else if (month === "Jul") {
          monthNum += 7;
        } else if (month === "Aug") {
          monthNum += 8;
        } else if (month === "Sep") {
          monthNum += 9;
        } else if (month === "Oct") {
          monthNum = 10;
        } else if (month === "Nov") {
          monthNum = 11;
        } else if (month === "Dec") {
          monthNum = 12;
        }
        var day = UTCDate.split(" ")[1];
        var year = UTCDate.split(" ")[3];
        var time = UTCDate.split(" ")[4];
        var timezone = UTCDate.split(" ")[5];
        var date = monthNum + "/" + day + "/" + year;

        dateArray[0] = date;
        dateArray[1] = time;
        dateArray[2] = timezone;
        return dateArray;
      }

      console.log("six")

      const thisSubmission = {
        solution_id: leetcodeTitle,
        user: user.displayName,
        wpm: finalWPM,
        acc: newAcc,
        language: language,
        user_uid: user.uid,
        date: createDate(),
        when: Date.parse(new Date()),
        isBestSubmission: isBestSubmission,
        rank: myRank,
        totalOpponents: totalOppo,
      }


      console.log(isBestSubmission + " wat")

      const submissionDoc = await addDoc(submissionsCollectionRef, {
        solution_id: leetcodeTitle,
        user: user.displayName,
        wpm: finalWPM,
        acc: newAcc,
        language: language,
        user_uid: user.uid,
        date: createDate(),
        when: Date.parse(new Date()),
        isBestSubmission: isBestSubmission,
        rank: myRank,
        totalOpponents: totalOppo,
      });

      // add to all submissions for me to check
      const allSubmissionsRef = collection(db, "submissions");
      await addDoc(allSubmissionsRef, {
        solution_id: leetcodeTitle,
        user: user.displayName,
        wpm: finalWPM,
        acc: newAcc,
        language: language,
        user_uid: user.uid,
        date: createDate(),
        when: Date.parse(new Date()),
        isBestSubmission: isBestSubmission,
        rank: myRank,
        totalOpponents: totalOppo,
      });

      await updateDoc(submissionDoc, {
        id: submissionDoc.id,
      });


      const userDoc = doc(db, "users", user?.uid);
      const userSnap = await getDoc(userDoc);
      const userData = userSnap.data();


      const userSubmissions = userData.submissions ? userData.submissions : [];
      userSubmissions.push(thisSubmission);
      await updateDoc(doc(db, "users", userData?.uid), {
        submissions: userSubmissions,
      });
    } else {
      let myRank = 1;
      submissions
        .filter(function (submission) {
          return (
            submission.isBestSubmission === true &&
            submission.language === language &&
            submission.solution_id === leetcodeTitle
          );
        })
        .map((submission) => {
          // find if old pr was already better than opponents pr

          if (parseInt(submission.wpm) > parseInt(finalWPM)) {
            myRank++;
          }
        });
      setRank(myRank);
    }
  }

  async function decreaseRank(submission) {

    await updateDoc(doc(db, leetcodeTitle, submission?.id), {
      rank: increment(1),
    }).catch((error) => {
      console.log("Error updating document: ", error);
    });

  }

  async function addNewOpponent(submission, numOppo) {
    await updateDoc(doc(db, leetcodeTitle, submission?.id), {
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

  async function updateBestSubmission(submission) {
    console.log("broDASDS")
    const docRef = doc(db, leetcodeTitle, submission.id);
    console.log("a: " + docRef)
    await updateDoc(doc(db, leetcodeTitle, submission?.id), {
      isBestSubmission: false,
    }).catch((error) => {
      console.log("Error updating document: ", error);
    });
  }


}

export default Timer;
