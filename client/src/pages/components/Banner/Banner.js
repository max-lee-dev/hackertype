import React from 'react';
import {Box, HStack, Text, Link, Center, Flex} from "@chakra-ui/react";

const Banner = () => {
  const [banner, setBanner] = React.useState(true);

  function parseJSON(str) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return {};
    }
  }


  let config = parseJSON(localStorage.getItem("config"));

  function closeBanner() {
    localStorage.setItem("config", JSON.stringify({
      ...config,
      banner: false,
    }));
    setBanner(false);
  }


  if (config["banner"] === undefined) {
    localStorage.setItem("config", JSON.stringify({
      ...config,
      banner: true,
    }));
  }
  console.log(config["themeInactiveButton"]);


  if (config["banner"] && banner)
    return (
      <Box width={'100%'}>
        <Flex
          bg={config["themeInactiveButton"]}
          fontSize={14}
          mb={0}
          alignItems="center"
          justifyContent="space-between"
        >
          <Box width="20%"/>
          <Center width="60%">
            <HStack spacing={1}>
              <Text color={config["mainText"]}>
                🥹🎉congrats to
              </Text>
              <Box
                onClick={() => {
                  window.location.replace("/profile/halu");
                }}
              >
                <Link
                  fontWeight={600}
                  as={'span'}
                  href="/profile/halu"
                  color={config["logoColor"]}
                >
                  halu
                </Link>
              </Box>
              <Text as={'span'} color={config["mainText"]}>
                for completing
                <Text as={'span'} color={config["logoColor"]} fontWeight={600}>
                  {" "} 1000{" "}
                </Text>
                submissions! 🥹🎉
              </Text>
            </HStack>
          </Center>
          <Box onClick={closeBanner} width="20%" textAlign="right" fontSize={'22px'}>
            <ion-icon name="close-outline"></ion-icon>
          </Box>
        </Flex>
      </Box>
    );
};

export default Banner;
