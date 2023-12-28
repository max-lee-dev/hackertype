import React from "react";
import {NavLink} from "react-router-dom";
import {Box, Text, Center, HStack} from "@chakra-ui/react";
import dailySolutions from "./codefiles/dailySolutions";


export default function DailyButton({config, user}) {
    const ogDay = 1703662239000 - 27039000;
    const today = Date.parse(new Date());
    const dailyNum = Math.floor((today - ogDay) / (1000 * 60 * 60 * 24));


    return (

        <Box fontSize={'24px'} as='a'
             href={user?.displayName ? `/solutions/Java/${dailySolutions[dailyNum]}` : "/login"}>
            {user.last_daily === dailyNum ? (

                <Box paddingBottom={0} color={config["logoColor"]}>
                    <HStack spacing={0}>
                        <ion-icon name="flame"></ion-icon>
                        <Text fontSize={'20px'}>
                            {user.streak ? user.streak : 0}
                        </Text>
                    </HStack>
                </Box>
            ) : (
                <Box paddingBottom={0} color={config["subtleText"]}>
                    <HStack spacing={0}>
                        <ion-icon name="flame-outline"></ion-icon>
                        <Text fontSize={'20px'}>
                            {user.streak ? user.streak : 0}
                        </Text>
                    </HStack>
                </Box>

            )}


        </Box>

    );

}