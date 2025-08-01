import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./component/Pages/Home";
import Policy from "./component/Pages/Policy";
import MainLayout from "./component/Layout/MainLayout";
// import Test from "./component/Pages/Test";
import Gallery from "./component/Pages/Gallery";
function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout >
        <Home />
      </MainLayout>} />
      <Route path="/generate-image" element={
        <Gallery />
      } />
      <Route path="/policy" element={<MainLayout >
        <Policy />
      </MainLayout>} />
    </Routes>
   
  );
}

export default App;
