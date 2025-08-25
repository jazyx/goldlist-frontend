/**
 * frontend/src/components/FullScreen.jsx
 * 
 * SVG needs to be inline, not an external image, so that its
 * classes and path elements are accessible via CSS.
 */


import React from 'react'


export const FullScreen = () => {
  const toggleFullScreen = () => {
    
    const page = document.documentElement;

    if (!document.fullscreenElement) {
      if (page.requestFullscreen) {
          page.requestFullscreen();
      } else if (page.mozRequestFullScreen) {
          page.mozRequestFullScreen();
      } else if (page.webkitRequestFullScreen) {
          page.webkitRequestFullScreen();
      } else if (page.msRequestFullscreen) {
          page.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(()=>{});
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen().catch(()=>{});
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen().catch(()=>{});
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen().catch(()=>{});
      }
    }
  }

  const isIOS = (() => {
    var iosQuirkPresent = function () {
        var audio = new Audio();

        audio.volume = 0.5;
        return audio.volume === 1;
        // volume cannot be changed from "1" on iOS 12 and below
    };

    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    var isAppleDevice = navigator.userAgent.includes('Macintosh');
    var isTouchScreen = navigator.maxTouchPoints >= 1;   // true for iOS 13 (and hopefully beyond)

    return isIOS || (isAppleDevice && (isTouchScreen || iosQuirkPresent()));
  })();

  if (isIOS) {
    return ""
  } 
  
  return (
    <button
      className="full-screen"
      onClick={toggleFullScreen}
    >
      <svg
        xmlns="http://www.w3.org/2100/svg"
        viewBox="0 0 100 100"

        fill="#000"
      >

        <rect
          width="100"
          height="100"
          opacity="0"
        />

        <path
          className="collapse"
          d="
            M 45 55
            v 27
            a 5 5 0 0 1 -10 0
            v -10
            l -21 21
            a 5 5 0 0 1 -7.07 -7.07
            l 21 -21
            h -10
            a 5 5 0 0 1 0 -10
            Z

            M 55 45
            v -27
            a 5 5 0 0 1 10 0
            v 10
            l 21 -21
            a 5 5 0 0 1 7.07 7.07
            l -21 21
            h 10
            a 5 5 0 0 1 0 10
            Z
          "
        />

        <path
          className="expand"
          d="
            M 95 5
            v 27
            a 5 5 0 0 1 -10 0
            v -10
            l -21 21
            a 5 5 0 0 1 -7.07 -7.07
            l 21 -21
            h -10
            a 5 5 0 0 1 0 -10
            Z

            M 5 95
            v -27
            a 5 5 0 0 1 10 0
            v 10
            l 21 -21
            a 5 5 0 0 1 7.07 7.07
            l -21 21
            h 10
            a 5 5 0 0 1 0 10
            Z
          "
        />
      </svg>
    </button>
  )
}