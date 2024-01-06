import React from "react";

import {signOut, getAuth} from "firebase/auth";
import {Button, Center, Stack, SimpleGrid, VStack, Divider, Text, Box, HStack, Tooltip} from "@chakra-ui/react";

import LineChart from "./LineChart";

import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {collection, getDocs, query, where, orderBy, limit} from "firebase/firestore";
import {db} from "./firebase"; // import your Firebase app instance
import Submission from "./Submission";
import DailySolutionChart from "./DailySolutionChart";
import Section from "./Section";

export default function Profile({config}) {
    async function signout() {
        await signOut(auth);
        window.location.replace("/");
    }

    const [profileUserData, setUserData] = useState(null);
    const auth = getAuth();
    const {username} = useParams();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({});
    const [recentSubmissions, setRecentSubmissions] = useState([]);
    const [bestSubmissions, setBestSubmissions] = useState([]);
    const [numberWorldRecords, setNumberWorldRecords] = useState(0);

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
        //eslint-disable-next-line
    }, [loading]);

    useEffect(() => {
        setLoading(true);

        async function getUserSettings() {
            const q = query(collection(db, "users"));

            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots

                if (doc.data().displayName === username) setUserData(doc.data());
            });
        }

        async function getRecentSubmissions() {
            const q = query(submissionsCollectionRef, where("user", "==", username));
            const top = query(q, orderBy("when", "desc"), limit(5));
            const recentQuerySnapshot = await getDocs(top);
            const tempArray = [];
            recentQuerySnapshot.forEach((doc) => {
                tempArray.push(doc.id);
            });
            setRecentSubmissions(tempArray);
        }

        async function getBestSubmissions() {
            const q = query(submissionsCollectionRef, where("user", "==", username));
            const best = query(q, where("isBestSubmission", "==", true));
            const top = query(best, orderBy("rank", "asc"), limit(5));
            const topr = query(top, orderBy("when", "desc"));

            const bestQuerySnapshot = await getDocs(topr);
            const tempArray = [];

            bestQuerySnapshot.forEach((doc) => {
                tempArray.push(doc.id);
            });
            setBestSubmissions(tempArray);
        }

        async function getNumberWorldRecords() {
            const q = query(submissionsCollectionRef, where("user", "==", username));
            const top = query(q, where("rank", "==", 1));
            const isBest = query(top, where("isBestSubmission", "==", true));
            const bestQuerySnapshot = await getDocs(isBest);
            const size = bestQuerySnapshot.size;
            setNumberWorldRecords(size);
        }

        getNumberWorldRecords();
        getUserSettings();
        getBestSubmissions();
        getRecentSubmissions().then(() => setLoading(false));
        console.log("ho");
    }, [username]);

    const submissionsCollectionRef = collection(db, "submissions");
    var dateArr = profileUserData?.account_created.split(" ");
    var dateString = "";

    // pre update fix
    if (profileUserData && dateArr.length === 3) {
        // american
        dateString = dateArr[0].substring(0, dateArr[0].length - 1);
    } else if (profileUserData && !dateArr[2]) {
        dateString = dateArr[1];
        // vietnamese
    } else if (profileUserData) {
        dateString = dateArr[2] + " " + dateArr[1] + ", " + dateArr[3];
    }

    return (
        <Section delay={0.1}>

            <Center>

                <VStack width={['90%', '90%', '90%', '70%']} paddingTop="30px" spacing={[5, 5, 5, 10]}>
                    <Box className="userTitleContainer">
                        <Section delay={0.1}>
                            <Box display={'flex'} flexDir={['column', 'column', 'column', 'row']}

                                 justifyContent={'space-between'} mt={30}
                                 color={config["mainText"]}>
                                <Box mt={5} className="mainFont font500" width={['100%', '100%', '100%', '50%']}>
                                    <HStack spacing="-1">
                                        {!loading && !profileUserData &&
                                            <Text fontSize="56px">User not found...</Text>}
                                        <Text fontSize="2em">{profileUserData?.displayName}</Text>
                                        {!loading && username === user?.displayName && (
                                            <Tooltip label="Sign out" aria-label="A tooltip">
                                                <Button
                                                    color={config["logoColor"]}
                                                    _hover={{bgColor: "transparent", color: config["mainText"]}}
                                                    marginTop="20px"
                                                    fontSize="40px"
                                                    bgColor="transparent"
                                                    onClick={signout}>
                                                    <ion-icon name="log-out-outline"></ion-icon>
                                                </Button>
                                            </Tooltip>
                                        )}
                                    </HStack>
                                    {profileUserData && (
                                        <Text fontSize="22px" color={config["subtleText"]} className=" font400">
                                            joined {dateString}
                                        </Text>
                                    )}
                                    <Box className="signoutButton"></Box>
                                </Box>


                                <Box justifyContent={'space-between'} pt={[0, 0, 0, 5]}
                                     width={['80%', '100%', '100%', '100%']}
                                     className={'mainFont'}
                                     display={'flex'}
                                     flexDir={['row']} flexWrap={'wrap'}>


                                    <Box width={'fit-content'}>
                                        <Text fontSize="26px" className="font400">
                                            {numberWorldRecords ? numberWorldRecords : 0}
                                        </Text>
                                        <Text fontSize="18px" color={config["subtleText"]}
                                              className=" font400">
                                            world records
                                        </Text>
                                    </Box>

                                    <Box width={'fit-content'}>
                                        <Text fontSize="26px" className="font400">
                                            {profileUserData?.average_wpm ? profileUserData?.average_wpm : 0}
                                        </Text>
                                        <Text fontSize="18px" color={config["subtleText"]}
                                              className=" font400">
                                            average WPM
                                        </Text>
                                    </Box>

                                    <Box>
                                        <Text fontSize="26px" className="font400">
                                            {profileUserData?.tests_started ? profileUserData?.tests_started : 0}
                                        </Text>
                                        <Text fontSize="18px" color={config["subtleText"]}
                                              className=" font400">
                                            started
                                        </Text>
                                    </Box>

                                    <Box>
                                        <Text fontSize="26px" className="font400">
                                            {profileUserData?.tests_completed ? profileUserData?.tests_completed : 0}
                                        </Text>
                                        <Text fontSize="18px" color={config["subtleText"]}
                                              className=" font400">
                                            completed
                                        </Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize="26px" className="font400">
                                            <HStack>
                                                <Box fontSize={'20px'} paddingTop={2}>
                                                    <ion-icon icon={'flame'}></ion-icon>
                                                </Box>
                                                <Text>
                                                    {profileUserData?.streak ? profileUserData?.streak : 0}
                                                </Text>
                                            </HStack>
                                        </Text>
                                        <Text fontSize="18px" color={config["subtleText"]}
                                              className=" font400">
                                            streak
                                        </Text>

                                    </Box>

                                </Box>
                            </Box>
                        </Section>
                    </Box>
                    <Box paddingTop="0px">
                        {loading && (
                            <Center>
                                <Box className="loader"></Box>
                            </Center>
                        )}
                    </Box>
                    <Section delay={0.2} width={'100%'}>
                        <Center width={'100%'}>
                            <HStack h={'fit-content'} width={'100%'} mt={[100, 100, 100, 0]}>
                                <Box width={'50%'}>
                                    <Box>
                                        <Center>
                                            <Box style={{
                                                width: 500,

                                            }}>
                                                <LineChart username={username}/>
                                            </Box>
                                        </Center>

                                        <Center>
                                            {!loading && (
                                                <Text
                                                    alignSelf="center"
                                                    paddingLeft="20px"
                                                    color={config["subtleText"]}
                                                    fontSize="15px"
                                                    className="mainFont"
                                                    fontWeight="200">
                                                    submission history
                                                </Text>
                                            )}
                                        </Center>
                                    </Box>
                                </Box>
                                <Box width="100%">
                                    <Box>
                                        <Center>
                                            <Box style={{
                                                width: 500,
                                            }}>
                                                <DailySolutionChart username={username}/>
                                            </Box>
                                        </Center>
                                        <Center>
                                            {!loading && (
                                                <Text
                                                    alignSelf="center"
                                                    paddingLeft="20px"
                                                    color={config["subtleText"]}
                                                    fontSize="15px"
                                                    className="mainFont"
                                                    fontWeight="200">
                                                    daily submissions
                                                </Text>
                                            )}
                                        </Center>
                                    </Box>
                                </Box>
                            </HStack>
                        </Center>
                    </Section>
                    <Section delay={0.4}>
                        <Center>
                            <Box className="mainFont">
                                <Box color={config["mainText"]}>
                                    <Box width="100%" marginLeft={"0px"}>
                                        <Box>
                                            <Stack direction="row" spacing="2">
                                                <Box className="font500" width="100%" marginLeft={"10px"}>
                                                    {!loading && (
                                                        <Text fontSize="28px" fontWeight={"300"}
                                                              paddingLeft={"22px"}>
                                                            recent
                                                        </Text>
                                                    )}

                                                    {!loading &&
                                                        recentSubmissions.map((submission) => (
                                                            <Submission uid={submission} config={config}/>
                                                        ))}

                                                    {!loading && !recentSubmissions[0] && (
                                                        <Text fontSize="22px" color={config["subtleText"]}
                                                              className=" font400">
                                                            no recent submissions
                                                        </Text>
                                                    )}
                                                </Box>

                                                <Divider
                                                    orientation="vertical"
                                                    border={"1px solid"}
                                                    borderColor="transparent"
                                                    variant="none"
                                                />
                                                <Box className="bestSubmissionsContainer mainFont font500">
                                                    {!loading && (
                                                        <Text fontSize="28px" fontWeight="300" paddingLeft={"22px"}>
                                                            best
                                                        </Text>
                                                    )}

                                                    {!loading && bestSubmissions.map((submission) => <Submission
                                                        uid={submission}/>)}

                                                    {!loading && !bestSubmissions[0] && (
                                                        <Text fontSize="22px" color={config["subtleText"]}
                                                              className=" font400">
                                                            no recent submissions
                                                        </Text>
                                                    )}
                                                </Box>
                                            </Stack>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Center>
                    </Section>

                    {/* {!loading && profileUserData && <Box className = 'about'>
                                        <h1>WPM: {profileUserData?.wpm}</h1>
                                        <h1>Accuracy: {profileUserData?.accuracy}</h1>
                                        <h1>Last Language: {profileUserData?.lastLanguage}</h1>
                                        <br/>
                                </Box>}


                                <Box>
                                        {!loading && profileUserData && <Box className = 'smallerMainFont site-title correct'>Recent Submissions</Box>}
                                        {submissions.map(submission => {
                                                if (submission.user === profileUserData?.displayName) {
                                                        return (
                                                                <Box key={submission.id}>
                                                                        <br/>
                                                                        <h1>{submission.user}</h1>
                                                                        <h1>{submission.solution_id}</h1>
                                                                        <h1>WPM: {submission.wpm}</h1>
                                                                </Box>
                                                        )
                                                }
                                                return ''
                                        })}



                                </Box> */}
                </VStack>
            </Center>
        </Section>
    );
}
