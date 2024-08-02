import React, {useEffect, useState} from "react";
import {NavLink} from "react-router-dom";
import {Box, Text, Center, HStack} from "@chakra-ui/react";
import dailySolutions from "./codefiles/dailySolutions";
import {doc, updateDoc, onSnapshot} from "firebase/firestore";
import javaCode from "./codefiles/javaCode.json";
import {auth, db} from "./firebase";


export default function DailyButton({config, user}) {
  const ogDay = 1703662239000 - 27039000;
  const today = Date.parse(new Date());
  const dailyNum = Math.floor((today - ogDay) / (1000 * 60 * 60 * 24));
  const [streak, setStreak] = useState(0);


  useEffect(() => {


    async function checkDaily() {
      let streakArr = user.streakArr ? user.streakArr.slice() : [];
      let userLastDaily = streakArr[streakArr.length - 1]?.dailyNum || 1;

      userLastDaily++;
      while (dailyNum > userLastDaily) {

        streakArr.push({
          dailyNum: userLastDaily,
          streak: 0
        })
        userLastDaily++
      }
      if (dailyNum - user?.last_daily > 1) {
        // if they missed a day

        // FILL IN THE MISSING STREAKS

        const lastAccountedStreak = user.streakArr[user.streakArr.length - 1]?.dailyNum || 0;

        const shouldBeStreak = streakArr[streakArr.length - 1]?.dailyNum || 1;
        if (shouldBeStreak !== lastAccountedStreak) {

          await updateDoc(doc(db, "users", user.uid), {
            streak: 0,
            streakArr: streakArr,
          });
        }
        setStreak(0)
      } else {
        // if their last streak is today
        setStreak(user.streak)
        const stillHasToday = dailyNum - user?.last_daily === 1;
        const needsUpdate = !stillHasToday && (!user.streakArr || user.streakArr[user.streakArr.length - 1].dailyNum !== dailyNum || user.streakArr[user.streakArr.length - 1].streak === user.streak[user.streakArr.length - 2].streak);
        if (needsUpdate) { // if we already inputted the streak for today
          let streakArr = user.streakArr ? user.streakArr : [];

          const today = {
            dailyNum: dailyNum,
            streak: user.streak,
          }

          await updateDoc(doc(db, "users", user.uid), {
            streakArr: [...streakArr, today],
          })
        }

      }

    }

    if (user) checkDaily()


  }, [user])

  return (

    <Box fontSize={'24px'} as='a'
         href={user?.displayName ? `/solutions/Java/${dailySolutions[dailyNum]}` : "/login"}>
      {parseInt(user?.last_daily) === dailyNum ? (

        <Box paddingBottom={0} color={config["logoColor"]}>
          <HStack spacing={0}>
            <ion-icon name="flame"></ion-icon>
            <Text fontSize={'20px'}>
              {user?.streak ? user.streak : 0}
            </Text>
          </HStack>
        </Box>
      ) : (
        <Box paddingBottom={0} color={config["subtleText"]}>
          <HStack spacing={0}>
            <ion-icon name="flame-outline"></ion-icon>
            <Text fontSize={'20px'}>
              {user?.streak ? user.streak : 0}
            </Text>
          </HStack>
        </Box>

      )}


    </Box>

  );

}