//Far majority of this code by Dgreif https://github.com/dgreif/ring/examples/browser_example.ts

import 'dotenv/config'
import { RingApi } from 'ring-client-api'
import { promisify } from 'util'
import { runInNewContext } from 'vm';
const fs = require('fs'),
  path = require('path'),
  http = require('http'),
  url = require('url'),
  zlib = require('zlib')  

const PORT = 1504;
/**
 * This example creates an hls stream which is viewable in a browser
 * It also starts web app to view the stream at http://localhost:PORT
 **/

 async function startStream() {
  const ringApi = new RingApi({
      email: process.env.RING_EMAIL,
      password: process.env.RING_PASS,
      // Refresh token is used when 2fa is on
      refreshToken: process.env.RING_REFRESH_TOKEN!,
      debug: true
    }),
    [camera] = await ringApi.getCameras()

  if (!camera) {
    console.log('No cameras found')
    return
  }

  //const publicOutputDirectory = path.join('public','output')
  const publicOutputDirectory = path.join('public/')
  /*fs.readdir(publicOutputDirectory, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      var filepath = path.join(publicOutputDirectory,file);
      if (path.extname(file) == ".ts") {
        fs.unlink(filepath,err => {
          if (err) throw err;
        });
      }
    }
  });*/
  console.log('output directory: '+publicOutputDirectory)

  var server = http.createServer(function (req, res) {
    var uri = url.parse(req.url).pathname;
    console.log('requested uri: '+uri)
    if (uri == '/index.html' || uri == '/') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write('<html><head><title>Ring Livestream' +
          '</title></head><body>');
      res.write('<h1>Welcome to your Ring Livestream!</h1>');
      res.write('<video width="352" height="198" controls autoplay src="public/stream.m3u8"></video>');
      res.write('<br/>If you cannot see the video above open <a href="public/stream.m3u8">the stream</a> in a player such as VLC.');
      res.end();
      return;
    }

    var filename = path.join("./", uri);
    console.log('mapped filename: '+filename)
	  fs.exists(filename, function (exists) {
		  if (!exists) {
		  	console.log('file not found: ' + filename);
		  	res.writeHead(404, { 'Content-Type': 'text/plain' });
		  	res.write('file not found: %s\n', filename);
		  	res.end();
		  }  else {
		   	  console.log('sending file: ' + filename);
		   	  switch (path.extname(uri)) {
		   	  case '.m3u8':
		  		  fs.readFile(filename, function (err, contents) {
					  if (err) {
					  	res.writeHead(500);
					  	res.end();
					  } else if (contents) {
					    res.writeHead(200,
					  	  {'Content-Type':
						    'application/vnd.apple.mpegurl'});
						  var ae = req.headers['accept-encoding'];
						  if (ae && ae.match(/\bgzip\b/)) {
						  	zlib.gzip(contents, function (err, zip) {
						  		if (err) throw err;
  								res.writeHead(200,
  								    {'content-encoding': 'gzip'});
  								res.end(zip);
  							});
  						} else {
  							res.end(contents, 'utf-8');
  						}
  					} else {
  						console.log('empty playlist');
  						res.writeHead(500);
  						res.end();
  					}
  				});
  				break;
  			case '.ts':
  				res.writeHead(200, { 'Content-Type':
  				    'video/MP2T' });
  				var stream = fs.createReadStream(filename,
  				    { bufferSize: 64 * 1024 });
  				stream.pipe(res);
          break;
	  		default:
	  			console.log('unknown file type: ' +
	  			    path.extname(uri));
	  			res.writeHead(500);
	  			res.end();
	  		}
	  	}
	});
  }).listen(PORT);

  // Maintain a hash of all connected sockets
  var sockets = {}, nextSocketId = 0;
  server.on('connection', function (socket) {
    // Add a newly connected socket
    var socketId = nextSocketId++;
    sockets[socketId] = socket;
    console.log('socket', socketId, 'opened');

    // Remove the socket when it closes
    socket.on('close', function () {
      console.log('socket', socketId, 'closed');
      delete sockets[socketId];
    });

    // Extend socket lifetime for demo purposes
    socket.setTimeout(4000);
  });
  console.log('Started server, listening on port '+PORT+'.')

  if (!(await promisify(fs.exists)(publicOutputDirectory))) {
    await promisify(fs.mkdir)(publicOutputDirectory)
  }

  const sipSession = await camera.streamVideo({
    output: [
      '-preset',
      'veryfast',
      '-g',
      '25',
      '-sc_threshold',
      '0',
      '-f',
      'hls',
      '-hls_time',
      '2',
      '-hls_list_size',
      '6',
      '-hls_flags',
      'delete_segments',
      path.join(publicOutputDirectory, 'stream.m3u8')
    ]
  })

  sipSession.onCallEnded.subscribe(() => {
    console.log('Call has ended')
    server.close(function() {console.log('Server closed!');});
    // Destroy all open sockets
    for (var socketId in sockets) {
      console.log('socket', socketId, 'destroyed');
      sockets[socketId].destroy();
    }
    //app.stop()
    console.log('Restarting server')
    startStream()
  })

  setTimeout(function() {
    console.log('Stopping call...')
    sipSession.stop()
    
  }, 10* 60 * 1000) // 10*60*1000 Stop after 10 minutes.
}

if(!('RING_EMAIL' in process.env) || !('RING_PASS' in process.env)) {
  console.log('Missing environment variables. Check RING_EMAIL and RING_PASS are set.')
  process.exit()
}
else {
  startStream()
}





