import React, {Component} from 'react';
import axios from 'axios';
import Header from './Header';
import SidePanel from './SidePanel';
import cookie from 'react-cookies';
// import styled from 'styled-components';
import {Redirect} from 'react-router';

class AddProduct extends Component{
        state={
            //  isCreated : false,
            productID :'',
            productCategory : '',
            author:'',
            classDate:'',
            linkToEcontent:'',
            linkToImage:'',
            productTitle : '',
            productDescription : '',
            productPrice : 0.00,
            productQuantity : 0,
            product:''

        };


        // data={
        //     productID : 00000001,
        //     productCategory : 'eBook',
        //     author:'Niall Richard Murphy',
        //     classDate:'',
        //     linkToEcontent:'https://landing.google.com/sre/sre-book/toc/',
        //     linkToImage:'http://timepassURLPlaceHolder',
        //     productTitle : 'Site Reliability Engineering',
        //     productDescription : 'In this collection of essays and articles, key members of Google’s Site Reliability Team explain how and why their commitment to the entire lifecycle has enabled the company to successfully build, deploy, monitor, and maintain some of the largest software systems in the world. You’ll learn the principles and practices that enable Google engineers to make systems more scalable, reliable, and efficient—lessons directly applicable to your organization.',
        //     productPrice : 10.00,
        //     productQuantity : 20,
        //     product:'SRE Book'

        // };
    
    changeHandler = (e) => {
        this.setState({
            [e.target.name] : e.target.value

        })
    }

    // submitCreate = (e) => {
    // //   this block is temporary. Make sure to delete it later
    //             if(response.status === 200){
    //                 this.setState({
    //                     //  authFlag : true,
    //                     isCreated : true
    //                 });
                    
    //             }else{
    //                 this.setState({
    //                 //  authFlag : false,
    //                     isCreated : false
    //                 })
    //             }
    //         });
    // }


    submitHandler = (e) =>{
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            productID :this.state.productID,
            productCategory : this.state.productCategory,
            author:this.state.author,
            classDate:this.state.classDate,
            linkToEcontent:this.state.linkToEcontent,
            linkToImage:this.state.linkToImage,
            productTitle : this.state.productTitle,
            productDescription : this.state.productDescription,
            productPrice : this.state.productPrice,
            productQuantity : this.state.productQuantity,
            product:this.state.product
        }
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post('http://localhost:3001/viewStudents',data)
            .then(response => {
                console.log("Created")
                console.log("Status Code : ",response.status);
            });
    }

   
    render()
    {

        return(
            
            <div>
               <Header/>
               <SidePanel/>
                <br/>
                <div class="container">
                   
                    <form onSubmit={this.submitCreate}> 
                    <div>
                    <h3>Add a new Product</h3>
                    </div><br/>
                    
                    <div class="row">
                    {/*<div class = "col-md-6">
                    <div class="form-group">
                    <input  onChange = {this.changeHandler} type="text" class="form-control" name="productID" placeholder="Product ID"/>
        </div></div>*/}
                    <div class = "col-md-6">
                        <div class="form-group">
                            <input  onChange = {this.changeHandler} type="text" class="form-control" name="productCategory" placeholder="Product Category"/>
                        </div></div>
                        <div class = "col-md-6">
                        <div class="form-group">
                            <input  onChange = {this.changeHandler} type="text" class="form-control" name="product" placeholder="Product"/>
                        </div></div>
                    </div>
                    <div class="row">
                    <div class = "col-md-6">
                    <div class="form-group">
                        <input  onChange = {this.changeHandler} type="text" class="form-control" name="productTitle" placeholder="Product Title"/>
                    </div></div>
                    <div class = "col-md-6">
                        <div class="form-group">
                            <input  onChange = {this.changeHandler} type="text" class="form-control" name="author" placeholder="Author"/>
                        </div></div>
                        </div>

                        <div class="row">
                        <div class = "col-md-6">
                        <div class="form-group">
                            <input  onChange = {this.changeHandler} type="text" class="form-control" name="productQuantity" placeholder="Product Quantity"/>
                        </div></div>
                        <div class = "col-md-6">
                        <div class="form-group">
                            <input  onChange = {this.changeHandler} type="number" step='0.01' class="form-control" name="productPrice" placeholder="Product Price"/>
                        </div></div>
                        </div>

                        <div class="row">
                        <div class = "col-md-6">
                        <div class="form-group">
                            <input  onChange = {this.changeHandler} type="text" class="form-control" name="linkToEcontent" placeholder="Link to e-Content"/>
                        </div></div>
                        <div class = "col-md-6">
                        <div class="form-group">
                            <input  onChange = {this.changeHandler} type="text" class="form-control" name="linkToImage" placeholder="Link to Image"/>
                        </div></div>
                        </div>

                        <div class="row" >
                        <div class = "col-sm-6 float-md-right">
                        <div class="form-group">
                            <textarea id="productDescription"  rows='4'  onChange = {this.changeHandler} class="form-control" name="productDescription" placeholder="Product Description"/>
                        </div></div>
                        </div>

                        

                        <div class="float-md-right">
                             <button onSubmit = {this.submitHandler} class="btn btn-secondary" type="submit">Add Product</button>  
                        </div> 
                    </form>
                </div>
            </div>
        )
    }
}


export default AddProduct;
