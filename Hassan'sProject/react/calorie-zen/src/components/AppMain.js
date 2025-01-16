import React from "react";
import "./AppMain.css";
import FoodAdder from "./FoodAdder";

function AppMain() {
  return (
    <div className="container">
      <p>Energy Consumed:</p>
      <p>Add some food</p>
      <FoodAdder />
    </div>
  );
}

export default AppMain;
