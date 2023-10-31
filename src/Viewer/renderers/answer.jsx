import React from "react";
import useDoenetRenderer from "../useDoenetRenderer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faLevelDownAlt,
  faTimes,
  faCloud,
} from "@fortawesome/free-solid-svg-icons";
// import "./answer.css";

("use client");
import { Button } from "flowbite-react";

// Moved most of this styling into answer.css
// const Button = styled.button`
//   position: relative;
//   height: 24px;
//   display: inline-block;
//   color: white;
//   background-color: var(--mainblue);
//   padding: 2px;
//   /* border: var(--mainBorder); */
//   border-radius: var(--mainBorderRadius);
//   margin: 0px 4px 4px 0px;

//   &:hover {
//     background-color: var(--lightBlue);
//     color: black;
//   }
// `;

export default React.memo(function Answer(props) {
  let { name, id, SVs, actions, children, callAction } =
    useDoenetRenderer(props);

  if (SVs.hidden) {
    return null;
  }

  let disabled = SVs.disabled;

  let submitAnswer = () =>
    callAction({
      action: actions.submitAnswer,
    });
  if (SVs.submitAllAnswersAtAncestor) {
    submitAnswer = () =>
      callAction({
        action: actions.submitAllAnswers,
      });
  }

  // BADBADBAD: need to redo how getting the input child
  // without using the internal guts of componentInstructions
  // is just asking for trouble

  let inputChildrenToRender = null;
  if (SVs.inputChildren.length > 0) {
    let inputChildNames = SVs.inputChildren.map((x) => x.componentName);
    inputChildrenToRender = children.filter(
      //child might be null or a string
      (child) =>
        child &&
        typeof child !== "string" &&
        inputChildNames.includes(
          child.props.componentInstructions.componentName,
        ),
    );
  }

  if (!SVs.delegateCheckWork && !SVs.suppressCheckwork) {
    let validationState = "unvalidated";
    if (SVs.justSubmitted || SVs.numAttemptsLeft < 1) {
      if (SVs.creditAchieved === 1) {
        validationState = "correct";
      } else if (SVs.creditAchieved === 0) {
        validationState = "incorrect";
      } else {
        validationState = "partialcorrect";
      }
    }

    let checkWorkText = SVs.submitLabel;
    if (!SVs.showCorrectness) {
      checkWorkText = SVs.submitLabelNoCorrectness;
    }
    let checkworkComponent = (
      <Button
        // className="check-work bg-blue-700"
        color="dark"
        id={id + "_submit"}
        tabIndex="0"
        disabled={disabled}
        onClick={submitAnswer}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            submitAnswer();
          }
        }}
      >
        <FontAwesomeIcon
          style={
            {
              /*marginRight: "4px", paddingLeft: "2px"*/
            }
          }
          icon={faLevelDownAlt}
          transform={{ rotate: 90 }}
        />
        &nbsp;
        {checkWorkText}
      </Button>
    );

    if (SVs.showCorrectness) {
      if (validationState === "correct") {
        checkworkComponent = (
          <Button className="check-work bg-green-700" id={id + "_correct"}>
            <FontAwesomeIcon icon={faCheck} />
            &nbsp; Correct
          </Button>
        );
      } else if (validationState === "incorrect") {
        checkworkComponent = (
          <Button className="check-work bg-red-700" id={id + "_incorrect"}>
            <FontAwesomeIcon icon={faTimes} />
            &nbsp; Incorrect
          </Button>
        );
      } else if (validationState === "partialcorrect") {
        let percent = Math.round(SVs.creditAchieved * 100);
        let partialCreditContents = `${percent}% Correct`;

        checkworkComponent = (
          <Button className="check-work bg-orange-700" id={id + "_partial"}>
            {partialCreditContents}
          </Button>
        );
      }
    } else {
      // showCorrectness is false
      if (validationState !== "unvalidated") {
        checkworkComponent = (
          <Button className="check-work bg-purple-700" id={id + "_saved"}>
            <FontAwesomeIcon icon={faCloud} />
            &nbsp; Response Saved
          </Button>
        );
      }
    }

    if (SVs.numAttemptsLeft < 0) {
      checkworkComponent = (
        <>
          {checkworkComponent}
          <span>(no attempts remaining)</span>
        </>
      );
    } else if (SVs.numAttemptsLeft == 1) {
      checkworkComponent = (
        <>
          {checkworkComponent}
          <span>(1 attempt remaining)</span>
        </>
      );
    } else if (Number.isFinite(SVs.numAttemptsLeft)) {
      checkworkComponent = (
        <>
          {checkworkComponent}
          <span>({SVs.numAttemptsLeft} attempts remaining)</span>
        </>
      );
    }

    return (
      <span id={id} className="mb-4">
        <a name={id} />
        {inputChildrenToRender}
        {checkworkComponent}
      </span>
    );
  } else {
    return (
      <span id={id} className="mb-4">
        <a name={id} />
        {inputChildrenToRender}
      </span>
    );
  }
});
