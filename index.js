const express = require("express");
const multer = require('multer');
const sha1 = require('node-sha1');
const axios = require('axios');

/*****************************************************************************/

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, './store');
	},
	filename: (req, file, callback) => {
		const {originalname} = file;
		const ext = (originalname.match(/\.(.+)$/i) || ['', 'unknown'])[1];
		const filename = sha1(`${Date.now()} ${originalname} ${ext}`);
		callback(null, `${filename}.${ext}`);
	}
});

const upload = multer({storage})
.single('file');

/*****************************************************************************/

const app = express();

app.use('/store', express.static(__dirname + '/store'));

app.all('/', (req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

app.post('/upload', (req, res) => {
	upload(req, res, err => {
		if (err) {
			res.status(500);
			return res.end();
		}

		const file = req.file;
		const path = file.path;
		const payload = {
			filepath: `http://localhost:3001/${path}`
		};

		res.status(200);
		res.json(payload);
	});
});

app.get('/twitter/oembed/', (req, res) => {
	const twitterAPI = 'https://publish.twitter.com/oembed';
	const twitterURL = encodeURIComponent(req.query.url);
	const apiCall = `${twitterAPI}?url=${twitterURL}`;

	axios.get(apiCall)
	.then(payload => {
		res.status(200);
		res.json(payload.data);
	})
	.catch(err => {
		res.status(500);
		res.json(err);
	});
});

app.listen(3001, () => {
	console.log('Working on port 3001');
});
