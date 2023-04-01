import React, { useEffect, useState } from "react";
import { query, collection, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { Stack, Text, Tooltip, Badge, Button, Box } from "@chakra-ui/react";

export default function Submission({ uid }) {
  const [submission, setSubmission] = useState({});
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="individualSubmissionContainer">
      <div className="submissionText">
        <div className="submissionInformationContainer">
          <Box width="400px">
            <Stack direction="row" spacing="0">
              <Tooltip label="Rank" placement="top">
                <Box>
                  <Text color={submission.rank === 1 ? "yellow" : "grey"} userSelect={"none"}>
                    [#{submission.rank}]
                  </Text>
                </Box>
              </Tooltip>
              <Box width="100%" textAlign="left">
                <Tooltip label={submission.date[0] + " " + submission.date[1]} placement="top">
                  <Text
                    onClick={redirect}
                    fontSize=""
                    paddingBottom="14px"
                    paddingLeft="6px"
                    className="soltitle whiteText font500"
                    _hover={{ cursor: "pointer" }}>
                    {submission.solution_id}
                  </Text>
                </Tooltip>
              </Box>
            </Stack>
          </Box>

          <Stack direction="row" spacing="10px">
            <Tooltip label="WPM" placement="top">
              <Text userSelect={"none"}>{submission.wpm} WPM</Text>
            </Tooltip>

            <Tooltip label="Language" placement="top">
              <Text userSelect={"none"} textColor={color}>
                [{submission.language}]
              </Text>
            </Tooltip>
          </Stack>
        </div>
      </div>
    </div>
  );
}
