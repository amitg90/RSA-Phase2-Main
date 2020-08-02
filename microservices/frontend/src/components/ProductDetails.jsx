import React, { Component } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import { Card, Image, Row, Col, Container } from "react-bootstrap";

const Content = styled(Container)`
padding-top: 40px;
padding-bottom: 40px;
`;

const Gallery = styled.article`
  text-align: center;
  display: block;
`;

const ProductDescription = styled.p`
text-align: justfy;
`;

const ContentBody = styled(Container)`
flex: 1 1 auto;
    padding: 2rem 2.3rem;
`;
const CardImage = styled(Image)`
  height: 450px;
  width: auto;
  display: inline-block;
`;

const ImageThumb = styled(Image)`
  width: 60px;
  height: 60px;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin: 3px;
  display: inline-block;
  overflow: hidden;
`;

class ProductDetails extends Component {
  constructor(props, context) {
    super(props, context);
    console.log(this.props.location.product);
    if (!("userData" in sessionStorage)) {
      this.props.history.push("/");
    }
    this.state = {
      product: this.props.location.product,
      quantity: 0,
      cart: JSON.parse(sessionStorage.getItem("userCart")),
    };
  }

  async handleQuantityChange(event) {
    await this.setState({
      ...this.state,
      quantity: event.target.value > 0 ? event.target.value : 0,
    });
  }

  async handleQuantitySubmit(event, product) {
    let event_type = event.target.id;
    
    let select_qunatity = this.state.quantity;
    if (select_qunatity) {
      await this.setState({
        ...this.state,
        cart: {
          ...this.state.cart,
          [product.id]: {
            quantity: this.state.quantity,
            product: product,
          },
        },
      });
    } else if(event_type !== "buynow") {
      delete this.state.cart[product.id];
      await this.setState({
        ...this.state,
        cart: {
          ...this.state.cart,
        },
      });
    }
    
    sessionStorage.setItem("userCart", JSON.stringify(this.state.cart));
    if (event_type === "buynow" && Object.keys(this.state.cart).length > 0) {
        this.props.history.push("/checkout");
      }
  }

  renderProductDetails(product) {
    console.log(product);
    return (
      <Card class="mt-5">
        <div class="row">
          <Col class="md-6">
            <Gallery>
              <div class="mt-3">
                <CardImage src={product.link_to_images[0]} />
              </div>
              <div class="thumbs-wrap">
                {product.link_to_images.map((image_url) => {
                  return <ImageThumb src={image_url} />;
                })}
              </div>
            </Gallery>
          </Col>
          <main class="col-md-6 border-left">
            <ContentBody >
              <h2 class="title">{product.title}</h2>
              <div class="my-3">
                <small class="text-muted">
                  By {product.author}
                </small>
                <small class="text-success">
                  {" "}
                  <i class="fa fa-clipboard-check"></i> {product.qoh} <span> available</span>
                </small>
              </div>
              <div class="mb-3">
                <span className="h5"> ${product.unitprice} </span>
              </div>
              <ProductDescription >{product.description}</ProductDescription>
              <hr />
              <div class="row">
                <div class="mt-3">
                  <div class="form-group">
                    <label for="units">Quantity</label>
                    <input
                      type="number"
                      id="units"
                      name="units"
                      class="form-control"
                      value={this.state.quantity}
                      onChange={(event) =>
                        this.handleQuantityChange(event)
                      }
                      step="1"
                    />
                  </div>
                  <div class="form-group">
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
                </div>
              </div>
            </ContentBody>
          </main>
        </div>
      </Card>
    );
  }

  render() {
    const userdata = JSON.parse(sessionStorage.getItem("userData"));
    return (
      <div className={this.props.className}>
        <Header cart={this.state.cart} userdata={userdata} />
        <Content>
          <output>{this.renderProductDetails(this.state.product)}</output>
        </Content>
      </div>
    );
  }
}

export default styled(ProductDetails)``;
