import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import Header from "./Header";
import { Card, Image, Row, Col, Container } from "react-bootstrap";
import { withRouter } from "react-router";

const Gallery = styled(Col)`
  text-align: center;
  display: block;
`;

const CardImage = styled(Image)`
  height: 200px;
  border-radius: 0.37rem 0 0 0.37rem;
  border-top-left-radius: 0.37rem;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0.37rem;
`;
class Catalog extends Component {
  constructor(props) {
    super(props);
    if (!("userData" in sessionStorage)) {
      console.log("session not present");
      this.props.history.push("/");
    }
    this.state = {
      products: [],
      last_product_id: null,
      quantity: {},
      cart: {},
      userdata: JSON.parse(sessionStorage.getItem("userData")),
    };
    this.handleQuantitySubmit = this.handleQuantitySubmit.bind(this);
  }

  componentDidMount() {
    this.getProducts();
    this.getCartItems();
  }

  
  async getProducts() {
    axios({
      url: `${process.env.REACT_APP_CATALOG_SERVICE_URL}/catalog`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        this.setState({
          products: res.data.products,
          last_product_id: res.data.last_product_id,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async getCartItems() {
    axios({
      url: `${process.env.REACT_APP_CHECKOUT_SERVICE_URL}/cart/list`,
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "cart-id": this.state.userdata.id,
      },
    })
      .then((result) => {
        console.log(result.data);
        if (result) {
          this.setState({
            ...this.state,
            cart: {
              ...result.data.cart,
            },
          });
          sessionStorage.setItem("userCart", JSON.stringify(this.state.cart));
        } else {
          console.log(result.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    
    console.log(this.state.cart);
  }

  async addCartItems(redirect) {
    axios({
      url: `${process.env.REACT_APP_CHECKOUT_SERVICE_URL}/cart/add`,
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "user-id": this.state.userdata.id,
        "cart-id": this.state.userdata.id,
      },
      data: {
        products: this.state.cart,
      },
    })
      .then((result) => {
        console.log(result);
        if (result) {
          sessionStorage.setItem("userCart", JSON.stringify(this.state.cart));
          if (redirect === true) {
            this.props.history.push("/checkout");
          }
        } else {
          console.log(result);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    await this.setState({
      ...this.state,
      cart: {
        ...this.state.cart,
      },
    });
    console.log(this.state.cart);
  }

  async handleQuantityChange(event, product_id) {
    await this.setState({
      ...this.state,
      quantity: {
        ...this.state.quantity,
        [product_id]: event.target.value > 0 ? event.target.value : 0,
      },
    });
  }

  async handleQuantitySubmit(event, product) {
    let event_type = event.target.id;

    let select_qunatity = this.state.quantity[product.id];
    if (select_qunatity) {
      await this.setState({
        ...this.state,
        cart: {
          ...this.state.cart,
          [product.id]: {
            quantity: this.state.quantity[product.id],
            product: product,
          },
        },
      });
    } else if (event_type !== "buynow") {
      delete this.state.cart[product.id];
      await this.setState({
        ...this.state,
        cart: {
          ...this.state.cart,
        },
      });
    }
    sessionStorage.setItem("userCart", JSON.stringify(this.state.cart));
    if (Object.keys(this.state.cart).length > 0) {
      let redirect = event_type === "buynow"? true: false;
      this.addCartItems(redirect);
    }
  }

  render() {
    let listP = this.state.products.map((product) => {
      return (
        <Card className="mb-4" key={product.id}>
          <Card.Body>
            <Row>
              <Gallery sm={3}>
                <Link
                  to={{
                    pathname: "/productDetails",
                    product: product,
                  }}
                >
                  <CardImage src={product.link_to_images[0]} />
                </Link>
              </Gallery>
              <Col sm={6}>
                <Link
                  to={{
                    pathname: "/productDetails",
                    product: product,
                  }}
                >
                  <Card.Title className="title mt-2 h5">
                    {product.title}
                  </Card.Title>
                </Link>
                <div className="mb-3">
                  <small className="text-muted">By {product.author}</small>
                </div>
                <main>
                  <p>{product.description}</p>
                </main>
              </Col>
              <Col sm={3}>
                <div className="row mt-2">
                  <span className="h5"> ${product.unitprice} </span>
                </div>
                <p className="row small text-success"> Free shipping </p>
                <br />
                <div className="row">
                  <div className="form-group">
                    <label>Quantity</label>
                    <input
                      type="number"
                      className="form-control"
                      value={this.state.quantity[product.id] | 0}
                      onChange={(event) =>
                        this.handleQuantityChange(event, product.id)
                      }
                    />
                  </div>

                  <button
                    id="buynow"
                    className="btn btn-primary mr-3"
                    onClick={(event) =>
                      this.handleQuantitySubmit(event, product)
                    }
                  >
                    Buy Now
                  </button>
                  <button
                    id="addtocart"
                    className="btn btn-warning"
                    onClick={(event) =>
                      this.handleQuantitySubmit(event, product)
                    }
                  >
                    Add to Cart
                  </button>
                </div>
                <br />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      );
    });
    const userdata = JSON.parse(sessionStorage.getItem("userData"));
    return (
      <div className={this.props.className}>
        <Header cart={this.state.cart} userdata={userdata} />
        <Container>
          <div className="row mt-4">
            <aside className="col-md-12">
              <output>{listP}</output>
            </aside>
          </div>
        </Container>
      </div>
    );
  }
}

export default withRouter(Catalog);
