import {useState, useRef, useEffect} from "react";
import React from "react";
import {motion} from "framer-motion";
import Timer from "./components/Timer.js";
import javaCode from "./components/codefiles/javaCode.json";
import pyCode from "./components/codefiles/pyCode.json";
import cppCode from "./components/codefiles/cppCode.json"; // bye bye
import dailySolutions from "./components/codefiles/dailySolutions.json";
import CodeSettings from "./components/CodeSettings.js";
import StoredInput from "./components/StoredInput.js";
import Letter from "./components/Letter.js";
import {useParams} from "react-router-dom";
import {FaCrown} from "react-icons/fa";
import Section from "./components/Section.js";

import {doc, updateDoc, getDocs, collection, query, where} from "firebase/firestore";
import {ref as sRef} from "firebase/storage";
import {db} from "./components/firebase.js";
import {
    Center,
    useDisclosure,
    IconButton,
    Stack,
    Divider,
    Tooltip,
    Text,
    Box,
    Button,
    HStack,
} from "@chakra-ui/react";
import LeaderboardModal from "./components/LeaderboardModal.js";
import {RepeatIcon} from "@chakra-ui/icons";

// figure out how to get new text every reload

// remove comments, when i find a // remopve that ENTIRE line not just thaT word

function countCharCorrect(actualText, userText) {
    let count = 0,
        i = 0;
    if (actualText === userText) {
        // if text is correct, give them the space character as well
        count = 1;
    }
    while (i < actualText.length) {
        if (userText.charAt(i) === actualText.charAt(i)) count++;
        i++;
    }
    return count;
}

function countReturns(text) {
    let count = 0,
        i = 0;
    while (true) {
        const r = text.indexOf("\n", i);
        if (r !== -1) [count, i] = [count + 1, r + 1];
        else return count;
    }
}

function countBrackets(text) {
    let count = 0,
        i = 0;
    while (true) {
        let r = text.indexOf("}", i);
        if (r === -1) r = text.indexOf("]", i);
        if (r === -1) r = text.indexOf(")", i);

        if (r !== -1) [count, i] = [count + 1, r + 1];
        else return count;
    }
}

function countNumberOfLines(funcRawCode, codingLanguage) {
    const codeWords = funcRawCode.split(" ");
    const finalCode = [];
    let isCommenting = false;
    codeWords.map((word, i) => {
        if (word === "//" || word.includes("/**") || (codingLanguage === "Python" && word === "#"))
            isCommenting = true;
        if (word !== "" && !isCommenting && !word.includes("*/") && codeWords[i + 1] === "//")
            finalCode.push(`${word}\n`); // if next one is a comment, add a pseudo return line
        else if (word !== "" && !isCommenting && !word.includes("*/")) finalCode.push(word);
        else if (word.includes("\n")) {
            isCommenting = false;
        }

        return "";
    });
    let lineCount = 0;

    finalCode.map((word) => {
        if (word.includes("\n")) lineCount++;
    });
    return lineCount;
}

