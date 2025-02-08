import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRouter, Footer, Header } from "./components";

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
