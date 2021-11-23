import React, { useState, useEffect, useRef } from 'react';
function QuesAud(props: any) {

  /* eslint-disable react-hooks/exhaustive-deps */

  const [quesAudio, setAudio] = useState('')
  const qaudioElem = useRef<HTMLAudioElement>(null);
  const [qaudioPlaying, setQaudioPlaying] = useState(false);

  const playAudio = () => {
    if (qaudioElem.current === null) return
    if (qaudioElem.current.duration > 0 && !qaudioElem.current.paused) {
      qaudioElem.current.pause();
      setQaudioPlaying(false)

    } else {
      qaudioElem.current.play();
      setQaudioPlaying(true)
    }
  }

  const onPausedFn = () => {
    setQaudioPlaying(false)
  }

  useEffect(() => {
    setQaudioPlaying(false)
    setAudio(props.quesAudio)
  }, [props.task])

  return (
    <>
      {
        (quesAudio !== '') &&
        <div id="audioicon"
          className={props.ins === "" ? 'set' : ''}
          tabIndex={0} aria-label="Select to listen question."
          onClick={playAudio} role="button"
          onKeyPress={(e)=>{ if(e.code === 'Space' || e.code === 'Enter') { playAudio() }}}
        >
          {
            (qaudioPlaying) &&
            <img id="imageid" alt="" src={process.env.PUBLIC_URL + '/static/images/audio_icon.png'} />
          }
          {
            (!qaudioPlaying) &&
            <img id="imageid" alt="" src={process.env.PUBLIC_URL + '/static/images/mute_audio_icon.png'} />
          }

          <audio ref={qaudioElem} id="qAudioId" onPause={onPausedFn} src={'static/' + quesAudio} /></div>
      }
    </>
  )
}

export default QuesAud;
