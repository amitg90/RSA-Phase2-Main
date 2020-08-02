import React, { Component } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import axios from "axios";
import {
  Button,
  Row,
  Col,
  Container,
  Card,
  Image,
  Spinner,
} from "react-bootstrap";

const CardImage = styled(Image)`
  height: 220px;
`;

const PlaceOrder = styled(Button)`
  display: flex;
`;

class Checkout extends Component {
  constructor(props, context) {
    super(props, context);
    this.checkout = this.checkout.bind(this);
    this.rednerAddress = this.rednerAddress.bind(this);
    this.orderdate = new Date();
    console.log(this.props);
    if (!("userData" in sessionStorage)) {
      this.props.history.push("/");
    }
    this.state = {
      userdata: JSON.parse(sessionStorage.getItem("userData")),
      cart: JSON.parse(sessionStorage.getItem("userCart")),
      loading: false,
    };
  }

  async removeItemFromCart(event, product_id) {
    console.log(product_id);
    delete this.state.cart[product_id];
    await this.setState({
      ...this.state,
      cart: {
        ...this.state.cart,
      },
    });
    axios({
      url: `${process.env.REACT_APP_CHECKOUT_SERVICE_URL}/cart/delete`,
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "user-id": this.state.userdata.id,
        "cart-id": this.state.userdata.id,
      },
      data: {
        product_id: product_id,
      },
    })
      .then((result) => {
        console.log(result);
        if (result) {
          console.log(result);
        } else {
          console.log(result);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    console.log(this.state.cart);
    sessionStorage.setItem("userCart", JSON.stringify(this.state.cart));
  }

  checkout = () => {
    if (Object.keys(this.state.cart).length <= 0) {
      alert("Can not place an order with 0 items");
    } else {
      this.setState({
        ...this.state,
        loading: true,
      });
      axios({
        url: `${process.env.REACT_APP_CHECKOUT_SERVICE_URL}/cart/checkout`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-id": this.state.userdata.id,
          "cart-id": this.state.userdata.id, // same as user id
        },
        data: {
          userdata: this.state.userdata,
        },
      })
        .then((result) => {
          if (result) {
            this.setState({
              ...this.state,
              cart: {},
            });
            console.log(result.data.order);
            sessionStorage.setItem("userCart", JSON.stringify(this.state.cart));
            this.props.history.push("/orderConfirmation", {
              order: result.data.order,
              userdata: this.state.userdata,
            });
          } else {
            console.log(result);
            alert("Can not place an order with error");
          }
        })
        .catch((err) => {
          console.log(err);
          alert("Can not place an order");
        });
    }
  };

  rednerAddress = () => {
    let orderdate = this.orderdate;
    return (
      <div>
        <div className="form-group">
          <label>Order date</label>
          <input
            type="text"
            className="form-control"
            name="orderdate"
            value={orderdate.toLocaleDateString()}
            format="DD/MM/YY HH:mm:ss"
            disabled
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="text"
            className="form-control"
            name="fullname"
            value={this.state.userdata.id}
            disabled
          />
        </div>
        <h4>Shipping Address:</h4>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            className="form-control"
            name="fullname"
            value={this.state.userdata.fullname}
            onChange={(event) => {
              this.setState(
                (this.state.userdata = {
                  ...this.state.userdata,
                  fullname: event.target.value,
                })
              );
            }}
          />
        </div>
        <div className="form-group">
          <label>Address line1</label>
          <input
            type="text"
            className="form-control"
            name="addressline1"
            value={this.state.userdata.address1}
            onChange={(event) => {
              this.setState(
                (this.state.userdata = {
                  ...this.state.userdata,
                  address1: event.target.value,
                })
              );
            }}
          />
        </div>
        <div className="form-group">
          <label>Address line2</label>
          <input
            type="text"
            className="form-control"
            name="addressline2"
            value={this.state.userdata.address2}
            onChange={(event) => {
              this.setState(
                (this.state.userdata = {
                  ...this.state.userdata,
                  address2: event.target.value,
                })
              );
            }}
          />
        </div>
        <div className="form-group">
          <label>City</label>
          <input
            type="text"
            className="form-control"
            name="city"
            value={this.state.userdata.city}
            onChange={(event) => {
              this.setState(
                (this.state.userdata = {
                  ...this.state.userdata,
                  city: event.target.value,
                })
              );
            }}
          />
        </div>
        <div className="form-group">
          <label>State</label>
          <input
            type="text"
            className="form-control"
            name="state"
            value={this.state.userdata.state}
            onChange={(event) => {
              this.setState(
                (this.state.userdata = {
                  ...this.state.userdata,
                  state: event.target.value,
                })
              );
            }}
          />
        </div>
        <div className="form-group">
          <label>Zip</label>
          <input
            type="text"
            className="form-control"
            name="state"
            value={this.state.userdata.zip_code}
            onChange={(event) => {
              this.setState(
                (this.state.userdata = {
                  ...this.state.userdata,
                  zip_code: event.target.value,
                })
              );
            }}
          />
        </div>
        <div className="form-group">
          <label>Phone number</label>
          <input
            type="text"
            className="form-control"
            name="phonenumber"
            value={this.state.userdata.phone_number}
            onChange={(event) => {
              this.setState(
                (this.state.userdata = {
                  ...this.state.userdata,
                  phone_number: event.target.value,
                })
              );
            }}
          />
        </div>
        <div className="form-group">
          <PlaceOrder variant="primary" onClick={this.checkout}>
          {this.state.loading && <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            ></Spinner>}
            Place Order
          </PlaceOrder>
        </div>
      </div>
    );
  };

  renderShoppingCart = () => {
    let totalPrice = 0;
    let totalQuantity = 0;
    let cartItems = Object.keys(this.state.cart).map((product_id) => {
      let product = this.state.cart[product_id].product;
      let quantity = this.state.cart[product_id].quantity;
      totalPrice = totalPrice + quantity * product.unitprice;
      totalQuantity += 1;
      return (
        <tr>
          <td>
            <figure className="itemside align-items-center">
              <div className="aside">
                <CardImage src={product.link_to_images[0]} />
              </div>
              <figcaption className="info">
                <Link
                  className="title text-dark"
                  to={{
                    pathname: "/productDetails",
                    product: product,
                  }}
                >
                  {product.title}
                </Link>
                <br />
                <small className="text-muted">By {product.author}</small>
              </figcaption>
            </figure>
          </td>
          <td>
            <select className="form-control">
              <option>{quantity}</option>
            </select>
          </td>
          <td>
            <Col>
              <Row>${(product.unitprice * quantity).toFixed(2)}</Row>
              <Row className="small text-muted">
                {" "}
                ${product.unitprice} each{" "}
              </Row>
            </Col>
          </td>
          <td className="text-right d-none d-md-block">
            <a
              data-original-title="Save to Wishlist"
              title=""
              href=""
              className="btn btn-light"
              data-toggle="tooltip"
            >
              {" "}
              <i className="fa fa-heart"></i>
            </a>
            <Button
              variant="warning"
              onClick={(event) => {
                this.removeItemFromCart(event, product.id);
              }}
            >
              {" "}
              Remove
            </Button>
          </td>
        </tr>
      );
    });
    return (
      <Card className="mt-4">
        <div className="table-responsive">
          <table className="table table-borderless table-shopping-cart">
            <thead className="text-muted">
              <tr className="small text-uppercase">
                <th scope="col">Product</th>
                <th scope="col" width="120">
                  Quantity
                </th>
                <th scope="col" width="120">
                  Price
                </th>
                <th
                  scope="col"
                  className="text-right d-none d-md-block"
                  width="200"
                >
                  {" "}
                </th>
              </tr>
            </thead>
            <tbody>{cartItems}</tbody>
          </table>
        </div>
        <Card.Body>
          <Row>
            <Col className="h3">Total Price </Col>
            <Col>
              <Row className="h3">${totalPrice.toFixed(2)}</Row>
              <Row class="float-right text-muted">{totalQuantity} items</Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  };

  render() {
    return (
      <div>
        <Header cart={this.state.cart} userdata={this.state.userdata} />
        <Container>
          <Row>
            <Col sm={8}>{this.renderShoppingCart()}</Col>
            <Col>{this.rednerAddress()}</Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withRouter(Checkout);
