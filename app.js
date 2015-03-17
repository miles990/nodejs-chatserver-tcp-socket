// https://helloacm.com
// 09-Feb-2013

var sys = require('sys');
var net = require('net');
var sockets = [];
var svraddr = '127.0.0.1';
var svrport = process.env.PORT || 8888;
var player = {};

var svr = net.createServer(function(sock) {
    sys.puts('Connected: ' + sock.remoteAddress + ':' + sock.remotePort);
    sock.write('Hello ' + sock.remoteAddress + ':' + sock.remotePort + '\n');
    sockets.push(sock);

    sock.on('data', function(data) {  // client writes message
		console.log(data.toString());


        if (data == 'exit\n') {
            sys.puts('exit command received: ' + sock.remoteAddress + ':' + sock.remotePort + '\n');
            sock.destroy();
            var idx = sockets.indexOf(sock);
            if (idx != -1) {
                delete sockets[idx];
            }
            return;
        }
        var len = sockets.length;
        for (var i = 0; i < len; i ++) { // broad cast
            //if (sockets[i] != sock) {
                if (sockets[i]) {
                    sockets[i].write(sock.remoteAddress + ':' + sock.remotePort + ':' + data);
                }
            //}
        }
    });

	sock.on("error", function(err){
		//console.log("Caught flash policy server socket error: ")
		//console.log(sock);
		var idx = sockets.indexOf(sock);
        if (idx != -1) {
            delete sockets[idx];
        }
		console.log(sock._peername.address+':'+sock._peername.port+': '+err);
	});

    sock.on('end', function() { // client disconnects
        //sys.puts('Disconnected: \n');
        var idx = sockets.indexOf(sock);
        if (idx != -1) {
            delete sockets[idx];
        }
		console.log(sock._peername.address+':'+sock._peername.port+': '+'end');
    });

	sock.on('close', function() { // client disconnects
        //sys.puts('Connection closed\n');
        var idx = sockets.indexOf(sock);
        if (idx != -1) {
            delete sockets[idx];
        }

		console.log(sock._peername.address+':'+sock._peername.port+': '+'close');
    });

}).listen(svrport);
//}).listen(svrport, svraddr);

sys.puts('Server Created at ' + svraddr + ':' + svrport + '\n');
