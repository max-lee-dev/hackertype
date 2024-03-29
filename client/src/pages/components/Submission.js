import React, {useEffect, useState} from "react";
import {query, collection, where, getDocs, doc, getDoc} from "firebase/firestore";
import {db} from "./firebase";
import {Stack, Text, VStack, Tooltip, HStack, Button, Box, useDisclosure, Divider} from "@chakra-ui/react";
import LeaderboardModal from "./LeaderboardModal";

export default function Submission({submission}) {
  const {
    isOpen: isLeaderboardOpen,
    onClose: onLeaderboardClose,
    onOpen: onLeaderboardOpen,
  } = useDisclosure();
  let color = "green";

  let solutionNumber = "";


  const solutionNumberArr = submission.solution_id.split(".");
  solutionNumber = solutionNumberArr[0];

  async function redirect() {
    window.location.replace(`/solutions/${submission.language}/${solutionNumber}`);
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
  var logoColor = style.getPropertyValue("--logoColor");
  color = subtleText;
  return (
    <Box>
      <Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <HStack width={["70%", "70%", "70%", "80%"]}>

            <Tooltip label="Rank" placement="top">
              <Box>
                <Text color={submission.rank === 1 ? logoColor : subtleText} userSelect={"none"}>
                  [#{submission.rank}]
                </Text>
              </Box>
            </Tooltip>
            <Box width={'100%'} textAlign="left" display={"flex"}>
              <Tooltip label={submission.date[0] + " " + formatDate(submission.when)} placement="top">
                <Text

                  overflow={"hidden"}
                  onClick={redirect}
                  width={'100%'}
                  fontSize=""
                  paddingLeft="6px"
                  className="soltitle mainTextClass  font500"
                  _hover={{cursor: "pointer"}}>
                  {submission.solution_id}
                </Text>
              </Tooltip>
            </Box>
          </HStack>


          <Box width={'fit-content'} display={'flex'} justifyContent={'flex-start'}
          >
            <Button
              fontSize="20px"
              backgroundColor="transparent"
              _active={{backgroundColor: "transparent"}}
              _hover={{color: "white"}}
              color={subtleText}
              width="50px"

              onClick={() => onLeaderboardOpen()}>
              <Box>
                <ion-icon name="podium"></ion-icon>
              </Box>
            </Button>
          </Box>
        </Box>
      </Box>
      <Stack paddingBottom={1} direction="row" spacing="10px">

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
    </Box>
  );
}
