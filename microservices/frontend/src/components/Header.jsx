import React, { Component } from "react";
import {
  Nav,
  Button,
  Form,
  FormControl,
  Navbar,
  Image,
  Row,
  Col,
} from "react-bootstrap";
import { ReactComponent as CartLogo } from "../icons/cart-sharp.svg";
import { GoogleLogout } from "react-google-login";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import "./styles.css";
import SideBar from "./SidePanel";

class Header extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);

    if (!("userData" in sessionStorage)) {
      this.props.history.push("/");
    }

    this.state = {
      userPicture: null,
      cart: {
        count: 0,
      },
    };
  }

  logout = () => {
    sessionStorage.removeItem("userData");
    sessionStorage.removeItem("userCart");
    this.props.history.push("/");
  };

  render() {
    const cartcount = this.props.cart ? Object.keys(this.props.cart).length : 0;
    const userPicture = this.props.userdata
      ? this.props.userdata.picture
      : null;
    return (
      <Navbar bg="light" expand="lg" id="App">
        {/* <SideBar outerContainerId={"App"} /> */}
        <Navbar.Brand href="/catalog-ui">
          <img
            src="img/MLA-logo-black.png"
            width="100"
            height="50"
          ></img>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            <Nav.Item className="ml-3">
              <Link to="/catalog-ui" >Home</Link>
            </Nav.Item>
            {this.props.userdata.is_admin && (
              <>
                <Nav.Item className="ml-3" >
                  <Link to="/orders" >Orders</Link>
                </Nav.Item>
                <Nav.Item className="ml-3" >
                  <Link to="/users" >Users</Link>
                </Nav.Item>
              </>
            )}
            <Nav.Item>
              <Link
                className="nav-link"
                to={{
                  pathname: cartcount > 0 ? "/checkout" : "",
                  state: {
                    userdata: this.props.userdata,
                  },
                }}
              >
                <Col>
                  <Row>
                    <CartLogo width={30} height={30}></CartLogo>
                    <span className="small text-success">{cartcount}</span>
                  </Row>
                </Col>
              </Link>
            </Nav.Item>
            <Nav.Item>
              <GoogleLogout
                clientId="777754064427-b2ocvb3p2fb0g58fijjkh2eelii1ttjr.apps.googleusercontent.com"
                buttonText="Logout"
                render={(renderProps) => (
                  <button
                    className="btn bg-transparent"
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                  >
                    <Image
                      width={30}
                      height={30}
                      src={userPicture}
                      roundedCircle
                    />
                  </button>
                )}
                onLogoutSuccess={this.logout}
              ></GoogleLogout>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default withRouter(Header);
