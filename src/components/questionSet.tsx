import React, { useRef, useState, MutableRefObject, useEffect } from 'react';

function QuestionSet(props: any) {

  const firstInput = useRef() as MutableRefObject<HTMLInputElement>;
  const secondInput = useRef() as MutableRefObject<HTMLInputElement>;
  const QuestionSetTitle = useRef() as MutableRefObject<HTMLDivElement>;
  
  const [allowToCheck, setAllowToCheck] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');

  useEffect(() => {
    if (firstInput.current !== null && firstInput.current !== undefined) {
      firstInput.current.value = '';
      secondInput.current.value = '';
    }
    setUserAnswer('');
    setAllowToCheck(false);

    QuestionSetTitle.current.focus()
    QuestionSetTitle.current.scrollIntoView();
  }, [props.task]);

  const checkAnswer = () => {
    const fv = parseInt(firstInput.current.value);
    const sv = parseInt(secondInput.current.value);

    setUserAnswer('');
    if(props.task.row === fv && props.task.column === sv){
      setUserAnswer('correct');
      // Event Tracking
      // props.et("questionsetsubmit", "correct");
      props.et("questionsetsubmit", { "result": "correct", "answer": [fv, sv] });
    }
    else {
      setUserAnswer('incorrect');
      // Event Tracking
      // props.et("questionsetsubmit", "incorrect");
      props.et("questionsetsubmit", { "result": "incorrect", "answer": [fv, sv] });
    }

  }

  const validateToAllowChecking = () => {
    const fv = firstInput.current.value;
    const sv = secondInput.current.value;
    setUserAnswer('');

    if(fv !== '' && sv !== '') {
      setAllowToCheck(true);
    } else {
      setAllowToCheck(false);
    }
  }

  return (
    <div className="QuestionSet">
      <div className="greyBox">
        <div
          id='secTitle'
          ref={QuestionSetTitle}
          tabIndex={0}
          aria-label={
            props.task['label'][props.language] + " " + props.task['question'][props.language]
          }
        >
          <span  dir={props.language === "en" ? "ltr" : 'rtl'} dangerouslySetInnerHTML={{ __html: props.task['label'][props.language] }}></span>
          <span  dir={props.language === "en" ? "ltr" : 'rtl'} dangerouslySetInnerHTML={{ __html: props.task['question'][props.language] }}></span>
        </div>
        {
          (props.task['getuserinput']) &&
          <>
            <div className="innerBox">
              <span>
                <label id="labelrow">{props.langLabels['rows']}:</label> &nbsp;
                <input type="text" ref={firstInput} onKeyUp={validateToAllowChecking} autoComplete="off" aria-labelledby="labelrow" />
              </span>
              <span>
                <label id="labelcolumn">{props.langLabels['columns']}:</label> &nbsp;
                <input type="text" ref={secondInput} onKeyUp={validateToAllowChecking} autoComplete="off" aria-labelledby="labelcolumn" />
              </span>
            </div>
            <button
              className={"checkBtn_QS " + (allowToCheck ? '' : 'disable')}
              onClick={checkAnswer}
              tabIndex={allowToCheck ? 0: -1}
              aria-disabled={(allowToCheck ? "false": "true")}
              // aria-labelledby="secTitle"
            >
              {props.langLabels['check']}
            </button>
            <span className={"feedbackText " + (userAnswer)} role="status">
            {
              (userAnswer === 'correct') &&
                <>{props.langLabels['correct']}!</>
            }
            {
              (userAnswer === 'incorrect') &&
                <>{props.langLabels['tryagain']}</>
            }
          </span>
          </>
        }
      </div>
      {
        // (props.task['outcome']) &&
        // <div className="outcomeBox">
        //   <span>Outcome:</span>
        //   <span dangerouslySetInnerHTML={{ __html: props.task['outcome'] }}></span>
        // </div>
      }
    </div>
  );

}

export default QuestionSet