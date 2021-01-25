//import logo from './logo.svg';
//import './App.css';
import React from "react";

function getMinIndices(array) {
	var first = 10000, second = 10000, third = 10000; 
	for (var i = 0; i < array.length; i++) {
		if (array[i] < first) {
            third = second;
            second = first;
            first = array[i];
        }
		else if (array[i] < second) { 
            third = second; 
            second = array[i]; 
        }
		else if (array[i] < third) {
			third = array[i]; 
		}
	}
	return [
		array.indexOf(first),
		array.indexOf(second),
		array.indexOf(third)
	];
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
	var minIndices = getMinIndices(array);
	
	var finalArray = [];
	for (i = 0; i < 3; i++) {
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
		const response = await fetch('https://desheva-grecha.herokuapp.com/name', {
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
			<div>
				<ul>
					{this.state.data.map((post, index) => {
						return (
							<li key={index}>
								<p>{post.postTitle}</p>
								<p>{post.postPrice}</p>
								<a href={'https://www.google.com' + post.postURL}>To site</a>
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}

export default App;
