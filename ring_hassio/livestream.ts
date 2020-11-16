//Far majority of this code by Dgreif https://github.com/dgreif/ring/examples/browser_example.ts

import 'dotenv/config'
import { RingApi } from 'ring-client-api'
import { promisify } from 'util'
const fs = require('fs'),
  path = require('path'),
  http = require('http'),
  url = require('url'),
  zlib = require('zlib')  

const PORT = process.env.RING_PORT;
//
const CAMERA_NAME = process.env.CAMERA_NAME;
var chosenCamera = CAMERA_NAME;
/**
 * This example creates an hls stream which is viewable in a browser
 * It also starts web app to view the stream at http://localhost:PORT
 **/

 async function startStream() {
   //
    const ringApi = new RingApi({
      // Refresh token is used when 2fa is on
      refreshToken: process.env.RING_REFRESH_TOKEN!,
      debug: true
    })
    ///////////////
    async function getCamera() {
      var cameras = await ringApi.getCameras();
      var camera;
      //
      if (chosenCamera) {
        for (var i=0; i < cameras.length; i++) {
          var cameraName = cameras[i].initialData.description;
          console.log(`Checking If ${cameraName} Is the same as the camera we are looking for (${chosenCamera})`);
          if (chosenCamera == cameraName) {
            camera = cameras[i];
            console.log(`Matched ${cameraName}`);
          } 
        }
      } else {
        camera = cameras[0]
      }
      //
      if (!cameras) {
        console.log('No cameras found')
        return
      }
      //
      return camera
  }
  ///////////////
  var camera = await getCamera()
  ///////////////
  const publicOutputDirectory = path.join('public/')
  console.log('output directory: '+publicOutputDirectory)

  var server = http.createServer(function (req, res) {
    // Get URL
    var uri = url.parse(req.url).pathname;
    console.log('requested uri: '+uri)
    // If Accessing The Main Page
    if (uri == '/index.html' || uri == '/') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write('<html><head><title>Ring Livestream</title></head><body>');
      res.write('<h1>Welcome to your Ring Livestream!</h1>');
      res.write(`<video width="352" height="198" controls autoplay src="public/stream.m3u8"></video>`);
      res.write(`<br/>If you cannot see the video above open <a href="public/stream.m3u8">the stream</a> in a player such as VLC.`);
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
  //
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

if(!('RING_REFRESH_TOKEN' in process.env) || !('RING_PORT' in process.env) || !('CAMERA_NAME' in process.env)) {
  console.log('Missing environment variables. Check RING_REFRESH_TOKEN, RING_PORT and CAMERA_NAME are set.')
  process.exit()
}
else {
  startStream()
}





