// import React, {useRef} from 'react';

declare global {
  interface Window {
    ContinueAdvancedVideo: any
  }
}

function ButtonSet(props: any) {
  /* eslint-disable jsx-a11y/no-redundant-roles */

  const ContinueAdvancedVideo = () => {
    try {
      if(window.ContinueAdvancedVideo() !== undefined) {
        window.ContinueAdvancedVideo()
      }
    } catch (error) {
      console.log('Function "ContinueAdvancedVideo()" does not exist.');
            
    } 
  }

  const changeFocus = () => {
    let audioElm = document.getElementById("audioicon");

    if(audioElm !== null) {
      audioElm.focus()
    }
  }

  return (
    <div className="ButtonSet">
      {
        // Previous Task Button => Non-Arabic
        // (props.language !== 'ar') &&
        // <button
        //   className={"navi prev " + (props.updateTask[1] > 0 ? '' : 'disable')}
        //   onClick={(e) => {
        //     if (props.updateTask[1] === 1) { e.currentTarget.blur() }
        //     props.updateTask[0]('-');
        //     props.et("backbutton", { "value": "Back", "id": props.updateTask[3] });
        //   }}
        //   tabIndex={(props.updateTask[1] > 0) ? 0 : -1}
        // >
        //   Previous Task
        // </button>
      }
      {
        // Next Task Button => Arabic
        (props.nextButton && props.language === 'ar') &&
        <button
          role="button"
          className={"navi prev " + (props.updateTask[1] < (props.updateTask[2] - 1) ? '' : 'disable')}
          onClick={(e) => {
            if ((props.updateTask[1] + 1) === (props.updateTask[2] - 1)) { e.currentTarget.blur(); }
            props.updateTask[0]('+');
            props.et("nextbutton", { "value": "Next", "id": props.updateTask[3] });
            props.handleNextBtnsState(false);
          }}
          tabIndex={(props.updateTask[1] < (props.updateTask[2] - 1)) ? 0 : -1}
        >
          Next Task
        </button>
      }

      
      {
        (props.cuQuSet && props.cuQuSet['showstandardformbtn']) &&
        <button
        role="button"
          onClick={() => {
            props.clickListener('standard')
            props.et("showstandardform", props.langLabels['showstandardform']);
          }}
          className="mBtns"
        >
          {props.langLabels['showstandardform']}
        </button>
      }

      {
        (props.cuQuSet && props.cuQuSet['showextandedformbtn']) &&
        <button
          role="button"
          onClick={() => {
            props.clickListener('expanded')
            props.et("showexpandedform", props.langLabels['showexpandedform']);
          }}
          className="mBtns"
        >
          {props.langLabels['showexpandedform']}
        </button>
      }

      {
        (props.cuQuSet && props.cuQuSet['showinchartbtn']) &&
        <button
          role="button"
          onClick={() => {
            props.clickListener('chart')
            props.et("showinchart", props.langLabels['showinchart']);
          }}
          className="mBtns"
        >
          {props.langLabels['showinchart']}
        </button>
      }

      {
        (props.mode === 'question') &&
          <button
            role="button"
            onClick={() => {
              props.clickListener('check')
              props.et("checkanswer", props.langLabels['checkanswer']);
            }}
            className={"mBtns"}
          >
            {props.langLabels['check']}
          </button>
      }

      {
        // Next Task Button => Non-Arabic
        (props.nextButton && props.language !== 'ar') &&
        <button
          role="button"
          className={"navi next " + (props.updateTask[1] < (props.updateTask[2] - 1) ? '' : 'disable')}
          onClick={(e) => {
            if ((props.updateTask[1] + 1) === (props.updateTask[2] - 1)) { e.currentTarget.blur(); }
            props.updateTask[0]('+');
            props.et("nextbutton", { "value": "Next", "id": props.updateTask[3] });
            props.handleNextBtnsState(false);
            changeFocus()
          }}
          tabIndex={(props.updateTask[1] < (props.updateTask[2] - 1)) ? 0 : -1}
        >
          Next Task
        </button>
      }
      {
        // Previous Task Button => Arabic
        // (props.nextButton && props.language === 'ar') &&
        // <button
        //   className={"navi next " + (props.updateTask[1] > 0 ? '' : 'disable')}
        //   onClick={(e) => {
        //     if (props.updateTask[1] === 1) { e.currentTarget.blur() }
        //     props.updateTask[0]('-');
        //     props.et("backbutton", { "value": "Back", "id": props.updateTask[3] });
        //   }}
        //   tabIndex={(props.updateTask[1] > 0) ? 0 : -1}
        // >
        //   Previous Task
        // </button>
      }

      {
        // Continue Advanced Video 
        (props.nextButton && (props.updateTask[1] === (props.updateTask[2] - 1))) &&
        <button
          role="button"
          className={"navi next continueBtn"}
          onClick={(e) => {
            e.preventDefault();
            props.et("nextbutton", "Continue");
            props.handleNextBtnsState(false);

            // window.parent.postMessage('continuevideo', '*');
            ContinueAdvancedVideo()
          }}
        >
          Continue
        </button>
      }
    </div>
  );
}

export default ButtonSet