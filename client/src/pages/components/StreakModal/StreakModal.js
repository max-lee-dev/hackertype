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

import {query, collection, getDocs, orderBy, where, updateDoc, doc} from "firebase/firestore";
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

  useEffect(() => {
    setLoading(true);

    async function getUserList() {
      const tempArr = [];

      const q = query(collection(db, "users"), where("streak", ">", 0), orderBy("streak", "desc"), limit(3));
      // , where("language", "==", selectedLanguage), where("solution_id", "==", givenSolName), orderBy("rank", "asc"), where("isBestSubmission", "==", true))

      const querySnapshot = await getDocs(q);

      // sort both date arrs and temp arr


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
    }

    if (isStreakOpen) {
      getUserList().then(() => setLoading(false));
    }
  }, [isStreakOpen]);


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
            <Text fontSize={'32px'} color={mainText} className={'mainFont'}>
              streak leaderboard
            </Text>
          </ModalHeader>

          <ModalBody>
            <Box>
              {loading ? (
                <Box>
                  <Text className="mainFont mainTextClass whiteText" fontSize="24px">
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

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
  );

  function closeModal() {
    onStreakClose();
  }
}
