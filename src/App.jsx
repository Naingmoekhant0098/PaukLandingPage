import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./component/Pages/Home";
import Policy from "./component/Pages/Policy";
import MainLayout from "./component/Layout/MainLayout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout >
        <Home />
      </MainLayout>} />
      <Route path="/policy" element={<MainLayout >
        <Policy />
      </MainLayout>} />
    </Routes>
   
  );
}

export default App;
