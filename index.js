const express = require("express");
const multer = require('multer');
const sha1 = require('node-sha1');

/*****************************************************************************/

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, './store');
	},
	filename: function (req, file, callback) {
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

app.all('/', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

app.post('/upload', (req, res) => {
	upload(req,res,function(err) {
		if(err) {
			return res.end('Error uploading file.');
		}
		res.end('File is uploaded');
	});
});

app.listen(3001, () => {
	console.log('Working on port 3001');
});
