import React, { Component } from 'react';
import styled from 'styled-components';
import { Nav } from 'react-bootstrap';
import { slide as Menu } from "react-burger-menu";

class SidePanel extends Component {

    render () {
        return (
            <div className={this.props.className}>
                   <Menu {...this.props}>
                    <a className="menu-item" href="/">
                    Home
                    </a>
            
                    <a className="menu-item" href="/catalog-ui">
                    Catalog
                    </a>
            
                    <a className="menu-item" href="/addproduct">
                    Add Product
                    </a>
            
                    <a className="menu-item" href="/orders">
                    Orders
                    </a>
                </Menu>
    
                {/* <Nav defaultActiveKey="/home" className="flex-column">
                    <Nav.Link href="/home">Active</Nav.Link>
                    <Nav.Link eventKey="link-1">Link</Nav.Link>
                    <Nav.Link eventKey="link-2">Link</Nav.Link>
                    <Nav.Link eventKey="disabled" disabled>
                        Disabled
                    </Nav.Link>
                </Nav>  */}
            </div>
        );
    }

}

export default styled(SidePanel)`
   
    width: 25%;

`;
// export default props => {
//     return (
//       // Pass on our props
//       <Menu {...props}>
//         <a className="menu-item" href="/">
//           Home
//         </a>
  
//         <a className="menu-item" href="/burgers">
//           Burgers
//         </a>
  
//         <a className="menu-item" href="/pizzas">
//           Pizzas
//         </a>
  
//         <a className="menu-item" href="/desserts">
//           Desserts
//         </a>
//       </Menu>
//     );
//   };