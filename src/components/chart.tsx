import React, { useState, useEffect, useRef, KeyboardEvent } from 'react'; // FocusEvent
import QuesAud from './questionAudio'

function Chart(props: any) {

  /* eslint-disable react-hooks/exhaustive-deps */

  let selection = false;
  const [chartValues, setChart] = useState({
    "thousands": 3,
    "ones": 3,
    "decimals": 3
  });
  let inpBox: any = useRef(''); // User input box

  const [values, setValues] = useState([]);
  const [decimalpos, setDecimalPosition] = useState(0);
  const [totalValues, setTotalValues] = useState(0);
  const [disableRow, disableRowOf] = useState('');
  const [validation, setValidation] = useState((): any => '');

  const allowNumbers = { allowchars: "0123456789" }
  const allowChars = { allowchars: (decimalpos === 0 ? "0123456789" : "0123456789.") }

  const [showExpForm, setStateOfExpForm] = useState(false);
  const [expandedform, setExpandedForm] = useState("");

  const placeValue = [1, 10, 100, 1000, 10000, 100000, 1000000];
  const pvLabelsArr = [
    [ "Thousands", "Ten Thousands", "Hundred Thousands" ],
    [ "Ones", "Tens", "Hundreds" ],
    [ "Tenths", "Hundredths", "Thousandths" ]
  ];
  const [pvLabels, setpvLabels] = useState(():any => []);

  // Once
  useEffect(() => {
    if (props.task !== undefined) {
      setExpandedForm("");
      disableRowOf("");
      setChart(props.chartValues);    // New/Reset Chart
      setValuesFn(props.chartValues); // 
      inpBox.current.value = "";      // RESET Big Input Box
      setValidation('');

      if (props.task['prefill']) {
        preFillValues(props.task['prefill'], props.task['number']);
      }

      if (props.mode === 'explore') {
        props.handleNextBtnsState(true);
      }
    }
  }, [props.task]);

  /**
   * Button Event passing from ButtonSet
   */
  useEffect(() => {
    if (props.clickEvent[1] !== '') {
      revealInFormat(props.clickEvent[1])
    };
  }, [props.clickEvent]);

  /**
   * 
   * While Quesition Mode - Pre-fill Place values based on Type - standard, chart
   */
  const preFillValues = (fill: string, num: any) => {
    let tmpNumber = num.replace(/,/g, "").split("");

    disableRowOf(fill);

    if (fill === 'chart') {
      for (let itr = 0; itr < values.length; itr++) {
        let elm: any = document.querySelector('input[data-index="' + (itr) + '"]');
        if (elm === null) return;
        elm.value = tmpNumber[itr];
      }
      setValues(tmpNumber);
    }
    if (fill === 'standard') {
      inpBox.current.value = num;
    }

  }

  /**
   * @param obj : chartValues Object
   * Getting and Setting: Decimal position in Front-End
   * Generating : Array of required inputs
   */
  const setValuesFn = (obj: any) => {
    let sum = 0, tempArr: any = [];
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const num = obj[key];

        if (key === 'decimals') {
          setDecimalPosition(num);
        };
        tempArr.push(num);
        sum += num;
      }
    }
    let arr: any = [];
    for (let index = 0; index < sum; index++) {
      arr.push('');
      let ss: any = document.querySelector('input[data-index="' + (index) + '"]');
      if (ss !== null) ss.value = ''; // Reset 1by1 input box
    }

    // pvLabelsArr    
    let ard = [];
    for (let fi = 0; fi < tempArr.length; fi++) {
      const n = tempArr[fi];

      for (let si = 0; si < n; si++) {
        const m = pvLabelsArr[fi];
        if(fi === 2){
          ard.push(m[si])
        } else {
          ard.push(m[n - (si+1)])
        }
      } 
    }
    setpvLabels(ard);
    

    setTotalValues(sum);
    setValues(arr);
  }

  /**
   * @param e : Event
   * allowchars : [] of allowed chars to be only input - Numbers in this case
   */
  const validateNumber = (e: KeyboardEvent<HTMLInputElement>) => {

    let allowchars = e.currentTarget.getAttribute("allowchars")?.split("");
    let inputValueLength = e.currentTarget.value.length;
    // let maxLength:any      = e.currentTarget.getAttribute("maxLength");
    //     maxLength = parseInt(maxLength);
    let currInputIndex: any = e.currentTarget.getAttribute("data-index");
    let nextInputItem: any = document.querySelector('input[data-index="' + (parseInt(currInputIndex) + 1) + '"]');
    let prevInputItem: any = document.querySelector('input[data-index="' + (parseInt(currInputIndex) - 1) + '"]');

    // if(e.which >= 48 && e.which <= 57);
    // console.log(e.currentTarget);
    let tempValues: any = [...values];

    if (checkKey(e.key, allowchars)) {
      e.preventDefault();

      if ((selection && inputValueLength === 1) || (inputValueLength === 0)) {
        tempValues[currInputIndex] = e.currentTarget.value = e.key;
        if (nextInputItem !== null) {
          nextInputItem.select();
        }

        onChangeFn('chart');
      }
    }
    else {
      // 37|38|39|40|
      if ('|6|8|9|37|38|39|40|46|116|'.indexOf('|' + e.keyCode + '|') === -1) { // Allow - Tab, Backspace, Delete
        e.preventDefault();
      }
    }

    if (e.code === "Backspace" || e.key === "Backspace" || e.code === "Delete" || e.key === "Delete") {
      e.preventDefault();
      tempValues[currInputIndex] = e.currentTarget.value = "";
      if (inputValueLength === 0) {
        if (prevInputItem !== null) { prevInputItem.select() }; // shift focus - backward
      }

      onChangeFn('chart');
    }

    setValues(tempValues);
  }

  /**
   * 
   * @param e : Event
   * allowchars : [] of allowed chars to be only input - Numbers + decimal in this case
   */
  const validateChars = (e: KeyboardEvent<HTMLInputElement>) => {

    let allowchars = e.currentTarget.getAttribute("allowchars")?.split("");
    let inpValue = inpBox.current.value;

    // Allow only one decimal
    if (inpValue.indexOf(".") > 0 && (e.which === 199 || e.key === ".")) {
      e.preventDefault();
      return;
    };

    // Restrict typing before and after decimal place value
    let tmpValues = inpValue.replace(/,/g, '');
    let beforeDecimal = tmpValues.split(".")[0];
    let afterDecimal = tmpValues.split(".")[1];
    if (
      // Before Decimal
      (
        beforeDecimal.length === (totalValues - decimalpos) && // limit before decimal
        e.which !== 190 && e.which !== 8 && e.which !== 9 && // NOT: decimal, backspace, tab
        tmpValues.indexOf(".") < 0 // allow only after decimal placed
      )
      ||
      // After decimal
      (
        afterDecimal && // not undefined
        afterDecimal.length === decimalpos && // limit after decimal
        e.which !== 8 && e.which !== 46 && e.which !== 9 //NOT: backspace, delete, tab
      )
    ) {
      e.preventDefault()
      return;
    }


    if (checkKey(e.key, allowchars)) {
      // e.preventDefault();
    }
    else {
      if ('|6|8|9|37|38|39|40|46|116|'.indexOf('|' + e.keyCode + '|') === -1) { // Allow - Tab, Backspace, Delete
        e.preventDefault();
      }
    }
  }

  /**
   * 
   * @param str 
   * @param type 
   */
  const standardForm = (str: string, type: string) => {
    // let val = str.split("");
    // console.log(val);
    // console.log(type); 
  }

  /**
   * revealInFormat = Reveal in format = standard, chart, expanded
   * @param type : string
   */
  const revealInFormat = (type: string) => {

    if (type === 'standard') {
      // IN case of Blank values
      let tmpValues: any = [...values];

      if (tmpValues.join("") === "") return; // while no user input

      let go = false;
      for (let index = 0; index < values.length; index++) {
        let vlu: any = values[index];
        let elm: any = document.querySelector('input[data-index="' + (index) + '"]');
        if (vlu > 0) go = true;
        if (vlu === "" && go) {
          tmpValues[index] = "0";
          elm.value = 0;
        }
      }

      inpBox.current.value = numericFormatWhole(tmpValues.join(""));
    }

    if (type === 'chart') {
      let userInput = inpBox.current.value;
      userInput = userInput.replace(/,/g, "");

      if (userInput === "") return; // while no user input        

      // Fill required before decimal => totalValues - decimalpos
      let beforeDecimal = userInput.split(".")[0].split("").reverse();
      let tmpArr = fillDiffInArr(beforeDecimal, totalValues - decimalpos, '');
      beforeDecimal = tmpArr.reverse();

      // Fill required after decimal => decimalpos
      let afterDecimal = userInput.split(".")[1];
      afterDecimal = fillDiffInArr(afterDecimal ? afterDecimal.split("") : [], decimalpos, "0");

      // Final array before putting on 1by1 places on chart
      let finalInput = beforeDecimal.concat(afterDecimal);

      let tempValues: any = finalInput;
      tempValues.length = totalValues;
      tempValues.forEach((ele: any, i: number) => {
        let element: any = document.querySelector('input[data-index="' + (i) + '"]');
        let newVal = finalInput[i] !== undefined ? finalInput[i] : ''; // FALLBACK
        if (element === null) return;
        element.value = newVal;
        tempValues[i] = newVal;
      });

      setValues(tempValues);
    }

    if (type === 'expanded') {
      let tmpVar: any = [...values];

      // If mode - question and prefill - standard/chart
      // if (props.task['prefill'] === 'standard') 
      if (props.task['prefill'] !== '') {
        tmpVar = (props.task['number']).replace(/,/g, "").split("")
      }

      let beforeDecimal = tmpVar.slice(0, totalValues - decimalpos);
      let afterDecimal = tmpVar.slice(totalValues - decimalpos, totalValues);
      let bd_reverseIntegersArr = beforeDecimal.reverse();
      let bd_arr = [], ad_arr = [];
      let bd_nstring = "", af_nstring = "";

      // Fill empty spots if-any
      let go = false;
      tmpVar.forEach((value: any, index: number) => {
        const elem: any = document.querySelector('input[data-index="' + (index) + '"]');
        if (value > 0) go = true;
        if (value === "" && go) elem.value = 0;
      });

      // BEFORE DECIMAL
      for (let index = 0; index < bd_reverseIntegersArr.length; index++) {
        const vl = bd_reverseIntegersArr[index];
        bd_arr.push(vl * placeValue[index]);
      }
      bd_arr = bd_arr.filter(function (x) { return x !== 0; }); // Filter out 0
      bd_arr.reverse();
      for (let index = 0; index < bd_arr.length; index++) {
        const n = numericFormatInteger(bd_arr[index]);
        bd_nstring += index === 0 ? n : " + " + n;
      }

      // AFTER DECIMAL
      for (let index = 0; index < afterDecimal.length; index++) {
        const vl = afterDecimal[index];
        ad_arr.push(vl / placeValue[index + 1]);
      }
      ad_arr = ad_arr.filter(function (x) { return x !== 0; }); // Filter out 0
      for (let index = 0; index < ad_arr.length; index++) {
        const n = ad_arr[index];
        af_nstring += index === 0 ? n : " + " + n
      }

      // Finally Extended Form
      setExpandedForm(bd_nstring + (af_nstring.length > 0 ? " + " + af_nstring : ""))
      setStateOfExpForm(true);
    }

    if (type === 'check') {
      let questionValue = parseInt((props.task['number']).replace(/,/g, ""));
      let answerByUser = 0;

      // If mode - question and prefill - standard
      if (props.task['prefill'] === 'standard') {
        answerByUser = parseInt(values.join(""));
      }
      if (props.task['prefill'] === 'chart') {
        answerByUser = parseInt((inpBox.current.value).replace(/,/g, ""));
      }

      (questionValue === answerByUser ? setValidation(true) : setValidation(false))

      props.handleNextBtnsState(true);

    }
  }

  // Adding "," - comma wheres require
  const numericFormatInteger = (param: any) => {
    const p = parseInt(param).toString();
    const breakapart = p.split("");
    let ii = breakapart.length;
    while ((ii -= 3) > 0) {
      breakapart.splice(ii, 0, ',')
    }
    return breakapart.join('')
  }

  const fillDiffInArr = (arr: any, required: number, fill: string) => {
    let tmpArr: any = [];
    for (let index = 0; index < required; index++) {
      if (arr[index] !== undefined) {
        tmpArr[index] = arr[index];
      } else {
        tmpArr.push(fill);
      }
    }
    return tmpArr;
  }

  /**
   * Formatting String as Currency/Numeric: 123,456.789
   * @param param : string
   * @returns currency string
   */
  const numericFormatWhole = (param: any) => {
    const p = parseInt(param).toString();
    const breakapart = p.split("");

    const beforeDecimal = breakapart.slice(0, breakapart.length - decimalpos);
    let afterDecimal: any = breakapart.slice(breakapart.length - decimalpos, breakapart.length);
    // afterDecimal = parseInt(afterDecimal.reverse().join(""));
    // afterDecimal = afterDecimal.toString().split("");
    // afterDecimal = afterDecimal.reverse();


    let ii = beforeDecimal.length;
    while ((ii -= 3) > 0) {
      beforeDecimal.splice(ii, 0, ',')
    }
    return beforeDecimal.join('') + (decimalpos > 0 ? ("." + afterDecimal.join('')) : '')
  }

  /**
   * On Key-Up
   * Formatting String as Currency/Numeric: 123,456.789
   */
  const onKeyUpFormat = () => {
    let tmpValues = inpBox.current.value;
    tmpValues = tmpValues.replace(/,/g, '');

    const breakapart = tmpValues.split(".");
    const beforeDecimal = breakapart[0].split("");
    const afterDecimal = breakapart[1];

    // setValues - started
    let bdArr: any = [], adArr: any = [];
    let rofbd = [...beforeDecimal].reverse();
    for (let i = 0; i < (totalValues - decimalpos); i++) {
      bdArr.push(rofbd[i] ? rofbd[i] : "");
    }

    for (let j = 0; j < decimalpos; j++) { adArr.push(""); } // pre fill decimal array

    if (afterDecimal) {
      let rofad = [...afterDecimal];
      for (let j = 0; j < decimalpos; j++) {
        adArr[j] = (rofad[j] ? rofad[j] : "");
      }
    }
    if (props.task['prefill'] === 'standard') return;
    setValues(bdArr.reverse().concat(adArr));
    // setValues - ended

    let ii = beforeDecimal.length;
    while ((ii -= 3) > 0) {
      beforeDecimal.splice(ii, 0, ',')
    }

    inpBox.current.value = beforeDecimal.join("") + (afterDecimal !== undefined ? ("." + afterDecimal) : "");
  }

  /**
   * @param key : value
   * @param chars : array
   * @returns boolean
   */
  const checkKey = (key: any, chars: any) => {
    let bool = false;
    if (chars.length) {
      for (var i = 0; i < chars.length; i++) {
        if (key === chars[i]) return bool = true;
      }
    }

    return bool;
  }

  /**
   * On Change - Input Value
   * Reset - vice / versa
   */
  const onChangeFn = (type: string) => {
    setStateOfExpForm(false); // every value change - hide expanded form
    setValidation(''); // every value change - hide feedback

    // IF by TYPE
    if (type === 'chart') {
      standardForm(values.join(""), type);

      if (props.task['prefill'] !== '') return;
      // RESET Big Input Box
      inpBox.current.value = "";
    }
    else {
      standardForm(inpBox.current.value, type);

      if (props.task['prefill'] !== '') return;
      // RESET 1by1 Input Boxes
      let tempValues: any = [...values];
      tempValues.forEach((ele: any, i: number) => {
        let element: any = document.querySelector('input[data-index="' + (i) + '"]')
        element.value = "";
        tempValues[i] = "";
      });

      setValues(tempValues);
    }
  }

  /**
   * Works in case of input type TEXT/TEXTAREA
   * selection: boolean
   */
  const onSelect = (event: any) => {
    const tempSelection = event.target.value.substring(event.target.selectionStart, event.target.selectionEnd)
    selection = tempSelection.length > 0 ? true : false;
  }

  /**
   * Devices detection
   */
  var isMobile = {
    Android: function () {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
      // alert(navigator.userAgent.match(/iPhone/i))
      return navigator.userAgent.match(/iPhone/i);
    },
    iPAD: function () {
      return navigator.userAgent.match(/iPad|iPod|Macintosh/i);
    },
    Opera: function () {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
      return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
      return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.iPAD() || isMobile.Opera() || isMobile.Windows());
    }
  };

  const [insactive, setInsActive] = useState(false);

  return (
    <>
      <div className="pvChart">

        {
          (props.instruction && props.instruction !== "") &&
          <div className={"ins_container" + (insactive ? ' active' : '')} tabIndex={0} onFocus={()=>setInsActive(true)} onBlur={()=>setInsActive(false)}>
            <img src={process.env.PUBLIC_URL + '/static/images/technical-hover.svg'} alt="info" aria-hidden="true" />
            <div className="ins_content" dangerouslySetInnerHTML={{__html: props.instruction}}></div>
          </div>
        }

        {
          (props.quaudio && props.quaudio !== "") &&
          <QuesAud quesAudio={props.quaudio} task={props.task} ins={props.instruction} />
        }
        <p className="ins_top">
          <span dangerouslySetInnerHTML={{
            __html:
              props.task ?
                (
                  props.task['question'] ?
                    props.task['question'][props.language]
                    :
                    (props.langLabels['chartLabels'] ? props.langLabels['chartLabels']['insTop'] : '')
                )
                :
                (props.langLabels['chartLabels'] ? props.langLabels['chartLabels']['insTop'] : '')
          }}
          >
            {/* {props.langLabels['chartLabels'] ? props.langLabels['chartLabels']['insTop'] : ''} */}
          </span>
        </p>

        <table cellPadding="0" cellSpacing="0" className={"tb_" + values.length} role="presentation">
          <thead>
            {/* HEAD LABELS */}
            {
              (props.task && !props.task['hideHeadings']) &&
              <tr>
                {
                  (chartValues['thousands'] > 0) &&
                  <td colSpan={chartValues['thousands']} className="thead">
                    {props.langLabels['chartLabels'] ? props.langLabels['chartLabels']["heads"]['thousands'] : ''}
                  </td>
                }
                {
                  (chartValues['ones'] > 0) &&
                  <td colSpan={chartValues['ones']} className="ohead">
                    {props.langLabels['chartLabels'] ? props.langLabels['chartLabels']["heads"]['ones'] : ''}
                  </td>
                }
                {
                  (chartValues['decimals'] > 0) &&
                  <td colSpan={chartValues['decimals']} className="dhead">
                    {props.langLabels['chartLabels'] ? props.langLabels['chartLabels']["heads"]['decimals'] : ''}
                  </td>
                }
              </tr>
            }
          </thead>
          <tbody>
            {/* LABELS GENERATION */}
            <tr className={"head_" + (props.task && !props.task['hideHeadings'])}>
              {
                // THOUSANDS
                Array.from(Array(chartValues['thousands']), (e, i) => {
                  let Length = chartValues['thousands'];
                  return (
                    (props.langLabels['chartLabels']) &&
                    <td key={i} className={"t_" + (3 - i)}>
                      <span>{props.langLabels['chartLabels']['thousands'][(Length - 1) - i]}</span>
                    </td>
                  )
                })
              }

              {
                // ONES
                Array.from(Array(chartValues['ones']), (e, i) => {
                  let Length = chartValues['ones'];
                  return (
                    (props.langLabels['chartLabels']) &&
                    <td key={i} className={"o_" + (i + 1)}>
                      <span>{props.langLabels['chartLabels']['ones'][(Length - 1) - i]}</span>
                    </td>
                  )
                })
              }

              {
                // DECIMALS
                Array.from(Array(chartValues['decimals']), (e, i) => {
                  return (
                    (props.langLabels['chartLabels']) &&
                    <td key={i} className={"d_" + (i + 1)}>
                      <span>{props.langLabels['chartLabels']['decimals'][i]}</span>
                    </td>
                  )
                })
              }

            </tr>

            {/* INPUTS GENERATION */}
            <tr className={"inputsRow " + (disableRow === 'chart' ? 'pnone' : '')}>
              {
                values.map((e, i) => {
                  let ei = values.length - decimalpos - i;
                  let dptrue = (values.length - i) === decimalpos;
                  let commaTrue = (values.length - decimalpos - i) % 3 === 0
                  return (
                    <td key={i} className={
                      "t_" + (ei) + " " +
                      (dptrue ? "dpoint" : "") +
                      (commaTrue && ei !== 0 && i !== 0 ? 'comma' : '')
                    }
                    >
                      <input
                        type="text" inputMode="numeric" maxLength={1}
                        defaultValue={values[i]} data-index={i} {...allowNumbers}
                        autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
                        onChange={() => { }} onSelect={onSelect} onKeyDown={validateNumber}
                        placeholder=""
                        tabIndex={(props.task && props.task['prefill'] === 'chart') ? -1 : 0}
                        aria-label={"Place value for " + (pvLabels[i]) + "."}
                      />
                    </td>
                  )
                })
              }
            </tr>

          </tbody>
        </table>

        {
          (props.task && props.task['prefill'] === '') &&
          <p className="ins_Bottom">
            {props.langLabels['chartLabels'] ? props.langLabels['chartLabels']['insBottom'] : ''}
          </p>
        }

        <div className={"sf_input_box " + ((props.task && props.task['prefill'] !== '') ? 'padTop40' : '')}>
          <input
            ref={inpBox} type="text"
            inputMode="decimal" {...allowChars}
            autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
            onChange={() => onChangeFn('standard')} onSelect={onSelect} onKeyDown={validateChars}
            onKeyUp={onKeyUpFormat}
            className={disableRow === 'standard' ? 'pnone' : ''}
            placeholder=" "
            tabIndex={(props.task && props.task['prefill'] === 'standard') ? -1 : 0}
            aria-label={"Enter the standard form."}
          />
        </div>

        { /* (showExpForm) && */ }
        <div className="expandedform" aria-live="polite" role="region">
          {showExpForm ? expandedform : ''}
        </div>

        <div className="feedbackBlock" aria-live="polite" role="status">
          <span className={"ic_" + validation}></span>
          {(validation === true) ? 'Correct' : ''}
          {(validation === false) ? 'Try again' : ''}
        </div>

      </div>

    </>
  )
}

export default Chart;
