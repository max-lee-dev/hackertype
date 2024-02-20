import React from "react";
import {coordinatesOfChar} from "./utils/utils";

export default function Letter(props) {
  const {
    idx,
    id,
    displayWord,
    char,
    userInput,
    active,
    hasReturn,
    activeWordIndex,
    thisWordIndex,
    inputSelected,
    storedInputArray,
    numReturns,
    toggleBrackets,
  } = props;
  const userChar = userInput.charAt(idx);
  const isLastChar = idx === displayWord.length - 1;
  const currentCharacter = idx === userInput.length - 1;
  let correct = char === userChar;
  const cutoffLetters = userInput.substring(displayWord.length);
  const cutoffLettersPlusX = userInput.substring(displayWord.length - numReturns);
  const wasntTyped = storedInputArray[thisWordIndex]?.length - 2 < idx;
  const wasCorrect = storedInputArray[thisWordIndex]?.charAt(idx) === char;

  const isBracket = char === ")" || char === "}" || char === "]";
  if (isBracket && toggleBrackets) {
    if (hasReturn && isLastChar)
      return (
        <span id={id} className="currentCorrect displayText">
          {char}
        </span>
      );
    if (isLastChar) {
      return (
        <span id={id} className="currentCorrect displayText">
          <span id={id} className="currentCorrect displayText">
            {char}
          </span>
          <span id={id} className="currentCorrect displayText">
            {" "}
          </span>
        </span>
      );
    }
    return (
      <span id={id} className="correct displayText">
        {char}
      </span>
    );
  }

  if (userChar === "" || !active) correct = null;

  // add blinking indicator on the first letter
  if (inputSelected && idx === 0 && active && userInput.length === 0) {
    if (isLastChar)
      return (
        <span id={id} className="displayText">
          {char}{" "}
        </span>
      );
    if (activeWordIndex === 0) {
      return (
        <span id={id} className="behindCursor active">
        {char}
      </span>
      );
    } else {
      return (
        <span id={id} className="active">
          {char}
        </span>
      );
    }
  }

  // if user goes over the word length
  if (active) {
    if (hasReturn && userInput.length > displayWord.length - numReturns) {
      if (isLastChar)
        return (
          <span>
            <span id={id} className="currentIncorrect underlineRed displayText cursor">
              {cutoffLettersPlusX}
            </span>
            <span id={id} className="currentIncorrect displayText">
              <br/>
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
          <span id={id} className="currentIncorrect  displayText">
            <span
              className={
                correct
                  ? "currentCorrect underlineRed displayText"
                  : "currentIncorrect underlineRed displayText"
              }>
              {char}
            </span>
            <span id={id} className="nounderline">
              <span id={id} className="currentIncorrect underlineRed displayText cursor">
                {cutoffLetters}
              </span>
              <span id={id} className="currentIncorrect displayText ">
                {" "}
              </span>
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
          <span id={id} className="incorrect displayText">
            <span
              className={
                wasCorrect ? "underlineRed correct displayText" : "underlineRed incorrect displayText"
              }>
              {char}
            </span>
            <span id={id} className="underlineRed  incorrect displayText">
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
      if (isLastChar)
        return (
          <span id={id} className=" displayText">
            {char}{" "}
          </span>
        );
      return (
        <span id={id} className="displayText">
          {char}
        </span>
      );
    }
    if (isLastChar)
      return (
        <span id={id} className={wasCorrect ? "correct displayText" : "incorrect displayText"}>
          {char}{" "}
        </span>
      );
    return (
      <span id={id} className={wasCorrect ? "correct displayText" : "incorrect displayText"}>
        {char}
      </span>
    );
  }

  if (correct === true) {
    if (active) {
      if (hasReturn && isLastChar)
        return (
          <span id={id} className="currentCorrect displayText">
            {char}
          </span>
        );
      if (isLastChar) {
        return (
          <span id={id} className="currentCorrect displayText">
            <span id={id} className="currentCorrect displayText">
              {char}
            </span>
            <span id={id} className="currentCorrect displayText ">
              {" "}
            </span>
          </span>
        );
      }
      // the one
      if (currentCharacter)
        return (
          <span id={id} className="correct displayText cursor">
            {char}
          </span>
        );

      // active word, previously correct
      return (
        <span id={id} className="correct displayText">
          {char}
        </span>
      );
    } else {
      if (hasReturn && isLastChar)
        return (
          <span id={id} className="correct displayText">
            {char}
          </span>
        );
      if (isLastChar)
        return (
          <span id={id} className="correct displayText">
            {char}{" "}
          </span>
        );

      if (currentCharacter)
        return (
          <span id={id} className="correct displayText cursor">
            {char}
          </span>
        );
      return (
        <span id={id} className="correct displayText">
          {char}
        </span>
      );
    }
  }
  if (correct === false) {
    if (active) {
      if (hasReturn && isLastChar)
        return (
          <span id={id} className="currentIncorrect displayText">
            {char}
          </span>
        );
      if (isLastChar) {
        return (
          <span id={id} className="currentIncorrect displayText">
            <span id={id} className="currentIncorrect displayText">
              {char}
            </span>
            <span id={id} className="currentIncorrect displayText ">
              {" "}
            </span>
          </span>
        );
      }
      if (currentCharacter)
        return (
          <span id={id} className="currentIncorrect displayText cursor">
            {char}
          </span>
        );
      return (
        <span id={id} className="currentIncorrect displayText">
          {char}
        </span>
      );
    } else {
      if (hasReturn && isLastChar)
        return (
          <span id={id} className="incorrect displayText">
            {char}
          </span>
        );
      if (currentCharacter)
        return (
          <span id={id} className="incorrect displayText cursor">
            {char}
          </span>
        );
      return (
        <span id={id} className="incorrect displayText">
          {char}
        </span>
      );
    }
  }

  // ACTIVE TEXT CHARACTERS GRAY
  if (active && correct === null) {
    if (hasReturn && isLastChar)
      return (
        <span id={id} className="active">
          {char}
        </span>
      );
    if (isLastChar)
      return (
        <span id={id} className="active">
          {char}{" "}
        </span>
      );
    return (
      <span id={id} className="active ">
        {char}
      </span>
    );
  }

  if (hasReturn && isLastChar)
    return (
      <span id={id} className="displayText">
        {char}
      </span>
    );

  if (isLastChar)
    return (
      <span id={id} className="displayText">
        {char}{" "}
      </span>
    );
  return (
    <span id={id} className="displayText">
      {char}
    </span>
  );
}