function App({userData, user, givenId}) {
    const {isOpen: isWordsOpen, onClose: onWordsClose, onOpen: onWordsOpen} = useDisclosure();
    const {isOpen: isSearchOpen, onClose: onSearchClose, onOpen: onSearchOpen} = useDisclosure();
    const {
        isOpen: isLeaderboardOpen,
        onClose: onLeaderboardClose,
        onOpen: onLeaderboardOpen,
    } = useDisclosure();

    const {givenLanguage, number} = useParams();
    const solutionGenerationLineLimit = useRef(50000);

    const chosenID = useRef(number);

    const givenLineRenderLimit = useRef(5);

    //// CONFIG
    const storedConfig = localStorage.getItem("config");
    const config = JSON.parse(storedConfig);
    const [stateConfig, setStateConfig] = useState(() => getConfigValues());

    // thank you samyok
    function parseJSON(str) {
        try {
            return JSON.parse(str);
        } catch (e) {
            return {};
        }
    }

    function getConfigValues() {
        const config = parseJSON(localStorage.getItem("config"));
        const defaultConfig = {
            fontSize: 30,
            tabSize: 4,
            linesDisplayed: 5,
            showLiveWPM: true,
            showLinesLeft: true,
            language: "Java",
        };
        return {...defaultConfig, ...config};
    }

    function handleChange(event, bool) {
        let {name, value} = event.target;
        console.log(name, value);
        const parseBoolean = (value) => value === "true" || value === true;

        if (bool) value = !parseBoolean(stateConfig[name]);

        setStateConfig((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }

    useEffect(() => {
        localStorage.setItem("config", JSON.stringify(stateConfig));
    }, [stateConfig]);
    //

    const inputElement = useRef(null);

    const [submitted, setSubmitted] = useState(false);
    const [userInput, setUserInput] = useState("");
    const [startCounting, setStartCounting] = useState(false);
    const [correctWordArray, setCorrectWordArray] = useState([]);
    const [activeWordIndex, setActiveWordIndex] = useState(0);
    const [leetcodeTitle, setLeetcodeTitle] = useState("");
    const [renderIndex, setRenderIndex] = useState(-1);
    const [javaRange, setJavaRange] = useState("ALL");
    const [cppRange, setCppRange] = useState("ALL");
    const [pythonRange, setPythonRange] = useState("ALL");
    const [wordLimit, setWordLimit] = useState(solutionGenerationLineLimit.current);
    const [wordBank, setNewWordBank] = useState([]);
    const [whiteSpace, setWhiteSpace] = useState([]);
    const [language, setLanguage] = useState(config["language"]);
    const [newUser, setNewUser] = useState(true);
    const [lastCode, setLastCode] = useState([]);
    const [wordsLeft, setWordsLeft] = useState(0);
    const [error, setError] = useState("");
    const [controlPress, setControllPress] = useState(false);
    const [solutionWordCount, setSolutionWordCount] = useState(0);
    const [storedInputArray, setStoredInputArray] = useState([]);
    const [lineRenderIndex, setLineRenderIndex] = useState([]);
    const [currentLine, setCurrentLine] = useState(0);
    const [correctCharsArray, setCorrectCharsArray] = useState([]);
    const [preGeneratedLineIndex, setPreGeneratedLineIndex] = useState([]);
    const [thisSolutionPR, setThisSolutionPR] = useState(0);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const submissionsCollectionRef = collection(db, "submissions");
    const [id, setId] = useState(chosenID.current);
    const [amountOfLinesToRender, setAmountOfLinesToRender] = useState(parseInt(config["linesDisplayed"]));
    const [retriveingData, setRetriveingData] = useState(true);
    const [inputSelected, setInputSelected] = useState(false);
    const [findingPR, setFindingPR] = useState(true);
    const [retrySame, setRetrySame] = useState(false);

    const [finished, setFinished] = useState(false);
    const [last_daily, setLastDaily] = useState(undefined);

    // check if user missed the daily
    const ogDay = 1703662239000;
    const today = Date.parse(new Date());
    const dailyNum = Math.floor((today - ogDay) / (1000 * 60 * 60 * 24));

    useEffect(() => {

        console.log("daily: " + last_daily)

        async function checkDaily() {
            if (dailyNum - last_daily > 1) {
                // if they missed a day
                await updateDoc(doc(db, "users", user.uid), {
                    streak: 0,
                });

            }
        }

        if (user) checkDaily();


    }, [user])


    useEffect(() => {
        if (!retriveingData) {
            if (user) {
                setLoading(true);
                Restart(language, wordLimit);
            }
            setLoading(false);
        }
    }, [user, retriveingData]);

    useEffect(() => {
        function handleKeyDown(e) {
            if (e.keyCode === 9) {
                // console.log("testDASKJDALSJDAS")
                e.preventDefault();
                var input = document.getElementById("textInput");

                Restart(language, wordLimit);
                // input.select();
            }
        }

        document.addEventListener("keydown", handleKeyDown);

        // Don't forget to clean up
        return function cleanup() {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [language, retrySame, wordLimit]);

    useEffect(() => {
        document.addEventListener("mousedown", function (e) {
            if (e.target.id === "textInput") {
                setInputSelected(true);
            } else {
                setInputSelected(false);
            }
        });
    }, []);

    useEffect(() => {
        const getSubmissions = async () => {
            const data = await getDocs(submissionsCollectionRef);
            setSubmissions(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
        };
        getSubmissions();

        //eslint-disable-next-line
    }, [finished]);

    useEffect(() => {
        if (user && !finished) {
            submissions.map((submission) => {
                if (submission.user !== user.displayName) return "";
                if (submission.solution_id !== leetcodeTitle) return "";
                if (submission.language !== language) return "";
                if (!submission.isBestSubmission) return "";
                setThisSolutionPR(submission.wpm);
            });
        }
    }, [submissions]);

    // if given a solution id, load the pr

    // RETRIEVE DATA
    useEffect(
        () => {
            setRetriveingData(true);

            async function getUserSettings() {
                const q = query(collection(db, "users"), where("uid", "==", user.uid));
                let givenLineLimit = 0;
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    setLastDaily(doc.data().last_daily);
                    if (number) {
                        chosenID.current = number;
                        setId(number);
                        setRetrySame(true);
                    } else if (doc.data().lastId) {
                        chosenID.current = doc.data().lastId;
                        setId(doc.data().lastId);
                        setRetrySame(true);
                    }

                    if (number && doc.data().lineLimit) {
                        setWordLimit(50000);
                    } else if (doc.data().lineLimit) {
                        solutionGenerationLineLimit.current = doc.data().lineLimit;
                        givenLineLimit = doc.data().lineLimit;
                        setWordLimit(doc.data().lineLimit);
                    }

                    if (!givenLanguage) {
                        setLanguage(config["language"]);
                        Restart(config["language"], givenLineLimit);
                    } else {
                        setLanguage(givenLanguage);
                        Restart(givenLanguage, givenLineLimit);
                    }
                });
            }

            if (user) getUserSettings().then(() => setRetriveingData(false));
            if (!user) {
                if (!givenLanguage) {
                    Restart(config["language"], "");
                } else Restart(givenLanguage, "");
                setRetriveingData(false);
            }
        },
        [user],
        []
    );

    useEffect(() => {
        console.log("wtf");
        handleChange({target: {name: "language", value: language}});
    }, [language]);

    async function changeLastId(id) {
        if (id === undefined) id = "";
        if (user)
            await updateDoc(doc(db, "users", user.uid), {
                lastId: id,
            });
    }

    async function changeLineLimit(limit) {
        if (user)
            await updateDoc(doc(db, "users", user.uid), {
                lineLimit: limit,
            });
    }

    // not used rn

    function Restart(codingLanguage, maxWords, tempRetry) {
        let s = "";
        if (retrySame === false && tempRetry === undefined) {
            // if not retrying same code (typically)

            if (id !== undefined && id !== "") {
                if (!isNaN(id) || id < 1) {
                    s = Reset(codingLanguage, maxWords, id);
                }
            } else {
                s = Reset(codingLanguage, maxWords);
            }

            if (s !== undefined) {
                setError(s);
                return;
            } else setError("");
        }

        //
        if (!newUser && retrySame !== undefined) setWordsLeft(solutionWordCount);
        if (inputElement.current) {
            inputElement.current.focus();
        }
        const lcID = leetcodeTitle.split(".")[0].trim();

        if (retrySame) {
            if (user && !finished) {
                submissions.map((submission) => {
                    if (submission.user !== user.displayName) return "";
                    if (submission.solution_id !== leetcodeTitle) return "";
                    if (submission.language !== language) return "";
                    if (!submission.isBestSubmission) return "";
                    setThisSolutionPR(submission.wpm);
                });
            }
            Reset(codingLanguage, maxWords, lcID);
        }

        setId("");
        setInputSelected(true);
        setSubmitted(false);
        setLanguage(codingLanguage);
        setRenderIndex(-1);
        setNewUser(false);
        setUserInput("");
        setActiveWordIndex(0);
        setStartCounting(false);
        setCorrectWordArray([]);
        setFinished(false);
        setStoredInputArray([]);
        setLineRenderIndex([]);
        setCurrentLine(0);
        setCorrectCharsArray([]);
    }

    function randomCode(codingLanguage, solutionSize, id) {
        let codeLang = javaCode;

        id--;
        if (codingLanguage === "C++")
            codeLang = cppCode; // C++ CRASHING RN PROB CAUSE COMMENTS (theyt end in smth sus)
        else if (codingLanguage === "Java") codeLang = javaCode; // same with java
        else if (codingLanguage === "Python") codeLang = pyCode;

        var selectedCode = "";
        var codeTitle = "";

        if (codeLang[id] === null) {
            setError(`This solution doesn't exist for ${codingLanguage}`);
        }
        // const solutions = collection(db, "pythonSolutions");
        // async function getSolutions() {
        //   for (let i = 0; i < codeLang.length; i++) {
        //     let curID = "";
        //     let solutionNum = 0;
        //     if (codeLang[i]) {
        //       console.log("? : " + codeLang[i]);
        //       codeLang[i].map((codeInfo) => {
        //         curID = codeInfo.id;
        //         return 0;
        //       });
        //       const stringArr = curID.split(".");
        //       solutionNum = parseInt(stringArr[0]);
        //     }

        //     if (curID !== "")
        //       await addDoc(solutions, {
        //         solution_id: curID,
        //         solutionNum: solutionNum,
        //         language: codingLanguage,
        //       });
        //   }
        // }
        // getSolutions();

        while (true) {
            var randInt = Math.floor(Math.random() * codeLang.length);
            var pulledCode = codeLang[randInt]; // contains /**  in java
            pulledCode = codeLang[randInt];

            while (pulledCode === null || (solutionSize !== 1 && pulledCode === lastCode)) {
                randInt = Math.floor(Math.random() * codeLang.length);
                pulledCode = codeLang[randInt];
            }
            if (id !== undefined && !isNaN(id)) {
                if (codeLang[parseInt(id)] === undefined) {
                    setError(`This solution doesn't exist for ${codingLanguage}`);
                }
                pulledCode = codeLang[parseInt(id)];
            }
            // eslint-disable-next-line
            pulledCode.map((codeInfo) => {
                selectedCode = codeInfo.code;
                codeTitle = codeInfo.id;
                return 0;
            });

            let numLines = countNumberOfLines(selectedCode, codingLanguage);
            if (numLines <= wordLimit) break;

            if (id !== undefined && !isNaN(id)) break;
        }
        //
        const inputArr = [];
        setStoredInputArray(inputArr);
        setLeetcodeTitle(codeTitle);
        setLastCode(pulledCode);
        if (!user) return selectedCode;
        if (user) {
            let found = false;
            setFindingPR(true);
            submissions.map((submission) => {
                if (submission.user !== user.displayName) return "";
                if (submission.solution_id !== codeTitle) return "";
                if (submission.language !== codingLanguage) return "";
                if (!submission.isBestSubmission) return "";
                setThisSolutionPR(submission.wpm);
                found = true;
            });
            if (!found && !retrySame) {
                console.log("test");
                setThisSolutionPR(0);
            }
            setFindingPR(false);
        }
        setError("");
        return selectedCode;
    }

    function Reset(codingLanguage, maxWords, id) {
        // solution range
        ////////////////////////// C++
        let codeLang = cppCode;
        let cppSolutions = 0;
        let javaSolutions = 0;
        if (wordLimit !== null && wordLimit !== undefined && wordLimit !== "") {
            maxWords = wordLimit;
        }

        if (maxWords === "" || maxWords === undefined || maxWords === 50000) {
            maxWords = 50000;
            if (wordLimit === null || wordLimit === undefined) {
                setWordLimit(50000);
            }
        } else {
            setWordLimit(maxWords);
        }

        let numSolutions = 0;
        for (let i = 0; i < codeLang.length; i++) {
            let selectedCode = "";

            let pulledCode = codeLang[i];
            if (pulledCode === null) continue;
            pulledCode.map((codeInfo) => {
                selectedCode = codeInfo.code;
                return 0;
            });
            //

            let solutionSize = countNumberOfLines(selectedCode, codeLang);

            if (solutionSize <= maxWords) numSolutions++;
        }
        cppSolutions = numSolutions;
        if (maxWords === "") setCppRange("ALL");
        else setCppRange(numSolutions);
        ////////////////////////// JAVA
        numSolutions = 0;

        codeLang = javaCode;
        for (let i = 0; i < codeLang.length; i++) {
            let selectedCode = "";

            let pulledCode = codeLang[i];
            if (pulledCode === null) continue;
            pulledCode.map((codeInfo) => {
                selectedCode = codeInfo.code;
                return 0;
            });
            //

            let solutionSize = countNumberOfLines(selectedCode, codeLang);

            if (solutionSize <= maxWords) numSolutions++;
        }

        javaSolutions = numSolutions;
        if (maxWords === "") setJavaRange("ALL");
        else setJavaRange(numSolutions);
        numSolutions = 0;
        ////////////////////////// PYTHON
        codeLang = pyCode;
        for (let i = 0; i < codeLang.length; i++) {
            let selectedCode = "";

            let pulledCode = codeLang[i];
            if (pulledCode === null) continue;
            pulledCode.map((codeInfo) => {
                selectedCode = codeInfo.code;
                return 0;
            });
            //
            let solutionSize = countNumberOfLines(selectedCode, codeLang);
            if (solutionSize <= maxWords) numSolutions++;
        }
        if (maxWords === "") setPythonRange("ALL");
        else setPythonRange(numSolutions);

        numSolutions = 0;
        if (codingLanguage === "C++")
            codeLang = cppCode; // C++ CRASHING RN PROB CAUSE COMMENTS (theyt end in smth sus)
        else if (codingLanguage === "Java") codeLang = javaCode; // same with java
        else if (codingLanguage === "Python") codeLang = pyCode;

        for (let i = 0; i < codeLang.length; i++) {
            let selectedCode = "";

            let pulledCode = codeLang[i];
            if (pulledCode === null) continue;
            pulledCode.map((codeInfo) => {
                selectedCode = codeInfo.code;
                return 0;
            });
            //
            let solutionSize = countNumberOfLines(selectedCode, codingLanguage);

            if (solutionSize <= maxWords) numSolutions++;
        }

        if (codingLanguage === "Python" && numSolutions === 0) {
            return `No solutions found for ${codingLanguage} with <= ${maxWords} lines`;
        }
        if (codingLanguage === "Java" && javaSolutions === 0) {
            return `No solutions found for ${codingLanguage} with <= ${maxWords} lines`;
        }
        if (codingLanguage === "C++" && cppSolutions === 0) {
            return `No solutions found for ${codingLanguage} with <= ${maxWords} lines`;
        }
        let funcRawCode = randomCode(codingLanguage, numSolutions, id);
        let funcWordBank = [];
        let funcIndentChars = [];
        let funcWhiteSpace = [];
        // wordbank
        const codeWords = funcRawCode.split(" ");
        const finalCode = [];
        let isCommenting = false;
        codeWords.map((word, i) => {
            if (word === "//" || word.includes("/**") || (codingLanguage === "Python" && word === "#"))
                isCommenting = true;
            if (word !== "" && !isCommenting && !word.includes("*/") && codeWords[i + 1] === "//")
                finalCode.push(`${word}\n`); // if next one is a comment, add a pseudo return line
            else if (word !== "" && !isCommenting && !word.includes("*/")) finalCode.push(word);
            else if (word.includes("\n")) {
                isCommenting = false;
            }

            return "";
        });
        funcWordBank = finalCode;
        setWordsLeft(funcWordBank.length);
        setSolutionWordCount(funcWordBank.length);
        ///////////////

        // indent chars
        const ans = [];
        const characters = funcRawCode.split("");
        let indent = false;

        characters.map((char, i) => {
            if (char === "\n") {
                indent = true;
            } else if (indent && char !== " " && char !== "\n") {
                indent = false;
                ans[i] = 1;
            }
            return "";
        });

        funcIndentChars = ans;
        //////////

        // white space

        const whiteSpaceAns = [];
        const map = {};
        let curLine = 0;
        const preGeneratedLineIndexArray = [];

        funcWordBank.map((word, idx) => {
            if (idx === 0) return (ans[idx] = 0);
            if (!funcWordBank[idx - 1].includes("\n")) return (ans[idx] = 0);

            // hasIndent

            preGeneratedLineIndexArray[curLine++] = idx;

            if (map[word] !== undefined) {
                let times = 0;
                let index = funcRawCode.indexOf(`${word}`, map[word]);
                while (
                    funcIndentChars[index] === undefined ||
                    funcIndentChars[index] === 0 ||
                    funcIndentChars[index] === 2
                    ) {
                    times++;
                    index = funcRawCode.indexOf(`${word}`, index + 1);
                    if (times === 100) break;
                }
                if (times === 100) {
                    Reset(codingLanguage);
                }
                let ogIndex = index;
                index--;

                let space = 0;

                while (funcRawCode.charAt(index) === " ") {
                    space++;
                    index--;
                }

                funcIndentChars[ogIndex] = 2; // done it, some edge cases idk i need this
                map[word] = ogIndex + 1;
                whiteSpaceAns[idx] = space;
                return "";
            } else {
                let index = funcRawCode.indexOf(`${word}`);
                let times = 0;
                while (
                    funcIndentChars[index] === undefined ||
                    funcIndentChars[index] === 0 ||
                    funcIndentChars[index] === 2
                    ) {
                    times++;
                    index = funcRawCode.indexOf(`${word}`, index + 1);
                    if (times === 100) {
                        break;
                    }
                }
                if (times === 100) {
                    Reset(codingLanguage);
                }
                let ogIndex = index;
                index--;
                let space = 0;

                while (funcRawCode.charAt(index) === " ") {
                    space++;
                    index--;
                }

                map[word] = ogIndex + 1;
                funcIndentChars[ogIndex] = 2;
                whiteSpaceAns[idx] = space;
                return "";
            }
        });
        funcWhiteSpace = whiteSpaceAns;

        setPreGeneratedLineIndex(preGeneratedLineIndexArray);
        setNewWordBank(funcWordBank);
        setWhiteSpace(funcWhiteSpace);
    }

    useEffect(() => {
        if (inputElement.current) {
            inputElement.current.focus();
        }
    }, [lastCode]);

    useEffect(() => {
        setWordsLeft((curr) => curr - 1);
    }, [activeWordIndex]);

    function Word(props) {
        // if this doesnt work put it back and try using React.memo

        const {text, active, correct, thisWordIndex} = props;
        const hasReturn = text.includes("\n");
        let numReturns = 0;
        if (hasReturn) {
            for (let i = 0; i < text.length; i++) {
                if (text.charAt(i) === "\n") numReturns++;
            }
        }

        const textArr = text.split("");
        return textArr.map((char, index) => {
            return (

                <Letter
                    key={index}
                    idx={index}
                    char={char}
                    displayWord={text}
                    userInput={userInput}
                    active={active}
                    wordCorrect={correct}
                    hasReturn={hasReturn}
                    activeWordIndex={activeWordIndex}
                    thisWordIndex={thisWordIndex}
                    inputSelected={inputSelected}
                    storedInputArray={storedInputArray}
                    numReturns={numReturns}
                    toggleBrackets={config["toggleBrackets"]}
                />

            );
        });
        // if (correct === true) {
        //         if (active) {
        //                 if (hasReturn) return <span className = 'currentCorrect displayText'>{text} <br/></span>
        //                 return <span className="currentCorrect displayText">{text} </span>
        //         } else {
        //                 if (hasReturn) return <span className="correct displayText">{text} <br/></span>
        //                 return <span className="correct displayText">{text} </span>
        //         }
        // }
        // if (correct === false) {
        //         if (active) {
        //                 if (hasReturn) return <span className="currentIncorrect displayText">{text} <br/></span>
        //                 return <span className ="currentIncorrect displayText">{text} </span>
        //         } else {
        //                 if (hasReturn) return <span className="incorrect displayText">{text} <br/></span>
        //                 return <span className ="incorrect displayText">{text} </span>
        //         }

        // }

        // if (active) {
        //         if (hasReturn) return <span className = "active">{text} <br/></span>
        //         return <span className = "active">{text} </span>
        // }
        // if (hasReturn)return <span className = "displayText">{text}<br/></span>
        // return <span className = "displayText">{text} </span>
    }

    // eslint-disable-next-line
    Word = React.memo(Word);

    function handleKeyDown(e) {
        const closingBrackets = [")", "}", "]"];

        if (e.key === "Backspace" && userInput === "" && activeWordIndex !== 0) {
            if (whiteSpace[activeWordIndex] !== undefined) {
                setRenderIndex(lineRenderIndex[currentLine - 1]);
                setCurrentLine((line) => line - 1);
            }
            setUserInput(storedInputArray[activeWordIndex - 1]);
            setActiveWordIndex((input) => input - 1);
            setCorrectWordArray((data) => {
                const newResult = [...data];
                newResult[activeWordIndex] = null;
                return newResult;
            });
        }

        if (e.key === "Enter" && inputElement.current.type === document.activeElement.type) {
            if (wordBank[activeWordIndex].substring(wordBank[activeWordIndex].length - 1) === "\n") {
                setCorrectWordArray((data) => {
                    const newResult = [...data];
                    // if toggle bracket, dont check for last char
                    if (
                        config["toggleBrackets"] &&
                        (wordBank[activeWordIndex].includes(")") ||
                            wordBank[activeWordIndex].includes("]") ||
                            wordBank[activeWordIndex].includes("}"))
                    ) {
                        if (
                            // if only char is closing brace give them auto correct
                            wordBank[activeWordIndex].substring(
                                0,
                                wordBank[activeWordIndex].length - countReturns(wordBank[activeWordIndex]) - 1
                            ).length === 0
                        ) {
                            newResult[activeWordIndex] = true;
                        }
                        newResult[activeWordIndex] =
                            userInput ===
                            wordBank[activeWordIndex].substring(
                                0,
                                wordBank[activeWordIndex].length -
                                countReturns(wordBank[activeWordIndex]) -
                                countBrackets(wordBank[activeWordIndex])
                            );
                    } else {
                        newResult[activeWordIndex] =
                            userInput ===
                            wordBank[activeWordIndex].substring(
                                0,
                                wordBank[activeWordIndex].length - countReturns(wordBank[activeWordIndex])
                            );
                    }
                    return newResult;
                });

                var StoredInputFunction = StoredInput();
                setStoredInputArray(
                    StoredInputFunction.setCode(
                        storedInputArray,
                        activeWordIndex,
                        e.target.value + e.target.value.charAt(e.target.value.length - 1)
                    )
                ); // WHY DO I NEED THIS LMFAO (deletes last char)

                setRenderIndex(activeWordIndex);
                const arr = [...lineRenderIndex];
                arr[currentLine] = renderIndex;
                setCurrentLine((line) => line + 1);
                setLineRenderIndex(arr);
                setUserInput("");
                setActiveWordIndex((input) => input + 1);
                var oldCharacterCountArray = [...correctCharsArray];
                oldCharacterCountArray[activeWordIndex] = countCharCorrect(
                    wordBank[activeWordIndex],
                    e.target.value.trim()
                );

                setCorrectCharsArray(oldCharacterCountArray);

                if (activeWordIndex === wordBank.length - 1) {
                    setFinished(true);
                    return;
                }
            }
        }
    }

    function processInput(e) {
        setStartCounting(true);
        const value = e.target.value;
        // instant end if last word is correct
        const trimmedLastWord = wordBank[activeWordIndex].replace("\n", "");
        if (activeWordIndex === wordBank.length - 1 && value.trim() === trimmedLastWord) setFinished(true);

        if (
            value.endsWith(" ") &&
            value.length > 1 &&
            wordBank[activeWordIndex].charAt(wordBank[activeWordIndex].length - 1) !== "\n"
        ) {
            setActiveWordIndex((index) => index + 1);
            setUserInput("");

            setCorrectWordArray((data) => {
                const word = value.trim();
                const newResult = [...data];
                if (
                    config["toggleBrackets"] &&
                    (wordBank[activeWordIndex].includes(")") ||
                        wordBank[activeWordIndex].includes("]") ||
                        wordBank[activeWordIndex].includes("}"))
                ) {
                    newResult[activeWordIndex] =
                        userInput ===
                        wordBank[activeWordIndex].substring(
                            0,
                            wordBank[activeWordIndex].length - countBrackets(wordBank[activeWordIndex])
                        );
                } else {
                    newResult[activeWordIndex] = word === wordBank[activeWordIndex];
                }
                return newResult;
            });
            if (wordBank[activeWordIndex].substring(wordBank[activeWordIndex].length - 1) === "\n") {
                setRenderIndex(activeWordIndex);
                const arr = [...lineRenderIndex];
                arr[currentLine] = renderIndex;
                setCurrentLine((line) => line + 1);
                setLineRenderIndex(arr);
            }
            var StoredInputFunction = StoredInput();
            setStoredInputArray(StoredInputFunction.setCode(storedInputArray, activeWordIndex, value));
            var oldCharacterCountArray = [...correctCharsArray];
            oldCharacterCountArray[activeWordIndex] = countCharCorrect(wordBank[activeWordIndex], value.trim());

            setCorrectCharsArray(oldCharacterCountArray);

            if (activeWordIndex === wordBank.length - 1) {
                setFinished(true);
                return;
            }
        } else {
            if (!value.endsWith(" ")) setUserInput(value);

            // live feedback
            setCorrectWordArray((data) => {
                const newResult = [...data];
                newResult[activeWordIndex] = value === wordBank[activeWordIndex].substring(0, value.length);
                return newResult;
            });
        }
    }

    // Rural overpopulation in the deacdes after independence led to soil depletion in many areas
    // Along with this, there was heavy deforestation and overgrazing of the land
    // This led to the loss of topsoil and the degradation of the land
    // The land was no longer able to support the population, and the people were forced to migrate to the cities

    function handleWordLimit(val) {
        if (val === "") setWordLimit(50000);
        else setWordLimit(val);
        changeLineLimit(val);

        // solution range
        ////////////////////////// C++
        let codeLang = cppCode;

        if (val === "" || val === undefined) {
            val = 50000;
            setWordLimit(50000);
        } else setWordLimit(val);

        let numSolutions = 0;
        for (let i = 0; i < codeLang.length; i++) {
            let selectedCode = "";

            let pulledCode = codeLang[i];
            if (pulledCode === null) continue;
            pulledCode.map((codeInfo) => {
                selectedCode = codeInfo.code;
                return 0;
            });
            //
            const solutionArray = selectedCode.split(" ");
            let solutionSize = 0;

            solutionArray.map((word) => {
                if (word.includes("\n")) solutionSize++;
                return "";
            });
            if (solutionSize <= val) numSolutions++;
        }
        if (val === "") setCppRange("ALL");
        else setCppRange(numSolutions);
        ////////////////////////// JAVA
        numSolutions = 0;

        codeLang = javaCode;
        for (let i = 0; i < codeLang.length; i++) {
            let selectedCode = "";

            let pulledCode = codeLang[i];
            if (pulledCode === null) continue;
            pulledCode.map((codeInfo) => {
                selectedCode = codeInfo.code;
                return 0;
            });
            //
            const solutionArray = selectedCode.split(" ");
            let solutionSize = 0;

            solutionArray.map((word) => {
                if (word.includes("\n")) solutionSize++;
                return "";
            });
            if (solutionSize <= val) numSolutions++;
        }
        if (val === "") setJavaRange("ALL");
        else setJavaRange(numSolutions);
        ////////////////////////// PYTHON
        codeLang = pyCode;
        numSolutions = 0;
        for (let i = 0; i < codeLang.length; i++) {
            let selectedCode = "";

            let pulledCode = codeLang[i];
            if (pulledCode === null) continue;
            pulledCode.map((codeInfo) => {
                selectedCode = codeInfo.code;
                return 0;
            });
            //
            const solutionArray = selectedCode.split(" ");
            let solutionSize = 0;

            solutionArray.map((word) => {
                if (word.charAt(word.length - 1) === "\n") solutionSize++;
                return "";
            });
            if (solutionSize <= val) numSolutions++;
        }
        if (val === "") setPythonRange("ALL");
        else setPythonRange(numSolutions);
    }

    let renderLimit =
        preGeneratedLineIndex[currentLine + amountOfLinesToRender - 1] === undefined
            ? 1000000
            : preGeneratedLineIndex[currentLine + amountOfLinesToRender - 1];

    return (
        <Box>
            {loading && (
                <Box paddingTop="100px">
                    <Center>
                        <Box className="loader"></Box>
                    </Center>
                </Box>
            )}

            {!loading && (
                <Section delay={0.15}>
                    <Box className="body" bgColor={config["themeBackground"]}>
                        <Box className="container">
                            <Center>
                                <Box className="content">
                                    <Center>
                                        <Box width="100%">
                                            {!loading && (
                                                <CodeSettings
                                                    startCounting={startCounting}
                                                    id={id}
                                                    language={language}
                                                    setLanguage={setLanguage}
                                                    isSearchOpen={isSearchOpen}
                                                    onSearchOpen={onSearchOpen}
                                                    onSearchClose={onSearchClose}
                                                    isWordsOpen={isWordsOpen}
                                                    onWordsOpen={onWordsOpen}
                                                    onWordsClose={onWordsClose}
                                                    wordLimit={wordLimit}
                                                    handleWordLimit={handleWordLimit}
                                                    Restart={Restart}
                                                    cppRange={cppRange}
                                                    javaRange={javaRange}
                                                    pythonRange={pythonRange}
                                                    setId={setId}
                                                    changeLastId={changeLastId}
                                                    leetcodeTitle={leetcodeTitle}
                                                    retrySame={retrySame}
                                                    setRetrySame={setRetrySame}
                                                    config={config}
                                                />
                                            )}
                                        </Box>
                                    </Center>
                                    {/* {retrySame && (
                    <Box className="retrySame">
                      <Center>
                        <Box className="retrySameContainer">
                          <Text className="mainFont font500">Retry Same Problem?</Text>
                        </Box>
                      </Center>
                    </Box>
                  )}
                  {!retrySame && (
                    <Box className="retrySame">
                      <Center>
                        <Box className="retrySameContainer">
                          <Text className="mainFont font500">Retry Same NO?</Text>
                        </Box>
                      </Center>
                    </Box>
                  )} */}

                                    <Box className="inputContainer">
                                        <Box className="leetcodeTitle" paddingTop="0px">
                                            {!startCounting && !loading && (
                                                <Box className="mainFont">
                                                    <Center>
                                                        <Stack direction={['column', 'row', 'row']} spacing="0">
                                                            {parseInt(leetcodeTitle.split(".")[0]) === dailySolutions[dailyNum] && (
                                                                <Box>
                                                                    <Tooltip label="daily solution">
                                                                        <Box color={config["logoColor"]}
                                                                             paddingTop={"10px"}
                                                                             paddingRight={3}
                                                                             fontSize={'24px'}>

                                                                            <ion-icon name="flame"></ion-icon>
                                                                        </Box>
                                                                    </Tooltip>
                                                                </Box>
                                                            )}

                                                            <Text paddingTop={"6px"} fontSize="24px"
                                                                  color={config["mainText"]}
                                                                  className="mainFont font500">
                                                                {leetcodeTitle}
                                                            </Text>
                                                            <Box>
                                                                <Tooltip label="View leaderboard">
                                                                    <Box>
                                                                        <Button
                                                                            fontSize="24px"
                                                                            backgroundColor="transparent"
                                                                            _active={{backgroundColor: "transparent"}}
                                                                            _hover={{color: config["mainText"]}}
                                                                            color={config["subtleText"]}
                                                                            width="50px"
                                                                            onClick={() => onLeaderboardOpen()}>
                                                                            <ion-icon name="podium"></ion-icon>
                                                                        </Button>
                                                                    </Box>
                                                                </Tooltip>
                                                            </Box>
                                                        </Stack>
                                                    </Center>
                                                </Box>
                                            )}
                                        </Box>
                                        <Box id="timer">
                                            {startCounting && (
                                                <Timer
                                                    codeID={leetcodeTitle}
                                                    language={language}
                                                    startCounting={startCounting}
                                                    pause={finished}
                                                    correctWords={correctWordArray.filter(Boolean).length}
                                                    totalWords={wordBank.length}
                                                    correctCharacterArray={correctCharsArray}
                                                    submitted={submitted}
                                                    leetcodeTitle={leetcodeTitle}
                                                    setSubmitted={setSubmitted}
                                                    user={user}
                                                    last_daily={last_daily}
                                                    thisSolutionPR={thisSolutionPR}
                                                    setThisSolutionPR={setThisSolutionPR}
                                                    wordLimit={wordLimit}
                                                    Restart={Restart}
                                                    showLiveWPM={config["showLiveWPM"]}
                                                    config={config}
                                                />
                                            )}
                                        </Box>
                                        <Box className="textContainer">
                                            <p className="error"> {error}</p>
                                            <Box>
                                                <Box className="userInputContainer">
                                                    {!startCounting && !loading && (
                                                        <Text
                                                            className="mainFont"
                                                            fontWeight="100"
                                                            paddingLeft="5px"
                                                            color={config["subtleText"]}>
                                                            {preGeneratedLineIndex.length + 1} lines
                                                        </Text>
                                                    )}
                                                    <Stack justifyContent="center" direction="row">
                                                        {!finished && <Divider orientation="vertical" width="56px"/>}
                                                    </Stack>
                                                </Box>
                                                <Center>
                                                    <Box width="90px" className="font100 mainFont whiteText no-select">
                                                        <Center>
                                                            <Center>
                                                                <Box width="300px">
                                                                    <Stack direction={["row"]}>
                                                                        {user && (
                                                                            <Center>
                                                                                {user && !startCounting && !loading && !findingPR && (
                                                                                    <Tooltip label="Your personal best"
                                                                                             placement="top">
                                                                                        <Box width="100px"
                                                                                             marginLeft="103px">
                                                                                            <Center>
                                                                                                {user && !startCounting && !loading && (
                                                                                                    <HStack>
                                                                                                        <p className="subtleTextColor font500">
                                                                                                            {thisSolutionPR} WPM{" "}
                                                                                                        </p>
                                                                                                        <FaCrown
                                                                                                            color={config["subtleText"]}/>
                                                                                                    </HStack>
                                                                                                )}
                                                                                            </Center>
                                                                                        </Box>
                                                                                    </Tooltip>
                                                                                )}
                                                                            </Center>
                                                                        )}
                                                                        <Box color={config["subtleText"]}
                                                                             fontSize="14px" paddingLeft="44px">
                                                                            <HStack>
                                                                                {!loading && !user && !startCounting && (
                                                                                    <Box className="underline">
                                                                                        <a href="/login">log in</a>
                                                                                    </Box>
                                                                                )}
                                                                                {!loading && !user && !startCounting &&
                                                                                    <p>to save your data</p>}
                                                                            </HStack>
                                                                        </Box>
                                                                    </Stack>
                                                                </Box>
                                                            </Center>
                                                        </Center>
                                                    </Box>
                                                </Center>
                                            </Box>
                                        </Box>

                                        <Center position="relative">
                                            {!finished && !loading && (
                                                <input
                                                    zIndex="100"
                                                    id="textInput"
                                                    className={startCounting ? "textInput nocursor" : "textInput"}
                                                    type="text"
                                                    onPaste={(e) => {
                                                        e.preventDefault();
                                                        return false;
                                                    }}
                                                    value={userInput}
                                                    onChange={(e) => processInput(e)}
                                                    onKeyDown={handleKeyDown}
                                                    autoFocus
                                                    autoComplete="off"
                                                    spellCheck={false}
                                                    autoCapitalize="none"
                                                    autoCorrect="off"
                                                    ref={inputElement}
                                                    position="absolute"
                                                />
                                            )}
                                            <Box className="text" fontWeight={500} fontSize={config["fontSize"]}>
                        <pre
                            style={{
                                whiteSpace: "pre-wrap",
                            }}>
                          {!finished &&
                              wordBank.map((word, index) => {
                                  if (
                                      (!startCounting &&
                                          (preGeneratedLineIndex.length < 10 || index < preGeneratedLineIndex[9])) ||
                                      (index > renderIndex && index < renderLimit)
                                  ) {
                                      let s = "";
                                      let tabSize = "";
                                      for (let i = 0; i < config["tabSize"]; i++) {
                                          tabSize += " ";
                                      }
                                      if (index !== wordBank.length - 1) {
                                          for (let i = 0; i < whiteSpace[index]; i++) {
                                              s += tabSize;
                                          }
                                      }
                                      return (
                                          <Box
                                              as="span"
                                              key={index}
                                              className="displayText"
                                              fontFamily={config["font"]}>
                                              {s}
                                              <Word
                                                  text={word}
                                                  active={index === activeWordIndex}
                                                  correct={correctWordArray[index]}
                                                  thisWordIndex={index}
                                              />
                                          </Box>
                                      );
                                  }
                                  return "";
                              })}
                        </pre>
                                                {preGeneratedLineIndex.length > 10 && !startCounting && !loading && (
                                                    <Box paddingTop="10px">
                                                        <Center>
                                                            <Text color={config["subtleText"]}
                                                                  className="mainFont font300" fontSize="12px">
                                                                {preGeneratedLineIndex.length + 1 - 10} more lines not
                                                                shown...
                                                            </Text>
                                                        </Center>
                                                    </Box>
                                                )}
                                            </Box>
                                        </Center>
                                        <Center>
                                            <Box paddingTop="1rem">
                                                {preGeneratedLineIndex.length - currentLine + 1 - config["linesDisplayed"] > 0 &&
                                                    startCounting &&
                                                    !finished &&
                                                    config["showLinesLeft"] && (
                                                        <p className="mainFont subtleTextColor">
                                                            {preGeneratedLineIndex.length - currentLine + 1 - config["linesDisplayed"]} more
                                                            lines left...
                                                        </p>
                                                    )}
                                            </Box>
                                        </Center>
                                    </Box>
                                </Box>
                            </Center>
                            <Center>
                                <Box>
                                    {!loading && !finished && (
                                        <IconButton
                                            minW="50px"
                                            _hover={{backgroundColor: config["subtleText"]}}
                                            color={config["mainText"]}
                                            backgroundColor="transparent"
                                            icon={<RepeatIcon/>}
                                            onClick={() => Restart(language, wordLimit)}></IconButton>
                                    )}
                                </Box>
                            </Center>
                            <Box id="userInput">
                                {!newUser && !finished && !startCounting && (
                                    <Text fontSize="18px" color={config["subtleText"]} className="mainFont font300">
                                        [Tab] to Restart Test
                                    </Text>
                                )}
                            </Box>
                        </Box>
                        <LeaderboardModal
                            isLeaderboardOpen={isLeaderboardOpen}
                            onLeaderboardClose={onLeaderboardClose}
                            givenSolName={leetcodeTitle}
                            selectedLanguage={language}
                        />
                    </Box>
                </Section>
            )}
        </Box>
    );
}

export default App;
