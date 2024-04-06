import {
  Box, Center, HStack,
  Text, VStack,
} from "@chakra-ui/react";

export default function Rank1({name, streak, last_daily, dailyNum}) {
  const config = localStorage.getItem("config") ? JSON.parse(localStorage.getItem("config")) : {};
  return (
    <VStack spacing={-5}>
      <Box color={config["logoColor"]} fontSize={'80px'}>
        <ion-icon name="trophy"></ion-icon>
      </Box>
      <Box borderWidth={5} borderRadius={10} width={'300px'} height={'220px'} borderColor={config["subtleText"]}>
        <VStack>
          <Text color={config["mainText"]} as={'a'} href={`/profile/${name}`} fontSize={'32px'}
                className={'mainFont underline'}>
            1. {name}
          </Text>
          <HStack pr={4}>
            {last_daily === dailyNum ? (
              <Box pt={4} color={config["logoColor"]} fontSize={'70px'}>
                <ion-icon name="flame"></ion-icon>
              </Box>
            ) : (
              <Box pt={5} color={config["subtleText"]} fontSize={'70px'}>
                <ion-icon name="flame-outline"></ion-icon>
              </Box>
            )}

            <Text color={config["mainText"]} fontSize={'80px'}
                  className={'mainFont'}>
              {' '}
              {streak}
            </Text>
          </HStack>
        </VStack>
      </Box>
    </VStack>
  );
}