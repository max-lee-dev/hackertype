import React, { useEffect, useState } from "react";
import { db } from "./components/firebase";
import { orderBy, where, query, collection, getDocs } from "@firebase/firestore";
import { Center, Stack, Text, Box, Button } from "@chakra-ui/react";
import WpmLineChart from "./components/WpmLineChart";
export default function Leaderboard() {
  const [loading, setLoading] = useState(true);
  const [top, setTop] = useState([]);
  const [language, setLanguage] = useState("Java");
  useEffect(() => {
    setLoading(true);
    console.log("huh");
    async function getSubmissions() {
      const tempTopArray = [];
      if (language === "Java") {
        const solutionsCollectionRef = collection(db, "javaSolutions");
        const top = query(solutionsCollectionRef, orderBy("solutionNum", "asc"));
        const topQuerySnapshot = await getDocs(top);
        topQuerySnapshot.forEach((doc) => {
          tempTopArray.push(doc.data());
        });
      } else if (language === "C++") {
        const solutionsCollectionRef = collection(db, "cppSolutions");
        const top = query(solutionsCollectionRef, orderBy("solutionNum", "asc"));
        const topQuerySnapshot = await getDocs(top);
        topQuerySnapshot.forEach((doc) => {
          tempTopArray.push(doc.data());
        });
      } else if (language === "Python") {
        const solutionsCollectionRef = collection(db, "pythonSolutions");
        const top = query(solutionsCollectionRef, orderBy("solutionNum", "asc"));
        const topQuerySnapshot = await getDocs(top);
        topQuerySnapshot.forEach((doc) => {
          tempTopArray.push(doc.data());
        });
      }

      setTop(tempTopArray);
    }
    getSubmissions().then(() => setLoading(false));
  }, [language]);

  return (
    <Center>
      <Box className="profileContainer">
        <Box className="userTitle mainFont font500">
          <Box>
            <Box width="100%" paddingTop="80px" className="whiteText">
              <Text fontSize="56px">leaderboard</Text>

              <Text fontSize="22px" className="grayText font400">
                adding search bar soon
              </Text>
            </Box>
            <Box width="100%" paddingTop="8px" className="font400 standardButton whiteText">
              <Button onClick={() => setLanguage("C++")}>
                <Text fontSize="22px" className={language === "C++" ? "whiteText" : ""}>
                  C++
                </Text>
              </Button>
              <Button onClick={() => setLanguage("Java")}>
                <Text fontSize="22px" className={language === "Java" ? "whiteText" : ""}>
                  Java
                </Text>
              </Button>
              <Button onClick={() => setLanguage("Python")}>
                <Text fontSize="22px" className={language === "Python" ? "whiteText" : ""}>
                  Python
                </Text>
              </Button>
            </Box>

            <Box paddingLeft="50px" paddingTop="30px">
              {loading && <Text className="whiteText">loading...</Text>}
              <Stack direction="column">
                {top.map((solution) => (
                  <Box>
                    <Text fontSize="25px" className="grayText font400">
                      {solution.solution_id}
                    </Text>
                    <Text fontSize="22px" className="grayText font400">
                      {solution.wr_user}

                      {solution.wr_wpm}
                    </Text>
                    {!loading && solution.wr_graph && <WpmLineChart givenData={solution.wr_graph} />}
                  </Box>
                ))}
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>
    </Center>
  );
}
