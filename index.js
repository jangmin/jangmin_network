var http = require("http");
var url = require('url');
var fs = require('fs');
var io = require('socket.io');
var text = "";

var server = http.createServer(function(request, response){
    var path = url.parse(request.url).pathname;
    switch(path){
        case '/':
            response.writeHead(300, {'Content-Type': 'text/html'});
            response.write('hello world');
            response.end();
            break;
        case '/socket.html':
            fs.readFile(__dirname + path, function(error, data){
                if (error){
                    response.writeHead(404);
                    response.write("opps this doesn't exist - 404");
                    response.end();
                }
                else{
                    response.writeHead(200, {"Content-Type": "text/html"});
                    response.write(data, "utf8");
                    response.end();
                }
            });
            break;
        default:
            response.writeHead(404);
            response.write("opps this doesn't exist - 404");
            response.end();
            break;
    }
});

server.listen(process.env.PORT || 8001);

var listener = io.listen(server);

listener.sockets.on('connection', function(socket){
  console.log("연결되었습니다.");
  //send data to client
  setInterval(function(){
    socket.emit('date', new Date());
  }, 1000);

  //recieve client data
  socket.on('client_data', function(data){
      console.log(typeof(data));
      console.log(data.letter);
      text+=data.letter;
      //process.stdout.write(data.letter);
  });
  setInterval(function(){
      console.log(typeof(text));
      console.log(text);
      socket.emit('chat', text);
   }, 1000);

});
