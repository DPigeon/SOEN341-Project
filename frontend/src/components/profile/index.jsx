import React, { Component } from "react";
import Home from "../Home";
import Popup from "reactjs-popup";
import decode from "jwt-decode";
import PostDisplay from "../post/postDisplay";
import Parser from "html-react-parser";
import "./styles/profile.css";

//your profile page

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.infos = new Home();
    this.state = {
      users: [],
      userProfile: [],
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      isTeacher: false,
      selectedFile: null,
      items: [],
      posts: [],
      arrayComments: [],
      arrayLikes: [],
      arrayDislikes: [],
      fileProfile: null,
      fileCover: null
    };
  }

  componentDidMount() {
    const { emailName } = this.props.match.params; //gets the username from the url
    this.setState({
      email: emailName
    });
    let jwt = localStorage.getItem("jwt");
    if (jwt === undefined || jwt === null) {
      //if the user not logged in
      this.props.history.replace("/login"); //go login
    } else {
      // if is logged in, get user profile
      this.decodeJwtToken();
    }
    //To finish profiles, we need the backend now to GET /signup or /users or whatever to be able to show any profiles

    fetch(`http://localhost:8000/users`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        jwt: localStorage.getItem("jwt")
      }
    })
      .then(res => res.json())
      .then(json => {
        this.setState({
          users: json //stores the user info of that page url into an array to get the info easily
        });
        this.loadMembers(json);
      });
  }

  loadMembers(users) {
    var newArray = [];
    for (var i = 0; i < users.length; i++) {
      if (this.props.match.params.email === users[i].email) {
        newArray = users[i];
      }
    }
    fetch(`http://localhost:8000/posts/${newArray.email}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        jwt: localStorage.getItem("jwt")
      }
    })
      .then(res => res.json())
      .then(json => {
        this.setState({
          posts: json //stores the user info of that page url into an array to get the info easily
        });
      });
  }

  showPostsByUser() {
    if (this.state.posts.postList !== undefined) {
      return (
        <div className="card">
          <div className="posttext">
            {this.state.posts.postList.reverse().map((item, id) => (
              <div className="cardmessage" key={id}>
                <h5>
                  <div className="messagefrom">
                    Post of
                    <a href={"/user/" + item.author_email}>
                      {" "}
                      {item.author_email}
                    </a>
                  </div>
                </h5>
                <div className="itemmsg">
                  <p className="mess">{Parser(item.data)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
  }

  decodeJwtToken() {
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

  getToken() {
    // Retrieves the user token jwt from localStorage
    return localStorage.getItem("jwt");
  }

  getProfile() {
    // Using jwt-decode npm package to decode the token
    return decode(this.getToken());
  }

  getTeacher() {
    var labelTeacher = "";
    if (this.findTheUserToShow().is_teacher === 0) {
      //if it is not a teacher
      labelTeacher = "Parent";
    } else {
      labelTeacher = "Teacher";
    }
    return labelTeacher;
  }

  changeFirstName = event => {
    this.setState({
      firstName: event.target.value
    });
  };

  changeLastName = event => {
    this.setState({
      lastName: event.target.value
    });
  };
  onSubmit = (firstname, lastname, email) => {
    if (firstname !== "" && lastname !== "") {
      fetch("http://localhost:8000/user", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          jwt: localStorage.getItem("jwt")
        },
        body: JSON.stringify({
          email: email,
          firstname: firstname,
          lastname: lastname
        })
      });
      window.location.reload();
    } else {
      alert("Fill in the fields please.");
    }
  };

  showUpdateInfoButton() {
    if (this.state.userProfile.email === this.props.match.params.email) {
      // if the email on jwt matches the email on the user/url
      return <button className="editpic"> Update Info </button>;
    } else {
    }
  }

  //to use the following above, you do {findTheUserToShow().email, .lastname, .firstname, etc}
  findTheUserToShow() {
    //Finds the user profile (array) on the database and outputs an array of the user to show
    var newArray = [];
    for (var i = 0; i < this.state.users.length; i++) {
      if (this.props.match.params.email === this.state.users[i].email) {
        newArray = this.state.users[i];
      }
    }
    return newArray;
  }

  handleUploadProfile = () => {
    if (this.state.fileProfile != null) {
      let imageProfile = this.state.fileProfile;
      const data = new FormData();
      data.append("myimage", imageProfile);
      fetch("http://localhost:8000/images", {
        method: "POST",
        headers: {
          profile_pic: true,
          jwt: localStorage.getItem("jwt")
        },
        onUploadProgress: progressEvent => {
          console.log(
            "Upload Progress: " + progressEvent.loaded / progressEvent.total
          );
        },
        body: data
      }).then(res => {
        console.log(res);
      });
      window.location.reload();
    }
  };

  handleProfilePic = event => {
    this.setState({ fileProfile: event.target.files[0] });
  };

  handleUploadCover = () => {
    if (this.state.fileCover != null) {
      let imageCover = this.state.fileCover;
      const data = new FormData();
      data.append("myimage", imageCover);
      fetch("http://localhost:8000/images", {
        method: "POST",
        headers: {
          cover_pic: true,
          jwt: localStorage.getItem("jwt")
        },
        onUploadProgress: progressEvent => {
          console.log(
            "Upload Progress: " + progressEvent.loaded / progressEvent.total
          );
        },
        body: data
      }).then(res => {
        console.log(res);
      });
      window.location.reload();
    }
  };

  handleCoverPic = event => {
    this.setState({ fileCover: event.target.files[0] });
  };

  showProfilePic() {
    if (this.findTheUserToShow().profile_pic != null) {
      return (
        <div>
          <img
            src={`http://localhost:8000/images/${
              this.findTheUserToShow().profile_pic
            }`}
            alt="profile"
            className="pp"
          />
        </div>
      );
    } else {
      return (
        <div>
          <img
            src={require("./images/profile.png")}
            alt="profile"
            className="pp"
          />
        </div>
      );
    }
  }

  showCoverPic() {
    if (this.findTheUserToShow().cover_pic != null) {
      return (
        <div>
          <img
            src={`http://localhost:8000/images/${
              this.findTheUserToShow().cover_pic
            }`}
            alt="Welcome"
            className="banner"
          />
        </div>
      );
    } else {
      return (
        <div>
          <img
            src={require("./images/banner.jpg")}
            alt="Welcome"
            className="banner"
          />
        </div>
      );
    }
  }

  render() {
    const modalStyle = {
      width: "500px"
    };
    return (
      <React.Fragment>
        <div className="profilecontainer">
          <div className="imagecontainer">
            {this.showProfilePic()}
            <Popup
              contentStyle={modalStyle}
              trigger={this.showUpdateInfoButton()}
              modal
              closeOnDocumentClick
            >
              <div className="editcontainer">
                <div className="profile">
                  <h4>
                    <b>Edit your profile</b>
                  </h4>
                  <br />
                  <div className="mod">
                    <b>First Name</b> <br />
                    <input
                      id="firstname"
                      name="firstname"
                      value={this.state.firstName}
                      placeholder="First Name"
                      onChange={this.changeFirstName}
                    />
                  </div>
                  <br />
                  <br />
                  <div className="mod">
                    <b> Last Name </b> <br />
                    <input
                      id="lastname"
                      className=""
                      name="lastname"
                      value={this.state.lastName}
                      placeholder="Last Name"
                      onChange={this.changeLastName}
                    />
                  </div>
                  <br />
                  <br />
                  <div className="mod">
                    <b>Email </b>
                    <br />
                    <input
                      id="email"
                      className=""
                      name="email"
                      placeholder="Email"
                      value={this.state.userProfile.email}
                    />
                  </div>
                  <br />
                  <br />
                  <button
                    className="uploadbutton"
                    onClick={() =>
                      this.onSubmit(
                        this.state.firstName,
                        this.state.lastName,
                        this.state.userProfile.email
                      )
                    }
                  >
                    Update Informations
                  </button>

                  <br />

                  <div className="imageedit">
                    <b>Profile Picture</b>
                    <input
                      type="file"
                      name="profile_pic"
                      id="fileId1"
                      onChange={this.handleProfilePic}
                    />
                    <label for="fileId1" className="choosebutton">
                      Choose a File...
                    </label>
                  </div>
                  <br />
                  <br />
                  <br />
                  <button
                    className="uploadbutton"
                    onClick={this.handleUploadProfile}
                  >
                    Update Profile Picture
                  </button>

                  <br />
                  <div className="imageedit">
                    <b>Banner Picture</b>

                    <input
                      type="file"
                      name="cover_pic"
                      id="fileId2"
                      onChange={this.handleCoverPic}
                    />
                    <label for="fileId2" className="choosebutton">
                      Choose a File...
                    </label>
                    <br />
                    <br />
                  </div>
                  <br />
                  <button
                    className="uploadbutton"
                    onClick={this.handleUploadCover}
                  >
                    Update Banner
                  </button>
                </div>
              </div>
            </Popup>
            <h3>
              {this.findTheUserToShow().firstname}{" "}
              {this.findTheUserToShow().lastname}
              <br />
              <h5>{this.getTeacher()}</h5>
              <h6>
                <a href={"/threads?toMsg=" + this.props.match.params.email}>
                  {this.props.match.params.email}
                </a>
              </h6>
              <br />
            </h3>
            {this.showCoverPic()}
          </div>
          <br />
          <br />
          <br />
          <br />

          <div className="picbox">
            <h2>Pictures</h2>
            <img
              src={require("./images/image1.jpg")}
              alt="img"
              className="pic"
            />
            <img
              src={require("./images/image2.jpg")}
              alt="img"
              className="pic"
            />
            <img
              src={require("./images/image3.jpg")}
              alt="img"
              className="pic"
            />
          </div>

          <div className="postspace">
            <PostDisplay
              email={this.state.userProfile}
              posts={this.state.items}
              comments={this.state.arrayComments}
              likes={this.state.arrayLikes}
              dislikes={this.state.arrayDislikes}
            />
          </div>
          <br />
          {this.showPostsByUser()}
        </div>
      </React.Fragment>
    );
  }
}
