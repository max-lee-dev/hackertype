import React, {useEffect, useState} from "react";
import dailySolutions from "./components/codefiles/dailySolutions.json";
import {db} from "./components/firebase";
import {orderBy, where, limit, query, collection, getDocs} from "@firebase/firestore";
import {
    Center,
    Stack,
    SimpleGrid,
    VStack,
    Text,
    Box,
    Button,
    HStack,
    Input,
    Tooltip,
    Divider,
    useDisclosure
} from "@chakra-ui/react";
import {SearchIcon} from "@chakra-ui/icons";
import LeaderboardModal from "./components/LeaderboardModal";
import {formatDate} from "./components/LeaderboardModal";
import Submission from "./components/Submission";
import Section from "./components/Section";

import WpmLineChart from "./components/WpmLineChart";

export default function Leaderboard({config}) {
    const [loading, setLoading] = useState(true);
    const [top, setTop] = useState([]);
    const [curSubmissions, setCurSubmissions] = useState([{}]);
    const [actualTop, setActualTop] = useState([]);
    const [language, setLanguage] = useState("Java");
    const [userInput, setUserInput] = useState("");
    const [selectedCode, setSelectedCode] = useState("");
    const [showGraph, setShowGraph] = useState(false);
    const [selectedGraphCode, setSelectedGraphCode] = useState("");
    const [whichSubmission, setWhichSubmission] = useState("recent");
    const {
        isOpen: isLeaderboardOpen,
        onClose: onLeaderboardClose,
        onOpen: onLeaderboardOpen,
    } = useDisclosure();
    const ogDay = 1703662239000 - 27039000;
    const today = Date.parse(new Date());
    const dailyNum = Math.floor((today - ogDay) / (1000 * 60 * 60 * 24));

    useEffect(() => {
        setLoading(true);
        console.log("huh");

        async function getSubmissions() {
            const q = query(collection(db, "submissions"), limit(20), orderBy("when", "desc"));
            const querySnapshot = await getDocs(q);
            const submissions = [];
            querySnapshot.forEach((doc) => {
                submissions.push(doc.data());
            });

            let actualTop = [];
            const q2 = query(collection(db, "submissions"), where("rank", "==", 1), limit(20), orderBy("when", "desc"));
            const querySnapshot2 = await getDocs(q2);
            querySnapshot2.forEach((doc) => {
                actualTop.push(doc.data());
            });
            setActualTop(actualTop);

            setTop(submissions);
            setLoading(false);
            setCurSubmissions(submissions)
        }

        getSubmissions();
    }, []);

    useEffect(() => {
        setCurSubmissions(whichSubmission === "recent" ? top : actualTop)

    }, [whichSubmission])

    function showLeaderboardModal(id, lang) {
        setLanguage(lang)

        setSelectedGraphCode(id);
        onLeaderboardOpen();
    }

    return (
        <Section delay={0.3}>
            <Center>
                <Box className="profileContainer">
                    <Box className="userTitle mainFont font500">
                        <Box>

                            <Box width={['100%', '80%', "100%"]} paddingTop="80px" color={config["mainText"]}>
                                <HStack>
                                    <Text fontSize={["40px", "40px", "56px"]}>submissions</Text>


                                </HStack>
                            </Box>
                            <Box width={['100%', '80%', "100%"]} paddingTop="20px" color={config["mainText"]}>
                                <HStack>
                                    <Button onClick={() => setWhichSubmission("recent")}
                                            className="standardButton">
                                        <Text
                                            _hover={{
                                                color: config["mainText"],
                                                fontSize: "24px",
                                            }}
                                            color={whichSubmission === "recent" ? config["mainText"] : config["subtleText"]}
                                            fontSize={["20px", "20px", "24px"]}>recent</Text>
                                    </Button>
                                    <Button onClick={() => setWhichSubmission("top")} className="standardButton">
                                        <Text
                                            _hover={{
                                                color: config["mainText"],
                                                fontSize: "24px",
                                            }}
                                            color={whichSubmission === "top" ? config["mainText"] : config["subtleText"]}
                                            fontSize={["20px", "20px", "24px"]}>world-records</Text>
                                    </Button>

                                </HStack>
                            </Box>

                            <Box>
                                <Box paddingTop={'50px'}>
                                    {loading && <Box className="loader"></Box>}
                                </Box>
                                <Section delay={0.5} maxWidth={'100%'}>
                                    <Box width={'100%'}>

                                        <SimpleGrid columns={[1, 1, 1, 2]} spacing={10} width={'100%'}>
                                            {!loading &&
                                                curSubmissions.map((solution) => (
                                                    <Box key={solution.id} width={'100%'}>

                                                        <Box
                                                            width={'100%'}

                                                            minH={'200px'}
                                                            display={'flex'}

                                                            className="standardButton grayText font300"

                                                            bgColor="">


                                                            <VStack spacing={5} width={'100%'}>
                                                                <Text
                                                                    paddingLeft={'14px'}
                                                                    alignSelf={'flex-start'}
                                                                    as={'a'}
                                                                    href={`/profile/${solution.user}`}
                                                                    _hover={{
                                                                        color: config["logoColor"],


                                                                    }}
                                                                    fontWeight={600}

                                                                    width={"fit-content"}
                                                                    display={'flex'}
                                                                    textAlign={'left'}
                                                                    fontSize="24px"
                                                                    color={config["mainText"]}>
                                                                    <Text>{solution.user}</Text>

                                                                </Text>
                                                                <Divider borderColor={'transparent'}/>
                                                                <Box width={'100%'}>

                                                                    <Button

                                                                        width={'100%'}
                                                                        fontWeight={500}

                                                                        onClick={() => showLeaderboardModal(solution.solution_id, solution.language)}>
                                                                        <Box width={'100%'}>

                                                                            <VStack width={'100%'}
                                                                                    display={'flex'}
                                                                                    justifyContent={'flex-start'}
                                                                                    alignItems={'flex-start'}

                                                                            >

                                                                                <HStack
                                                                                    width={'100%'}
                                                                                >
                                                                                    {parseInt(solution.solution_id.split(".")[0]) === dailySolutions[dailyNum] && (
                                                                                        <Tooltip
                                                                                            label={"daily solution"}>
                                                                                            <Box
                                                                                                color={config["logoColor"]}
                                                                                                paddingRight={'5px'}
                                                                                                fontSize='24px'>

                                                                                                <ion-icon
                                                                                                    name="flame"></ion-icon>
                                                                                            </Box>
                                                                                        </Tooltip>
                                                                                    )}


                                                                                    <Box maxWidth={'80%'}


                                                                                    >
                                                                                        <Text

                                                                                            width={'100%'}
                                                                                            overflow={"hidden"}
                                                                                            textOverflow={'ellipsis'}
                                                                                            display={'inline-block'}

                                                                                            textAlign={'left'}
                                                                                            fontSize="20px">
                                                                                            {solution.solution_id}
                                                                                        </Text>
                                                                                    </Box>
                                                                                    <Text
                                                                                        width={'100%'}
                                                                                        fontWeight={400}
                                                                                        display={'flex'}
                                                                                        textAlign={'left'}
                                                                                        fontSize="18px"
                                                                                        color={selectedCode === solution.solution_id ? config["mainText"] : ""}>
                                                                                        ({solution.language})
                                                                                    </Text>

                                                                                </HStack>


                                                                                <Text width={'100%'} textAlign={"left"}
                                                                                      fontSize="20px"
                                                                                      color={selectedCode === solution.solution_id ? config["mainText"] : ""}>
                                                                                    <HStack>
                                                                                        <Text>{solution.wpm} WPM</Text>
                                                                                        <Text
                                                                                            color={solution.rank === 1 ? config["logoColor"] : config["subtleText"]}>[#{solution.rank}]</Text>

                                                                                    </HStack>

                                                                                </Text>


                                                                                <Text width={'100%'} textAlign={"left"}
                                                                                      fontSize="20px"
                                                                                      color={selectedCode === solution.solution_id ? config["mainText"] : ""}>
                                                                                    {formatDate(solution.when)}
                                                                                </Text>

                                                                            </VStack>
                                                                        </Box>
                                                                    </Button>
                                                                </Box>
                                                            </VStack>


                                                        </Box>
                                                    </Box>


                                                ))}

                                        </SimpleGrid>
                                    </Box>


                                </Section>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <LeaderboardModal
                    isLeaderboardOpen={isLeaderboardOpen}
                    onLeaderboardClose={onLeaderboardClose}
                    givenSolName={selectedGraphCode}
                    selectedLanguage={language}
                />
            </Center>
        </Section>
    );
}
