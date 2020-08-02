import React, { Component } from "react";
import styled from "styled-components";
import axios from "axios";
import { withRouter } from "react-router";
import { GoogleLogin } from "react-google-login";




class Home extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      authenticated: null,
    };
    this.signIn = this.signIn.bind(this);
  }

  signIn = (response) => {
    console.log(response)
    if (typeof response.accessToken == "undefined") {
      console.log(response.accessToken);
      this.props.history.push("/");
    } else {
      axios({
        url: `${process.env.REACT_APP_USERS_SERVICE_URL}/login`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "access-token": response.accessToken,
        },
      })
        .then((result) => {
          if (!result.error) {
            sessionStorage.setItem(
              "userData",
              JSON.stringify(result.data.user)
            );
            this.props.history.push("/catalog-ui", { userdata: result.data.user });
          } else {
            console.log(result.error);
            this.props.history.push("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  render() {
    const responseGoogle = (response) => {
      console.log(response);
      this.props.history.push("/");
    };

    return (
      <div className={this.props.className}>
        <div className="home-container">
        {/* <SideBar pageWrapId={"page-wrap"} outerContainerId={"home-container"} /> */}
          <div className="welcome">
            <h1>Welcome to ML Academy Store!</h1>
          </div>
          <div className="sign-in">
            <h3>Please sign in using your Google Credentials</h3>
          </div>
          <div className="google-sign-in">
            <GoogleLogin
              clientId="777754064427-b2ocvb3p2fb0g58fijjkh2eelii1ttjr.apps.googleusercontent.com"
              buttonText="Login with Google"
              onSuccess={this.signIn}
              onFailure={responseGoogle}
              cookiePolicy={"single_host_origin"}
            ></GoogleLogin>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(styled(Home)`
  display: flex;
  flex-direction: row;
  justify-content: center;

  .home-container {
    padding-top: 20px;
    padding-bottom: 20px;
    .welcome {
      padding-bottom: 20px;
    }
    .sign-in {
      padding-bottom: 20px;
    }
    .google-sign-in {
      display: flex;
      flex-direction: row;
      justify-content: center;
    }
  }
`);
