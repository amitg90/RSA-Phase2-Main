import React, { Component } from "react";
import cookie from "react-cookies";
import axios from "axios";
import Header from "./Header";
import SidePanel from "./SidePanel";
import { withRouter } from "react-router";
import { Button, Card, Image, Row, Col, Container } from "react-bootstrap";
// import styled from 'styled-components';
import Table from "react-bootstrap/Table";
class OrderConfirmation extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      order: this.props.location.state.order,
      userdata: JSON.parse(sessionStorage.getItem("userData")),
      cart: JSON.parse(sessionStorage.getItem("userCart")),
    };
  }

  continueShoppingHandler = () => {
    this.props.history.push("/catalog-ui");
  };
  render() {
    return (
      <div>
        <Header cart={this.state.cart} userdata={this.state.userdata} />
        <div class="container">
          <h2 align="center">Order Confirmation</h2>
          <br />
          <div class="row justify-content-md-center">
            <div class="col-9 block-example border border-dark">
              <strong>
                <span>Customer Info:</span>
              </strong>
              <p>Order id: {this.state.order.id}</p>
              <p>Date: {this.state.order.created_at}</p>
              <p>Email id: {this.state.order.user_id}</p>
              <p>Full Name: {this.state.userdata.fullname}</p>
              <br />
              <Card border="info" style={{ width: "28rem" }}>
                <strong>
                  <span>Shipping Address:</span>
                </strong>
                <Card.Body>
                  <Table responsive>
                    <tbody>
                      <tr>
                        <td colspan="2">Full name:</td>
                        <td colspan="3">{this.state.userdata.fullname}</td>
                      </tr>
                      <tr>
                        <td>Address:</td>
                        <td colspan="4">{this.state.userdata.address1}</td>
                      </tr>
                      <tr>
                        <td>City:</td>
                        <td>{this.state.userdata.city}</td>
                        <td>State:</td>
                        <td>{this.state.userdata.state}</td>
                        <td>Zipcode:</td>
                        <td>{this.state.userdata.zip_code}</td>
                      </tr>
                      <tr>
                        <td colspan="2">Phone:</td>
                        <td colspan="3">{this.state.userdata.phone_number}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body>
                  <Card.Text>Thank you for shopping with us.</Card.Text>
                </Card.Body>
                <Button
                  style={{ margin: "5%", align: "center" }}
                  variant="primary"
                  type="button"
                  onClick={this.continueShoppingHandler}
                >
                  Continue Shopping
                </Button>
                <br></br>
              </Card>
            </div>
            <br />
          </div>
          <br />
        </div>
      </div>
    );
  }
}
export default withRouter(OrderConfirmation);
