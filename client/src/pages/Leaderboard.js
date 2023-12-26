import React, {useEffect, useState} from "react";
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
    useEffect(() => {
        setLoading(true);
        console.log("huh");

        async function getSubmissions() {
            const q = query(collection(db, "submissions"), limit(20), orderBy("date", "desc"));
            const querySnapshot = await getDocs(q);
            const submissions = [];
            querySnapshot.forEach((doc) => {
                submissions.push(doc.data());
            });

            let actualTop = [];
            const q2 = query(collection(db, "submissions"), where("rank", "==", 1), limit(20), orderBy("date", "desc"));
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

                                        <SimpleGrid columns={[2]} spacing={10} width={'100%'}>
                                            {!loading &&
                                                curSubmissions.map((solution) => (
                                                    <Box key={solution.id}>
                                                        {solution.user !== "joemama234" && solution.user !== "starin" && (

                                                            <Box
                                                                width={'100%'}


                                                                minH={'200px'}
                                                                display={'flex'}

                                                                className="standardButton grayText font300"

                                                                bgColor="">


                                                                <VStack spacing={5}>
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
                                                                    <Button
                                                                        fontWeight={500}
                                                                        onClick={() => showLeaderboardModal(solution.solution_id, solution.language)}>

                                                                        <VStack>

                                                                            <HStack className={"soltitle"}>

                                                                                <Text

                                                                                    display={'flex'}

                                                                                    textAlign={'left'}
                                                                                    fontSize="20px">
                                                                                    {solution.solution_id}
                                                                                </Text>
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

                                                                    </Button>

                                                                </VStack>


                                                            </Box>
                                                        )}
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
