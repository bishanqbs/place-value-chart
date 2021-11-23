import React, { useState, useEffect, useRef } from 'react';
import './AppStyle.scss';

import Chart from './components/chart';
import ButtonSet from './components/buttonSet';

// import * as data from './data/data.json';

function PlaceValueChart() {

  /* eslint-disable react-hooks/exhaustive-deps */

  const [data, setData] = useState(():any => {});
  const [language, setLanguage] = useState("en");
  const [mode, setMode] = useState("explore");

  const [pageId, setPageID] = useState('0');
  const [slideId, setSlideID] = useState('0');

  const [langLabels, setLangLabels] = useState({});
  const [toolsTitle, setToolsTitle] = useState('');
  const [toolsSubtitle, setToolsSubTitle] = useState('');

  const [currentQuestion, setCuQuSet] = useState();
  const [task, settask] = useState();
  const [taskCounter, updateTaskCounter] = useState(-1);
  const [taskLength, settaskLength] = useState(0);

  const [quaudio, setQuaudio] = useState("");
  const [instruction, setInstruction] = useState("");

  const [chartValues, setChartValues] = useState({
    "thousands": 3,
    "ones": 3,
    "decimals": 3
  });

  // Fetching JSON and setting data
  useEffect(() => {
    // let ppath = window.location.toString().split('=')[1];
    const fetchData = async () => {
      const response = await fetch(
        // './data/'+ppath+'.json'
        './data/data.json'
      );
      const jsonData = await response.json();
      
      setData(jsonData);
      setLanguage(jsonData.language);
      updateTaskCounter(0);
    };

    fetchData();
  }, []);

  // Each counter/task update
  useEffect(() => {    
    if(data === undefined) return;
    
    setLangLabels(data['langLabels'][language]);
    setToolsTitle(data['langLabels'][language]['title']);
    setToolsSubTitle(data['langLabels'][language]['mode'][data.questionSet[taskCounter]['mode']]);

    // document.documentElement.dir = dir;
    document.documentElement.lang = language;
    setMode(data.questionSet[taskCounter]['mode']); // Mode of activity: explore/question

    setPageID(data.questionSet[taskCounter]['pageid'])
    setSlideID(data.questionSet[taskCounter]['id'])

    settaskLength(data.questionSet.length);
    setCuQuSet(data.questionSet[taskCounter]);
    settask(data.questionSet[taskCounter]['task']);

    setQuaudio(data.questionSet[taskCounter]['quaudio']);
    setInstruction(data.questionSet[taskCounter]['instruction']);

    updateChartFn(data.questionSet[taskCounter], data['grade']);

  }, [taskCounter]);

  /*
    Update Chart Based on Grade and Custom
  */
  const updateChartFn = (obj:any, grade:any) => {

    if ( obj['updateChart'] && JSON.stringify(obj['updateChart']) !== JSON.stringify({}) )
    {
      setChartValues(obj['updateChart']);
    }
    else
    {
      setChartValues(grade[obj['grade']])
    }
  }

  // Check Button
  const [checkBtnHit, setCheckBtnHit] = useState(0);
  const checkBtnClicked = () => {
    setCheckBtnHit(checkBtnHit => checkBtnHit + 1);
  }

  // Next/Previous Task Navigation
  const updateTask = (op: string) => {
    if (op === "+") {
      updateTaskCounter(taskCounter => taskCounter + 1)
    } else {
      updateTaskCounter(taskCounter => taskCounter - 1)
    }
  }

  const pageidref = useRef<HTMLDivElement>(null);

  // Event Tracking
  const dispatchEvntTrack = (action:any, value:any) => {

    let pageidelm = pageidref.current;
    let pageid:any = 0;
    let id:any = 0;

    if (pageidelm !== null) {
      let tmp = pageidelm.attributes[1]['nodeValue'];
      if(tmp === null) return;
      
      pageid = tmp.split(" ")[0];
      id = tmp.split(" ")[1];
    }
    
    const postData = {
        "type": "BEH_EVENT",
        "value": {
            "header": {
                "eventType": "content.completed"
            },
            "body": {
                "action": action,
                "object": {
                    "page_id": pageid,
                    "id": id,
                    "type": "placevaluechart",
                    "name": "placevaluechart"
                }
            },
            "context": value
        }
    }
    // console.log(postData);
    
    // Post Message
    window.parent.postMessage(postData, "*");
  }

  const [passEvent, setPassEvent] = useState([0, ''])
  const clickListener = (type:string) => {
    var today = new Date();
        today.getSeconds();

    setPassEvent([today.getSeconds(), type])
  }

  const [nextButton, handleNextBtnsState] = useState(false);

  return (
    <div className={"PlaceValueChart " + language} role="main">
      <header role="none">
        <h1>{toolsTitle}</h1>
        <h2>{toolsSubtitle}</h2>
      </header>

      <section id="section">
        
        <Chart
          language={language}
          langLabels={langLabels}
          checkBtnHit={checkBtnHit}
          mode={mode}
          task={task}
          quaudio={quaudio}
          instruction={instruction}
          chartValues={chartValues}
          et={dispatchEvntTrack}
          clickEvent={passEvent}
          handleNextBtnsState={handleNextBtnsState}
        />

      </section>

      <ButtonSet
        language={language}
        mode={mode}
        task={task}
        langLabels={langLabels}
        checkBtnClicked={checkBtnClicked}
        updateTask={[updateTask, taskCounter, taskLength, slideId]}
        et={dispatchEvntTrack}
        cuQuSet={currentQuestion}
        clickListener={clickListener}
        handleNextBtnsState={handleNextBtnsState}
        nextButton={nextButton}
      />

      <div ref={pageidref} id="pageidref" className={pageId + ' ' + slideId}></div>
      <div id="reflector"></div>
    </div>
  )

}

export default PlaceValueChart;
