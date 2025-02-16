import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRouter, Footer, Header } from "./components";
import "./css/app.css";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <AppRouter />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
