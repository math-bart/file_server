var fs = require('fs');
var formidable = require('formidable');
var urlFile;
var j;

exports.upload = function(request, response) {
    console.log('Rozpoczynam obsługę żądania upload.');
    var form = new formidable.IncomingForm();
	
    form.parse(request, function(error, fields, files) {
		urlFile = 'uploaded_files/' + files.upload.name;
		urlFile = urlFile.toString();
        fs.renameSync(files.upload.path, urlFile);
		fs.readFile('templates/upload.html', function(err, html) {
			response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
			response.write(html);
			response.write('<img src="/show" width=600px/>');
			response.end();
		}); 
    });
}

exports.welcome = function(request, response) {
	fs.readFile('templates/start.html', function(err, html) {
		response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
		response.write(html);
		response.end(); 
	});	
}

exports.list = function(request, response) {	
    fs.readFile('templates/list.html', function(err, html) {
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.write(html);
		fs.readdir('uploaded_files', 'utf-8', function(err, data) {
			var data = data;
			var j = data.length;
			for (i=0; i<j; i++) {
				urlFile = 'uploaded_files/' + data[i];
				urlFile = urlFile.toString();
				console.log(urlFile);
				response.write('<div class="picture"><img src="/show" width=200px height=100px /><p>' + data[i] + '</p></div>');
			}
			response.end(); 
		});	
	});
}

exports.error = function(request, response) {
    console.log('Nie wiem co robić.');
    response.write('404 :(');
    response.end();
}

exports.show = function(request, response) {
    fs.readFile(urlFile, 'binary', function(error, file) {
        response.writeHead(200, {'Content-Type': 'image/png'});
        response.write(file, 'binary');
        response.end();
    });
}

exports.style = function(request, response) {
    fs.readFile('./style.css', function(err, file){
		response.writeHead(200, {'Content-Type': 'text/css; charset=utf-8'});
		response.write(file, 'binary');
		response.end();
    });
}