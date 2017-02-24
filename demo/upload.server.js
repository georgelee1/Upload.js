var express = require('express');
var app = express();
var multer = require('multer');

var uploading = multer({
  dest: '/tmp'
});

app.use('/demo', express.static('demo'));
app.use('/dist', express.static('dist'));

app.post('/upload', uploading.any(), function(req, res) {
  console.info('uploaded file');
  res.json({ success: true, uploadImageId: Date.now() });
});

app.post('/delete', function(req, res) {
  console.info('deleted file', req.params.file);
  res.json({ success: true });
});

app.listen(8000, () => {
  console.info('started');
});
