import React, { useState, useRef, useEffect, useCallback } from 'react';

let isMouseDown = false;
let mouseMoveSeekDelay = false;
let mouseUpSeekDelay = false;

export default function SeekBar(props) {
  const { trackProgress, totalDuration, seekBarScrub, audioRef } = props;
  const [userIsSeeking, setSeeking] = useState(false);
  const seekBarRef = useRef(null);
  const mouseUpSeekDelayTimeoutRef = useRef(null);

  useEffect(() => {
    document.body.addEventListener('mouseup', handleMouseUp);
    document.body.addEventListener('mousemove', handleMouseMove);
  });

  const handleMouseUp = useCallback(
    (e) => {
      e.preventDefault();
      if (isMouseDown) {
        setSeeking((isSeeking) => !isSeeking);
        isMouseDown = false;
        mouseMoveSeekDelay = false;
        audioRef.current.muted = false;
        if (!mouseUpSeekDelay) {
          seekBarScrub(e.clientX, seekBarRef.current.offsetWidth);
        }
      }
    },
    [audioRef]
  );

  const handleMouseMove = useCallback(
    (e) => {
      e.preventDefault();
      if (isMouseDown && mouseMoveSeekDelay) {
        audioRef.current.muted = true;
        setTimeout(() => {
          mouseMoveSeekDelay = true;
          seekBarScrub(e.clientX, seekBarRef.current.offsetWidth);
        }, 60);
        mouseMoveSeekDelay = false;
      }
    },
    [audioRef]
  );

  return (
    <div
      ref={seekBarRef}
      className="seek-bar-wrapper"
      onMouseDown={(e) => {
        if (e.buttons === 1) {
          e.preventDefault();
          setSeeking((userIsSeeking) => !userIsSeeking);
          isMouseDown = true;
          mouseMoveSeekDelay = true;
          seekBarScrub(e.clientX, seekBarRef.current.offsetWidth);
          mouseUpSeekDelay = true;
          mouseUpSeekDelayTimeoutRef.current = setTimeout(
            () => (mouseUpSeekDelay = false),
            100
          );
        }
      }}
    >
      <div
        className={userIsSeeking ? 'seek-bar currently-seeking' : 'seek-bar'}
        style={{ width: `${(trackProgress / totalDuration) * 100}%` }}
      ></div>
    </div>
  );
}
//redundant code that doesn't allow seeking outside of "seek-bar-wrapper"
//container div
//
// onMouseMove={(e) => {
//   e.preventDefault();
//   e.stopPropagation();
//   if (isMouseDown && mouseMoveCaptureDelay) {
//     audioRef.current.muted = true;
//     setTimeout(() => {
//       setMouseMoveCaptureDelay(true);
//       seekBarScrub(e.clientX, seekBarRef.current.offsetWidth);
//       clearTimeout(unsetMouseDownTimeoutRef.current);
//     }, 50);
//     unsetMouseDownTimeoutRef.current = setTimeout(() => {
//       setMouseDown(false);
//       audioRef.current.muted = false;
//     }, 2000);
//     //will be set true after 50ms
//     setMouseMoveCaptureDelay(false);
//   }
// }}
// onMouseUp={(e) => {
//   console.log('mouseup');
//   e.preventDefault();
//   setMouseDown(false);
//   setMouseMoveCaptureDelay(false);
//   seekBarScrub(e.clientX, seekBarRef.current.offsetWidth);
//   audioRef.current.muted = false;
// }}
