import { useState, useRef, useEffect } from "react";
import React from "react";
import Timer from "./components/Timer.js";
import javaCode from "./components/codefiles/javaCode.json";
import pyCode from "./components/codefiles/pyCode.json";
import cppCode from "./components/codefiles/cppCode.json"; // bye bye
import CodeSettings from "./components/CodeSettings.js";
import StoredInput from "./components/StoredInput.js";
import Letter from "./components/Letter.js";
import { useParams } from "react-router-dom";
import {
  getFirestore,
  doc,
  updateDoc,
  addDoc,
  getDocs,
  setDoc,
  collection,
  query,
  where,
} from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { ref as sRef } from "firebase/storage";
import { auth } from "./components/firebase.js";
import { db } from "./components/firebase.js";
import crown from "./components/assets/crown (2).png";
import {
  Center,
  useDisclosure,
  IconButton,
  Stack,
  Divider,
  Image,
  Tooltip,
  Text,
  Box,
} from "@chakra-ui/react";
import { RepeatIcon, StarIcon } from "@chakra-ui/icons";

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

    return console.log();
  });
  let lineCount = 0;

  finalCode.map((word) => {
    if (word.includes("\n")) lineCount++;
  });
  return lineCount;
}

function App({ user, givenId }) {
  const { isOpen: isWordsOpen, onClose: onWordsClose, onOpen: onWordsOpen } = useDisclosure();
  const { isOpen: isSearchOpen, onClose: onSearchClose, onOpen: onSearchOpen } = useDisclosure();

  const { givenLanguage, number } = useParams();
  console.log("num: " + number);
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
  const [wordLimit, setWordLimit] = useState(50000);
  const [wordBank, setNewWordBank] = useState([]);
  const [whiteSpace, setWhiteSpace] = useState([]);
  const [language, setLanguage] = useState("");
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
  const [id, setId] = useState(number);
  const [amountOfLinesToRender, setAmountOfLinesToRender] = useState(5);

  const [finished, setFinished] = useState(false);
  useEffect(() => {
    const getSubmissions = async () => {
      const data = await getDocs(submissionsCollectionRef);
      setSubmissions(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
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

  useEffect(
    () => {
      setLoading(true);
      async function getUserSettings() {
        const q = query(collection(db, "users"), where("uid", "==", user.uid));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          if (doc.data().lastId) setId(doc.data().lastId);
          if (doc.data().lineLimit) setWordLimit(doc.data().lineLimit);

          if (!givenLanguage) Restart(doc.data().lastLanguage, "");
          else Restart(givenLanguage, "");
        });
      }
      if (user) getUserSettings().then(() => setLoading(false));
      if (!user) {
        if (!givenLanguage) Restart("Java", "");
        else Restart(givenLanguage, "");
        setLoading(false);
      }
    },
    [user],
    []
  );

  async function changeLastLanguage(codingLanguage) {
    if (user)
      await updateDoc(doc(db, "users", user.uid), {
        lastLanguage: codingLanguage,
      });
  }

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

  function Restart(codingLanguage, maxWords, retrySame) {
    let s = "";
    changeLastLanguage(codingLanguage);
    if (retrySame === undefined) {
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
      setError("Not a valid solution ID!");
    }
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
          setError("Not a valid solution ID!");
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
      submissions.map((submission) => {
        if (submission.user !== user.displayName) return "";
        if (submission.solution_id !== codeTitle) return "";
        if (submission.language !== codingLanguage) return "";
        if (!submission.isBestSubmission) return "";
        setThisSolutionPR(submission.wpm);
        found = true;
      });
      if (!found) setThisSolutionPR(0);
    }
    return selectedCode;
  }

  function Reset(codingLanguage, maxWords, id) {
    // solution range
    ////////////////////////// C++
    let codeLang = cppCode;
    if (wordLimit !== null && wordLimit !== undefined && wordLimit !== "") {
      maxWords = wordLimit;
    }

    if (maxWords === "" || maxWords === undefined || maxWords === 50000) {
      maxWords = 50000;
      if (wordLimit === null || wordLimit === undefined) {
        console.log("word limit is " + wordLimit);
        setWordLimit(50000);
      }
    } else {
      console.log("huh: " + maxWords);
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

    if (numSolutions === 0) {
      return `Must have atleast 1 solution`;
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

      return console.log();
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

    const { text, active, correct, thisWordIndex } = props;
    const hasReturn = text.includes("\n");
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

    if (e.key === "Control") setControllPress(true);
    else setControllPress(false);

    if (e.key === "Enter" && controlPress) {
      Restart(language, wordLimit, leetcodeTitle);
      setControllPress(false);
      return "";
    }
    if (e.key === "Enter" && inputElement.current.type === document.activeElement.type) {
      if (wordBank[activeWordIndex].substring(wordBank[activeWordIndex].length - 1) === "\n") {
        setCorrectWordArray((data) => {
          const newResult = [...data];
          newResult[activeWordIndex] =
            userInput ===
            wordBank[activeWordIndex].substring(
              0,
              wordBank[activeWordIndex].length - countReturns(wordBank[activeWordIndex])
            );
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
    if (value.endsWith(" ") && value.length > 1) {
      setActiveWordIndex((index) => index + 1);
      setUserInput("");
      setCorrectWordArray((data) => {
        const word = value.trim();
        const newResult = [...data];
        newResult[activeWordIndex] = word === wordBank[activeWordIndex];
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

  const renderLimit =
    preGeneratedLineIndex[currentLine + amountOfLinesToRender - 1] === undefined
      ? 1000000
      : preGeneratedLineIndex[currentLine + amountOfLinesToRender - 1];
  return (
    <Box className="body">
      <Box className="container">
        <Center>
          <Box className="content">
            <Box>
              <Box className="codingSettings">
                {!loading && (
                  <CodeSettings
                    startCounting={startCounting}
                    id={id}
                    language={language}
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
                  />
                )}
              </Box>
            </Box>

            <Box className="inputContainer">
              <Box className="leetcodeTitle">
                {loading && <p>Loading...</p>}
                {!startCounting && <p className="mainFont">{leetcodeTitle}</p>}
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
                    thisSolutionPR={thisSolutionPR}
                    setThisSolutionPR={setThisSolutionPR}
                  />
                )}
              </Box>

              <Box className="textContainer">
                <p className="error"> {error}</p>
                {console.log(loading)}
                <Box>
                  <Box className="userInputContainer">
                    {!startCounting && !loading && (
                      <Text className="mainFont" color="white">
                        {preGeneratedLineIndex.length} lines
                      </Text>
                    )}
                    <Stack justifyContent="center" direction="row">
                      {!finished && <Divider orientation="vertical" width="56px" />}

                      {!finished && !loading && (
                        <input
                          className="textInput"
                          type="text"
                          onPaste={(e) => {
                            e.preventDefault();
                            return false;
                          }}
                          value={userInput}
                          onChange={(e) => processInput(e)}
                          onKeyDown={handleKeyDown}
                          autoFocus
                          spellCheck={false}
                          ref={inputElement}
                        />
                      )}

                      <Box className="restartDiv">
                        {!loading && (
                          <IconButton
                            boxSize="12"
                            icon={<RepeatIcon />}
                            onClick={() => Restart(language, wordLimit)}></IconButton>
                        )}
                      </Box>
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
                                  <Tooltip label="Your personal best" placement="top">
                                    <Box width="100px" marginLeft="99px">
                                      {user && !startCounting && !loading && (
                                        <p className="grayText font500">{thisSolutionPR} WPM </p>
                                      )}
                                      {!loading && user && !startCounting && (
                                        <Box className="podiumIcon">
                                          <ion-icon name="podium"></ion-icon>
                                        </Box>
                                      )}
                                    </Box>
                                  </Tooltip>
                                </Center>
                              )}

                              {!loading && !user && !startCounting && (
                                <a className="whiteUnderline padLeft" href="/login">
                                  {" "}
                                  Log in
                                </a>
                              )}
                              {!loading && !user && !startCounting && <p>to save your data</p>}
                            </Stack>
                          </Box>
                        </Center>
                      </Center>
                    </Box>
                  </Center>
                </Box>
              </Box>

              <Box className="text">
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                  }}>
                  {!finished &&
                    wordBank.map((word, index) => {
                      if (!startCounting || (index > renderIndex && index < renderLimit)) {
                        let s = "";
                        if (index !== wordBank.length - 1) {
                          for (let i = 0; i < whiteSpace[index]; i++) {
                            s += "  ";
                          }
                        }
                        return (
                          <span key={index} className="displayText">
                            {s}
                            <Word
                              text={word}
                              active={index === activeWordIndex}
                              correct={correctWordArray[index]}
                              thisWordIndex={index}
                            />
                          </span>
                        );
                      }
                      return "";
                    })}
                </pre>
              </Box>
              {startCounting && !finished && (
                <p className="mainFont active whiteText">
                  {preGeneratedLineIndex.length - currentLine} more lines...
                </p>
              )}
            </Box>
          </Box>
        </Center>
        <Box id="userInput">
          {!newUser && (
            <p className="grayText mainFont font500">
              Tab + Enter to Restart Test
              <br />
            </p>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default App;
