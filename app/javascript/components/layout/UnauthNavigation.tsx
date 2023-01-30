import * as React from "react";

import { Routes, Route } from "react-router-dom";

import Login from "../Login/Login";

function UauthNavigation() {
  return (
    <Routes>
      <Route path="/users/sign_in" element={<Login />} />
      <Route path="/users/sign_up" element={<Login />} />
    </Routes>
  );
}

export default UauthNavigation;
