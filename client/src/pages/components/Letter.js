import React from "react";

export default function Letter(props) {
  const {
    idx,
    displayWord,
    char,
    userInput,
    active,
    hasReturn,
    wordCorrect,
    activeWordIndex,
    thisWordIndex,
    inputSelected,
    storedInputArray,
  } = props;
  const userChar = userInput.charAt(idx);
  const isLastChar = idx === displayWord.length - 1;
  const currentCharacter = idx === userInput.length - 1;
  let correct = char === userChar;
  const cutoffLetters = userInput.substring(displayWord.length);
  const cutoffLettersPlusOne = userInput.substring(displayWord.length - 1);
  const wasntTyped = storedInputArray[thisWordIndex]?.length - 2 < idx;
  const wasCorrect = storedInputArray[thisWordIndex]?.charAt(idx) === char;

  if (userChar === "" || !active) correct = null;

  // add blinking indicator on the first letter
  if (inputSelected && idx === 0 && active && userInput.length === 0) {
    if (isLastChar) return <span className="behindCursor displayText">{char} </span>;
    return <span className="behindCursor active">{char}</span>;
  }

  // if user goes over the word length
  if (active) {
    if (hasReturn && userInput.length >= displayWord.length) {
      if (isLastChar)
        return (
          <span>
            <span className="currentIncorrect underlineRed displayText cursor">{cutoffLettersPlusOne}</span>
            <span className="currentIncorrect displayText">
              <br />
            </span>
          </span>
        );
      return (
        <span
          className={
            correct ? "currentCorrect underlineRed displayText" : "currentIncorrect underlineRed displayText"
          }>
          {char}
        </span>
      );
    }
    if (userInput.length > displayWord.length) {
      if (isLastChar)
        return (
          <span className="currentIncorrect  displayText">
            <span
              className={
                correct
                  ? "currentCorrect underlineRed displayText"
                  : "currentIncorrect underlineRed displayText"
              }>
              {char}
            </span>
            <span className="nounderline">
              <span className="currentIncorrect underlineRed displayText cursor">{cutoffLetters}</span>
              <span className="currentIncorrect displayText "> </span>
            </span>
          </span>
        );
      return (
        <span
          className={
            correct ? "currentCorrect underlineRed displayText" : "currentIncorrect underlineRed displayText"
          }>
          {char}
        </span>
      );
    }
  }

  // after we're done, display individual words, remember their state
  if (activeWordIndex > thisWordIndex) {
    if (storedInputArray[thisWordIndex].length - 1 > displayWord.length) {
      if (isLastChar)
        return (
          <span className="incorrect displayText">
            <span
              className={
                wasCorrect ? "underlineRed correct displayText" : "underlineRed incorrect displayText"
              }>
              {char}
            </span>
            <span className="underlineRed  incorrect displayText">
              {storedInputArray[thisWordIndex].substring(
                displayWord.length,
                storedInputArray[thisWordIndex].length - 1
              )}
            </span>
            <span> </span>
          </span>
        );
      return (
        <span
          className={wasCorrect ? "underlineRed correct displayText" : "underlineRed incorrect displayText"}>
          {char}
        </span>
      );
    }

    // if wasn't overflow, just render if they were correct or not
    if (wasntTyped) {
      if (isLastChar) return <span className=" displayText">{char} </span>;
      return <span className="displayText">{char}</span>;
    }
    if (isLastChar)
      return <span className={wasCorrect ? "correct displayText" : "incorrect displayText"}>{char} </span>;
    return <span className={wasCorrect ? "correct displayText" : "incorrect displayText"}>{char}</span>;
  }

  // else if (!wordCorrect && active && userInput !== '') {
  //         if(isLastChar) return <span className =  "currentIncorrect displayText">{char} </span>
  //         return <span className="currentIncorrect displayText">{char}</span>
  // }

  // SHOW EACH CHARACTER MESSING UP vs SHOWING THE WHOLE WORD MESSING UP

  if (correct === true) {
    if (active) {
      if (hasReturn && isLastChar) return <span className="currentCorrect displayText">{char}</span>;
      if (isLastChar) {
        return (
          <span className="currentCorrect displayText">
            <span className="currentCorrect displayText">{char}</span>
            <span className="currentCorrect displayText behindCursor"> </span>
          </span>
        );
      }
      if (currentCharacter) return <span className="correct displayText cursor">{char}</span>;
      return <span className="correct displayText">{char}</span>;
    } else {
      if (hasReturn && isLastChar) return <span className="correct displayText">{char}</span>;
      if (isLastChar) return <span className="correct displayText">{char} </span>;

      if (currentCharacter) return <span className="correct displayText cursor">{char}</span>;
      return <span className="correct displayText">{char}</span>;
    }
  }
  if (correct === false) {
    if (active) {
      if (hasReturn && isLastChar) return <span className="currentIncorrect displayText">{char}</span>;
      if (isLastChar) {
        return (
          <span className="currentIncorrect displayText">
            <span className="currentIncorrect displayText">{char}</span>
            <span className="currentIncorrect displayText behindCursor"> </span>
          </span>
        );
      }
      if (currentCharacter) return <span className="currentIncorrect displayText cursor">{char}</span>;
      return <span className="currentIncorrect displayText">{char}</span>;
    } else {
      if (hasReturn && isLastChar) return <span className="incorrect displayText">{char}</span>;
      if (currentCharacter) return <span className="incorrect displayText cursor">{char}</span>;
      return <span className="incorrect displayText">{char}</span>;
    }
  }

  // ACTIVE TEXT CHARACTERS GRAY
  if (active && correct === null) {
    if (hasReturn && isLastChar) return <span className="active">{char}</span>;
    if (isLastChar) return <span className="active">{char} </span>;
    return <span className="active ">{char}</span>;
  }

  if (hasReturn && isLastChar) return <span className="displayText">{char}</span>;

  if (isLastChar) return <span className="displayText">{char} </span>;
  return <span className="displayText">{char}</span>;
}
