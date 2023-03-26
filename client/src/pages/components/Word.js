import React from "react";

export default function Word(props) {
  // if this doesnt work put it back and try using React.memo

  const { text, active, correct } = props;
  const hasReturn = text.includes("\n");

  if (correct === true) {
    if (active) {
      if (hasReturn)
        return (
          <span className="currentCorrect displayText">
            {text} <br />
          </span>
        );
      return <span className="currentCorrect displayText">{text} </span>;
    } else {
      if (hasReturn)
        return (
          <span className="correct displayText">
            {text} <br />
          </span>
        );
      return <span className="correct displayText">{text} </span>;
    }
  }
  if (correct === false) {
    if (active) {
      if (hasReturn)
        return (
          <span className="currentIncorrect displayText">
            {text} <br />
          </span>
        );
      return <span className="currentIncorrect displayText">{text} </span>;
    } else {
      if (hasReturn)
        return (
          <span className="incorrect displayText">
            {text} <br />
          </span>
        );
      return <span className="incorrect displayText">{text} </span>;
    }
  }

  if (active) {
    if (hasReturn)
      return (
        <span className="displayText" style={{ fontWeight: active ? "bold" : "lighter" }}>
          {text} <br />
        </span>
      );
    return (
      <span className="displayText" style={{ fontWeight: active ? "bold" : "lighter" }}>
        {text}{" "}
      </span>
    );
  }
  if (hasReturn)
    return (
      <span className="displayText">
        {text}
        <br />
      </span>
    );
  return <span className="displayText">{text} </span>;
}
