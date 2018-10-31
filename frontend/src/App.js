import React, { Component } from "react";
import "./App.css";
import Routes from "./Routes";
import Home from "./components/Home";

class App extends Component {
  constructor(props) {
    super();
    this.infos = new Home();
  }

  showNavBarInfoWhenLoggedOutLogin() {
    let token = localStorage.getItem("jwt")
    if (token === undefined && token === null) {
      //if the user is logged in, show infos
      return (
        <li class="nav-item">
          <a class="nav-link" href="/login">
            Login
          </a>
        </li>
      );
    }
  }

  showNavBarInfoWhenLoggedOutSignup() {
    let token = localStorage.getItem("jwt")
    if (token === undefined && token === null) {
      //if the user is logged in, show infos
      return (
        <li class="nav-item">
          <a class="nav-link" href="/signup">
            Signup
          </a>
        </li>
      );
    }
  }

  showNavBarInfoWhenLoggedInProfile() {
    let token = localStorage.getItem("jwt")
    if (token !== undefined && token !== null) {
      //if the user is logged in, show infos
      return (
        <li class="nav-item">
          <a class="nav-link" href="/profile">
            Profile
          </a>
        </li>
      );
    }
  }

  showNavBarInfoWhenLoggedInMessages() {
    let token = localStorage.getItem("jwt")
    if (token !== undefined && token !== null) {
      //if the user is logged in, show infos
      return (
        <li class="nav-item">
          <a class="nav-link" href="/threads">
            Messages
          </a>
        </li>
      );
    }
  }

  showNavBarInfoWhenLoggedInGroups() {
    let token = localStorage.getItem("jwt")
    if (token !== undefined && token !== null) {
      //if the user is logged in, show infos
      return (
        <li class="nav-item">
          <a class="nav-link" href="/groups">
            Groups
          </a>
        </li>
      );
    }
  }

  showUserInfo() {
    let token = localStorage.getItem("jwt")
    if (token !== undefined && token !== null) {
      //if the user is logged in, show infos
      return (
        <span class="navbar-text float-xs-right ml-auto">
          Welcome back !
        </span>
      );
    }
  }

  render() {
    return (
      <div className="App cotainer">
        <nav class="navbar navbar-expand-lg navbar-light bg-secondary">
          <a className="navbar-brand" href="/">
            Edge
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item active">
                <a class="nav-link" href="/">
                  Home <span className="sr-only">(current)</span>
                </a>
              </li>
              {this.showNavBarInfoWhenLoggedOutSignup()}
              {this.showNavBarInfoWhenLoggedOutLogin()}
              {this.showNavBarInfoWhenLoggedInProfile()}
              {this.showNavBarInfoWhenLoggedInMessages()}
              {this.showNavBarInfoWhenLoggedInGroups()}
              {}
            </ul>
            {this.showUserInfo()}
          </div>
        </nav>
        <center>
          <h1>Edge</h1>
          <p>A simple parent-teacher communication</p>
        </center>
        <Routes />
      </div>
    );
  }
}

export default App;
