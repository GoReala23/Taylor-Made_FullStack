// InfoForm.js

import React from "react";
import "./InfoForm.css";

class InfoForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
    };
  }

  handleSubmit = () => {
    this.setState({ submitted: true });
  };

  handleChange = (evt) => {
    this.setState({ userEmail: evt.target.value });
  };

  render() {
    if (this.state.submitted) {
      return (
        <p className="infoForm-text">
          Thanks. When the kingdom of comfort opens, we'll be in touch!
        </p>
      );
    } else {
      return (
        <div className="infoForm-container">
          <p className="infoForm-text">
            Sign up below and we'll let you know when we launch the next great
            mattress experience!
          </p>
          <form onSubmit={this.handleSubmit} className="infoForm-form">
            <input
              onChange={this.handleChange}
              className="infoForm-input"
              type="email"
              placeholder={"Enter your email here"}
            />
            <button className="infoForm-button" type="submit">
              Amaze me!
            </button>
          </form>
        </div>
      );
    }
  }
}

export default InfoForm;
