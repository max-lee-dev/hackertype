import React, { useEffect, useState } from "react";
import { query, collection, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { Stack, Text, Tooltip, Badge, Button, Box, useDisclosure, Divider } from "@chakra-ui/react";
import LeaderboardModal from "./LeaderboardModal";

export default function Submission({ uid }) {
  const [submission, setSubmission] = useState({});
  const [loading, setLoading] = useState(true);
  const {
    isOpen: isLeaderboardOpen,
    onClose: onLeaderboardClose,
    onOpen: onLeaderboardOpen,
  } = useDisclosure();
  let color = "green";
  if (submission.language === "Python") {
    color = "#c9b900";
  } else if (submission.language === "Java") {
    color = "#eda618";
  } else if (submission.language === "C++") {
    color = "#2b5599";
  }
  let solutionNumber = "";

  useEffect(() => {
    setLoading(true);
    async function getSubmission() {
      console.log("what");
      const subRef = doc(db, "submissions", uid);
      const docSnap = await getDoc(subRef);
      if (docSnap.exists()) {
        setSubmission(docSnap.data());
      } else {
        console.log("No such document!");
      }
    }
    getSubmission().then(() => setLoading(false));
  }, []);

  if (!loading) {
    const solutionNumberArr = submission.solution_id.split(".");
    solutionNumber = solutionNumberArr[0];
  }

  async function redirect() {
    window.location.replace(`/solutions/${submission.language}/${solutionNumber}`);
  }
  if (loading) {
    return <div></div>;
  }

  function formatDate(when) {
    const now = Date.parse(Date());

    const timeDiffInMs = Math.abs(now - when);
    const timeDiffInDays = Math.floor(timeDiffInMs / (1000 * 60 * 60 * 24));
    const timeDiffInHours = Math.floor(timeDiffInMs / (1000 * 60 * 60));
    const timeDiffInMinutes = Math.floor(timeDiffInMs / (1000 * 60));

    if (timeDiffInDays > 0) {
      return `${timeDiffInDays} days ago`;
    } else if (timeDiffInHours > 0) {
      return `${timeDiffInHours} hours ago`;
    } else if (timeDiffInMinutes > 0) {
      return `${timeDiffInMinutes} minutes ago`;
    } else {
      return "just now";
    }
  }

  const css = document.querySelector(":root");
  const style = getComputedStyle(css);
  var bgcolor = style.getPropertyValue("--backgroundColor");
  var subtleText = style.getPropertyValue("--subtleText");

  return (
    <div className="individualSubmissionContainer">
      <div className="submissionText">
        <div className="submissionInformationContainer">
          <Box width="400px">
            <Stack direction="row" spacing="0">
              <Tooltip label="Rank" placement="top">
                <Box>
                  <Text color={submission.rank === 1 ? "yellow" : subtleText} userSelect={"none"}>
                    [#{submission.rank}]
                  </Text>
                </Box>
              </Tooltip>
              <Box width="100%" textAlign="left" display={"flex"}>
                <Tooltip label={submission.date[0] + " " + formatDate(submission.when)} placement="top">
                  <Text
                    onClick={redirect}
                    fontSize=""
                    paddingBottom="14px"
                    paddingLeft="6px"
                    className="soltitle mainTextClass  font500"
                    _hover={{ cursor: "pointer" }}>
                    {submission.solution_id}
                  </Text>
                </Tooltip>
              </Box>
            </Stack>
          </Box>
          <Divider orientation="vertical" width="5px" />
          <Stack direction="row" spacing="10px">
            <Box>
              <Button
                fontSize="24px"
                backgroundColor="transparent"
                _active={{ backgroundColor: "transparent" }}
                _hover={{ color: "white" }}
                color={subtleText}
                width="50px"
                paddingBottom="16px"
                onClick={() => onLeaderboardOpen()}>
                <ion-icon name="podium"></ion-icon>
              </Button>
            </Box>
            <Tooltip label="WPM" placement="top">
              <Text userSelect={"none"} color={subtleText}>
                {submission.wpm} WPM
              </Text>
            </Tooltip>

            <Tooltip label="Language" placement="top">
              <Text userSelect={"none"} textColor={color}>
                [{submission.language}]
              </Text>
            </Tooltip>
          </Stack>
          <LeaderboardModal
            isLeaderboardOpen={isLeaderboardOpen}
            onLeaderboardClose={onLeaderboardClose}
            givenSolName={submission.solution_id}
            selectedLanguage={submission.language}
          />
        </div>
      </div>
    </div>
  );
}
