import { useState, useMemo } from "react";
import { AppConUseMemo } from "./pages/conUseMemo";
import { AppSinUseMemo } from "./pages/sinUseMemo";
import "./App.css";

function App() {
  return (
    <>
      <AppSinUseMemo></AppSinUseMemo>
      <AppConUseMemo></AppConUseMemo>
    </>
  );
}

export default App;
