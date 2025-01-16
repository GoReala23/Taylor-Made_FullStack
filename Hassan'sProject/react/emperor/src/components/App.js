import React from "react";
import logo from "../logo.svg";
import Header from "../landing/Header";
import Bed from "../landing/Bed";
import InfoForm from "../landing/InfoForm";

function App() {
  return (
    <div className="App">
      <Header /> {/*This add the Header componet */}
      <Bed /> {/*This add the Bed componet */}
      <InfoForm />
    </div>
  );
}

export default App;
