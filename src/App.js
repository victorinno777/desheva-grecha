//import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";

import {
	Container, Row, Col, Card, CardImg, CardBody,
	CardTitle, CardSubtitle, CardText, Form, Input, Button, Navbar, Nav,
	NavbarBrand, NavLink, NavItem, UncontrolledDropdown,
	DropdownToggle, DropdownMenu, DropdownItem
  } from 'reactstrap';

function getMinIndices(array, num) { // array to sort, number to return
    for (var i = 0; i < array.length-1; i++)
    {
		for (var j = 0; j < array.length-1-i; j++)
        {
			if (array[j+1] < array[j])
			{
			   var cash = array[j+1];
			   array[j+1] = array[j];
			   array[j] = cash;
			}
        }
	} 
	var indices = [];
	for(i = 0; i < num; i++)  {
		indices.push(array.indexOf(array[i]));
	}                  
    return indices; // indices of sorted array
}

function getData(json) {
	
	//json.Posts.splice(0, 1);
	var array = [];
	var i;
	for (i = 0; i < json.Posts.length; i++) {//json.Posts.length
		var price = json.Posts[i].postPrice;
		price = price.replace(/,/g, '.').substring(0, price.length-5);
		array.push(price);
	}
	var minIndices = getMinIndices(array, 20); // second argument is number of output
	
	var finalArray = [];
	for (i = 0; i < minIndices.length; i++) {
		var obj = json.Posts[minIndices[i]];
		finalArray.push(obj);
	}
	
	console.log(Object.values(finalArray));
	return Object.values(finalArray);
}

class App extends React.Component {
	
	constructor() {
		super();
		this.state = { data: [] };
	}
	
	async componentDidMount() {
		const response = await fetch('https://desheva-grecha-server.herokuapp.com/fetch', {
			method: 'POST',
			mode: 'cors',
			cache: 'no-cache',
			headers: {
				'Content-Type': 'application/json'
			}
		})
		const json = await response.json();
		this.setState({ data: getData(json) });
	}

	
	render() {
		return (
			<Container  fluid>
			 <Row className="justify-content-md-center row-flex">
					 {this.state.data.map((post, index) => {
						return ( 
							<Col xs={3} className="md-6 col-md-4 col-sm-6 col-xs-12" key={index} > 
								<Card>
									<CardTitle className="h6 mb-2 pt-2 font-weight-bold text-secondary">{post.postTitle}</CardTitle>
									<CardText className="text-secondary mb-4" style={{ fontSize: '0.75rem' }}>{post.postPrice}</CardText> 
									<Button className="font-weight-bold " id="btnlink">
										<a href={'https://www.google.com' + post.postURL}>To site</a>
									</Button>
								</Card>
			 				</Col>
			 			);
					 })}
				 </Row> 
			</Container>

		);
	}
}

export default App;
