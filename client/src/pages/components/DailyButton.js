import React, {useEffect, useState} from "react";
import {NavLink} from "react-router-dom";
import {Box, Text, Center, HStack} from "@chakra-ui/react";
import dailySolutions from "./codefiles/dailySolutions";
import {doc, updateDoc, onSnapshot} from "firebase/firestore";
import {db} from "./firebase";


export default function DailyButton({config, user}) {
    const ogDay = 1703662239000 - 27039000;
    const today = Date.parse(new Date());
    const dailyNum = Math.floor((today - ogDay) / (1000 * 60 * 60 * 24));
    const [streak, setStreak] = useState(0);


    useEffect(() => {

        console.log("daily: " + user.last_daily)

        async function checkDaily() {
            if (dailyNum - user.last_daily > 1) {
                // if they missed a day
                await updateDoc(doc(db, "users", user.uid), {
                    streak: 0,
                });
                setStreak(0)

            } else {
                setStreak(user.streak)
            }

        }

        if (user) checkDaily()


    }, [user])

    return (

        <Box fontSize={'24px'} as='a'
             href={user?.displayName ? `/solutions/Java/${dailySolutions[dailyNum]}` : "/login"}>
            {user.last_daily === dailyNum ? (

                <Box paddingBottom={0} color={config["logoColor"]}>
                    <HStack spacing={0}>
                        <ion-icon name="flame"></ion-icon>
                        <Text fontSize={'20px'}>
                            {user.streak ? streak : 0}
                        </Text>
                    </HStack>
                </Box>
            ) : (
                <Box paddingBottom={0} color={config["subtleText"]}>
                    <HStack spacing={0}>
                        <ion-icon name="flame-outline"></ion-icon>
                        <Text fontSize={'20px'}>
                            {user.streak ? streak : 0}
                        </Text>
                    </HStack>
                </Box>

            )}


        </Box>

    );

}