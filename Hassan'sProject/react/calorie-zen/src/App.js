import React from "react";
import "./App.css";
import AppHeader from "./components/AppHeader";
import AppMain from "./components/AppMain";
import InfoForm from "./components/InfoForm";
function App() {
  return (
    <div>
      <AppHeader />
      <AppMain />
      <InfoForm />
    </div>
  );
}

export default App;
