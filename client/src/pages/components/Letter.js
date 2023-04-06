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
  } = props;
  const userChar = userInput.charAt(idx);
  const isLastChar = idx === displayWord.length - 1;
  const currentCharacter = idx === userInput.length - 1;
  let correct = char === userChar;

  console.log("y: " + idx);

  if (userChar === "" || !active) correct = null;

  // if user goes over the word length
  if (active) {
    if (hasReturn && userInput.length >= displayWord.length) {
      if (isLastChar) return <span className="currentIncorrect underlineRed displayText"> {char}</span>;
      return <span className="currentIncorrect underlineRed displayText">{char}</span>;
    }
    if (userInput.length > displayWord.length) {
      if (isLastChar) return <span className="currentIncorrect underlineRed displayText">{char} </span>;
      return <span className="currentIncorrect underlineRed displayText">{char}</span>;
    }
  }

  // after we're done, display entire word as green or red
  if (wordCorrect && activeWordIndex > thisWordIndex) {
    if (isLastChar) return <span className="correct displayText">{char} </span>;
    return <span className="correct displayText">{char}</span>;
  } else if (!wordCorrect && activeWordIndex > thisWordIndex) {
    if (isLastChar) return <span className="incorrect displayText">{char} </span>;
    return <span className="incorrect displayText">{char}</span>;
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
        if (currentCharacter) return <span className="currentCorrect displayText cursor">{char} </span>;
        return <span className="currentCorrect displayText">{char} </span>;
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
      if (isLastChar) return <span className="currentIncorrect displayText">{char} </span>;
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
