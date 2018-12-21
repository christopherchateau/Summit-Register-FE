import React, { Component } from "react";
import PropTypes from "prop-types";
import logo from "../utilities/Images/logo.png";
import "./RegisterForm.css";

class RegisterForm extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      hometown: "",
      comments: ""
    };
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.handleLogUpdate(this.state);
  };

  render() {
    const { name, hometown, comments } = this.state;
    return (
      <div className="RegisterForm">
        <header className="header">
          <button className="back-btn" onClick={this.props.handleBackButton}>
            Back
          </button>
          <img className="logo-small" alt="logo" src={logo} />
        </header>
        <form className="register-form">
          <h3 className="form-instructions">
            Name:
            <input
              className="input"
              value={name}
              name="name"
              onChange={this.handleChange}
            />
          </h3>
          <h3 className="form-instructions">
            Hometown:
            <input
              className="input"
              value={hometown}
              name="hometown"
              onChange={this.handleChange}
            />
          </h3>
          <h3 className="form-instructions">
            Comments:
            <textarea
              className="input"
              value={comments}
              name="comments"
              onChange={this.handleChange}
            />
          </h3>
        </form>
        <button
          className="submit-btn"
          type="submit"
          onClick={this.handleSubmit}
        >
          Submit
        </button>
      </div>
    );
  }
}

RegisterForm.propTypes = {
  currentDisplay: PropTypes.string,
  handleBackButton: PropTypes.func,
  handleLogUpdate: PropTypes.func
};
export default RegisterForm;
