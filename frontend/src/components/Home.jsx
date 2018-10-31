import React, { Component } from "react";
import PostDisplay from "./post/postDisplay";
import decode from "jwt-decode";
import "./css/Home.css";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
		userProfile: []
	};
  }
  
  getToken() {
    // Retrieves the user token jwt from localStorage
    return localStorage.getItem("jwt");
  }
  
  getProfile() {
    // Using jwt-decode npm package to decode the token
    return decode(this.getToken());
  }

  componentDidMount() {
    let jwt = localStorage.getItem("jwt");
    if (jwt == undefined || jwt == null) {
      //if the user not logged in
      this.props.history.replace("/login"); //go login
    } else { // if is logged in, get user profile
		try {
			const profile = this.getProfile();
			this.setState({
				userProfile: profile
			});
		} catch (err) {
          localStorage.removeItem("jwt"); //if an error occurs while decoding jwt token, logout
          this.props.history.replace("/login");
        }
	}
  }

  showLeftColumn() {
    return (
      <div class="column">
        <div class="card">
          <center>
            <img
              src={require("./images/profile.png")}
              alt="Profile"
              className="img1"
            />
          </center>
          <div class="container">
            <h2>{this.state.userProfile.firstname} {this.state.userProfile.lastname}</h2>
            <p class="title">Parent A</p>
            <p>Successfully decoded the JWT Token</p>
            <p>{this.state.userProfile.email}</p>
          </div>
        </div>

        <div class="card">
          <center>
            <img
              src={require("./images/cal.jpg")}
              alt="Calendar"
              className="img1"
            />
          </center>
          <div class="container">
            <h2>Calendar</h2>
            <p class="title">2018-2019</p>
            <p>Some text that describes</p>
            <p>Academic calendar</p>
          </div>
        </div>
      </div>
    );
  }

  showMiddleColumn() {
    return (
      <div class="column2">
        <div class="card">
          <div id="con" class="containernode">
            <PostDisplay />
          </div>
        </div>
        <div class="card">
          <center>
            <img
              src={require("./images/welcome.jpg")}
              alt="Welcome"
              className="img2"
            />
          </center>
          <div class="container">
            <h2>{this.state.userProfile.firstname} {this.state.userProfile.lastname}</h2>
            <p class="title">Parent A</p>
            <p>Some text that describes</p>
            <p>{this.state.userProfile.email}</p>
          </div>
        </div>
      </div>
    );
  }

  showRightColumn() {
    return (
      <div class="column3">
        <div class="card">
          <center>
            <img
              src={require("./images/profile.png")}
              alt="Profile"
              className="img1"
            />
          </center>
          <div class="container">
            <h2>Child Name A </h2>
            <p class="title">Class A</p>
            <p>Some text that describes</p>
            <p>example@example.com</p>
          </div>
        </div>
        <div class="card">
          <div class="container">
            <h2>Announcement</h2>
            <p class="title">Midterm</p>
            <p>Some text that describes</p>
            <p>Midterms are next week</p>
          </div>
        </div>
      </div>
    );
  }

  showLogoutButton() {
    let token = localStorage.getItem("jwt")
    if (token !== undefined && token !== null) {
      return (
        <div className="logoutButton">
          <button
            className="btn btn-success"
            onClick={() => this.handleLogout()}
          >
            Logout
          </button>
        </div>
      );
    }
  }

  handleLogout = () => {
    localStorage.removeItem("jwt");
    this.props.history.replace("/login");
  };

  render() {
    return (
      <React.Fragment>
        {this.showLogoutButton()}
        {this.showLeftColumn()}
        {this.showMiddleColumn()}
        {this.showRightColumn()}
        <div className="Home">
          <div className="lander" />
        </div>
      </React.Fragment>
    );
  }
}

export default Home;
