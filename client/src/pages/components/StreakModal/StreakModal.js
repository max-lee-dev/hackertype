import React, {useState, useEffect} from "react";
import dailySolutions from "../codefiles/dailySolutions.json";
import {
  Text,
  Box,
  Divider,
  Center,
  ModalFooter,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  FormControl,
  Input,
  FormHelperText,
  FormLabel,
  Button,
  useDisclosure,
  HStack,
  VStack,
  Tooltip,
  Link,
} from "@chakra-ui/react";
import javaCode from "../codefiles/javaCode.json";

import {query, collection, getDocs, orderBy, where, updateDoc, doc, getDoc, setDoc} from "firebase/firestore";
import {db} from "../firebase";
import {limit} from "@firebase/firestore";
import Rank1 from "./Rank1";
import Rank2 from "./Rank2";
import Rank3 from "./Rank3";


export default function StreakModal({
                                      isStreakOpen,

                                      onStreakClose,
                                    }) {

  const ogDay = 1703662239000 - 27039000;
  const today = Date.parse(new Date());
  const dailyNum = Math.floor((today - ogDay) / (1000 * 60 * 60 * 24));
  const [loading, setLoading] = useState(true);
  const [userList, setUserList] = useState([]);
  const [highestRecord, setHighestRecord] = useState(0);
  const [recordHolder, setRecordHolder] = useState("dumbdumbjr");

  async function updateHighestRecord(currentStreak, username) {
    try {
      // Get reference to stats document
      const statsRef = doc(db, "stats", "streakRecord");

      // Get current stats
      const statsDoc = await getDoc(statsRef);

      if (statsDoc.exists()) {
        // If stats document exists, check if current streak is higher
        const currentRecord = statsDoc.data().highestRecord || 0;

        if (currentStreak > currentRecord) {
          // Update record if current streak is higher
          await updateDoc(statsRef, {
            highestRecord: currentStreak,
            recordHolder: username
          });
          return {highestRecord: currentStreak, recordHolder: username};
        } else {
          return {highestRecord: currentRecord, recordHolder: statsDoc.data().recordHolder};
        }
      } else {
        // If stats document doesn't exist, create it
        await setDoc(statsRef, {
          highestRecord: currentStreak,
          recordHolder: username
        });
        return {highestRecord: currentStreak, recordHolder: username};
      }
    } catch (error) {
      console.error("Error updating highest record:", error);
      return {highestRecord: 0, recordHolder: "unknown"};
    }
  }

  useEffect(() => {
    setLoading(true);

    async function getUserList() {
      const tempArr = [];

      const q = query(collection(db, "users"), where("streak", ">", 0), orderBy("streak", "desc"), limit(3));
      // , where("language", "==", selectedLanguage), where("solution_id", "==", givenSolName), orderBy("rank", "asc"), where("isBestSubmission", "==", true))
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((user) => {
        if (dailyNum - user.data().last_daily > 1) {
          updateDoc(doc(db, "users", user.data().uid), {
            streak: 0,
          });

        } else {
          tempArr.push(user.data());
        }
      });

      setUserList(tempArr);

      // Update highest record if necessary
      if (tempArr.length > 0 && tempArr[0]?.streak) {
        const {highestRecord: newRecord, recordHolder: newHolder} = await updateHighestRecord(
          tempArr[0].streak,
          tempArr[0].displayName
        );
        setHighestRecord(newRecord);
        setRecordHolder(newHolder);
      } else {
        // Just get current record if no qualifying users
        const statsRef = doc(db, "stats", "streakRecord");
        const statsDoc = await getDoc(statsRef);
        if (statsDoc.exists()) {
          setHighestRecord(statsDoc.data().highestRecord || 0);
          setRecordHolder(statsDoc.data().recordHolder || "unknown");
        }
      }
    }

    if (isStreakOpen) {
      getUserList().then(() => setLoading(false));
    }

  }, [isStreakOpen, dailyNum]);


  const css = document.querySelector(":root");
  const style = getComputedStyle(css);
  const logoC = style.getPropertyValue("--logoColor");
  var bgcolor = style.getPropertyValue("--backgroundColor");
  var subtleText = style.getPropertyValue("--subtleText");
  var mainText = style.getPropertyValue("--maintext");
  return (
    <Center>
      <Modal
        isOpen={isStreakOpen}
        onClose={closeModal}

        size="6xl">
        <ModalOverlay/>
        <ModalContent bgColor={bgcolor} minHeight={"400px"}>
          <ModalHeader>
            <HStack alignItems={'flex-start'} justifyContent={'space-between'}>
              <Box>
                <Text fontSize={'32px'} color={mainText} className={'mainFont'}>
                  streak leaderboard
                </Text>
                <Text fontSize={'24px'} color={subtleText} fontWeight={500} className={'underline mainFont'}
                      as={'a'} href={`/solutions/Java/${dailySolutions[dailyNum]}`}
                >
                  {javaCode[dailySolutions[dailyNum] - 1][0].id}
                </Text>

              </Box>
              <Box textAlign={'right'}>
                <HStack alignSelf={'flex-end'}>

                  <Box pt={1} color={logoC} fontSize={'28px'}>
                    <ion-icon name="flame"></ion-icon>
                  </Box>
                  <Text fontSize={'24px'} fontWeight={600} color={mainText} className={'mainFont'}>
                    {highestRecord}
                  </Text>
                </HStack>

                <Text fontSize={'16px'} color={subtleText} fontWeight={500} className={'mainFont'}>
                  record by{" "}
                  <Text as={'a'} href={`/profile/${recordHolder}`} fontSize={'20px'} fontWeight={500}
                        color={subtleText}
                        className={'mainFont underline'}>
                    {recordHolder}
                  </Text>
                </Text>
              </Box>
            </HStack>
          </ModalHeader>

          <ModalBody>
            <Box>
              {loading ? (
                <Box>
                  <Text color={mainText} className="mainFont mainTextClass whiteText" fontSize="24px">
                    loading...
                  </Text>
                </Box>
              ) : (
                <Center>

                  <HStack alignItems={'flex-end'}>
                    <Rank2 name={userList[1]?.displayName ?
                      userList[1]?.displayName : ""
                    } streak={userList[1]?.streak ?
                      userList[1]?.streak : 0
                    } dailyNum={dailyNum}
                           last_daily={userList[1]?.last_daily}/>
                    <Rank1 name={userList[0]?.displayName ?
                      userList[0]?.displayName : ""
                    } streak={userList[0]?.streak ?
                      userList[0]?.streak : 0
                    } dailyNum={dailyNum}
                           last_daily={userList[0]?.last_daily}/>

                    <Rank3 name={userList[2]?.displayName ?
                      userList[2]?.displayName : ""
                    } streak={userList[2]?.streak ?
                      userList[2]?.streak : 0
                    } dailyNum={dailyNum}
                           last_daily={userList[2]?.last_daily}/>

                  </HStack>
                </Center>
              )}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Text fontSize={'16px'} color={subtleText} className={'mainFont'}>
              *daily solution updated at 12:00AM GMT
            </Text>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
  );

  function closeModal() {
    onStreakClose();
  }
}
