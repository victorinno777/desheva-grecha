//var cheerio = require('cheerio');
//const axios = require('axios');
const puppeteer = require ('puppeteer');
//const osmosis = require('osmosis');


async function getData() {

	return puppeteer
	.launch ({
		args: [
			'--no-sandbox',
			//"--single-process",
			//"--no-zygote",
			//'--disable-setuid-sandbox'
		]
	})
	.then (async browser => {

		//opening a new page
		const page = await browser.newPage();
		await page.goto('https://www.google.com/search?q=%D0%B3%D1%80%D0%B5%D1%87%D0%BA%D0%B0+%D0%BA%D1%83%D0%BF%D0%B8%D1%82%D1%8C&tbs=p_ord:p,cat:4684,vw:g,init_ar:SgVKAwjMJA%3D%3D,ss:44&tbm=shop');
		await page.waitForSelector('body');

		//manipulating the page's content
		grabPosts = await page.evaluate(() => {
		let allPosts = document.body.querySelectorAll('.sh-dgr__grid-result');

		//storing the post items in an array then selecting for retrieving content
		scrapeItems = [];
		allPosts.forEach (item => {
			let postTitle = item.querySelector('h4').innerText;
			let postURL = item.querySelector('a').getAttribute('href');
			let postPrice = '';
			try {
				postPrice = item.querySelector('span span').innerText;
			} catch (err) {}
			scrapeItems.push ({
				postTitle: postTitle,
				postPrice: postPrice,
				postURL: postURL,
			});
		});
		let items = {
			"Posts": scrapeItems,
		};
		return items;
    });

    //closing the browser
    await browser.close();
	return await grabPosts;
	})
	//handling any errors
	.catch (function (err) {
		console.error(err);
	});
}

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const router = express.Router();
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header("Access-Control-Allow-Methods", "GET, POST");
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

/*app.get('/', function (req, res) {
	res.sendfile(index.html);
});*/

app.post('/name', async function (req, res) {
	try {
		const result = await getData();
		res.json(result);
	} catch (e) {
		res.end(e.message || e.toString());
	}
});

/*app.listen(3001,() => {
	console.log("Started on PORT 3000");
})*/