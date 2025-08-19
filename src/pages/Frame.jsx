/**
 * src/Routes/Frame.jsx
 */


import { Outlet } from "react-router-dom";

export const Frame = () => {
  return (
    <div id="frame">
      <div id="gold-bar"></div>
      <div id="outlet">
        <Outlet />
      </div>
    </div>
  );
};
