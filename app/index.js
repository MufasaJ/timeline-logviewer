(function ()
{
    'use strict';
    var WebSocketServer = require('ws').Server;
    var wss = new WebSocketServer({port: 3000});
    var index = 0;
    var sampleLogs = ['**** START:Listing directory,Listing the contents of a directory ****', 'ls -al /usr/bin',
                      '-rwxr-xr-x 1 root wheel 13968 Sep 9 2014 dserr', '-rwxr-xr-x 1 root wheel 29216 Sep 9 2014 dsexport',
                      '-rwxr-xr-x 1 root wheel 79664 Sep 9 2014 dsimport', '-rwxr-xr-x 1 root wheel 23664 Sep 9 2014 dsmemberutil',
                      '-rwxr-xr-x 1 root wheel 14160 Sep 28 2014 dsymutil', '-rwxr-xr-x 1 root wheel 19878 Feb 6 20:59 dtruss',
                      '-rwxr-xr-x 1 root wheel 19520 Nov 6 2014 du', '-rwxr-xr-x 1 root wheel 14160 Sep 28 2014 dwarfdump',
                      '**** FINISH:Listing directory,Listing completed ****', '???? START:Listing directory,Listing the contents of a directory ????',
                      'ls -al /usr/bin', '-rwxr-xr-x 1 root wheel 13968 Sep 9 2014 dserr', '-rwxr-xr-x 1 root wheel 29216 Sep 9 2014 dsexport',
                      '-rwxr-xr-x 1 root wheel 79664 Sep 9 2014 dsimport', '-rwxr-xr-x 1 root wheel 23664 Sep 9 2014 dsmemberutil',
                      '-rwxr-xr-x 1 root wheel 14160 Sep 28 2014 dsymutil', '-rwxr-xr-x 1 root wheel 19878 Feb 6 20:59 dtruss',
                      '-rwxr-xr-x 1 root wheel 19520 Nov 6 2014 du', '-rwxr-xr-x 1 root wheel 14160 Sep 28 2014 dwarfdump',
                      '???? FINISH:Listing directory,Listing completed ????', '!!!! START:Listing directory,Listing the contents of a directory !!!!',
                      'ls -al /usr/bin', '-rwxr-xr-x 1 root wheel 13968 Sep 9 2014 dserr', '-rwxr-xr-x 1 root wheel 29216 Sep 9 2014 dsexport',
                      '-rwxr-xr-x 1 root wheel 79664 Sep 9 2014 dsimport', '-rwxr-xr-x 1 root wheel 23664 Sep 9 2014 dsmemberutil',
                      '-rwxr-xr-x 1 root wheel 14160 Sep 28 2014 dsymutil', '-rwxr-xr-x 1 root wheel 19878 Feb 6 20:59 dtruss',
                      '-rwxr-xr-x 1 root wheel 19520 Nov 6 2014 du', '-rwxr-xr-x 1 root wheel 14160 Sep 28 2014 dwarfdump',
                      '!!!! FINISH:Listing directory,Listing completed !!!!'];
    var sockets = [];

    function getRandomInt(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    wss.on('connection', function connection(socket)
    {
        sockets.push(socket);
        socket.on('close', function ()
        {
            var indexOf = sockets.indexOf(socket);
            sockets.splice(indexOf, 1);
        })
    });

    function simulateLog()
    {
        index++;
        if (index >= sampleLogs.length) {
            index = 0;
        }
        if (wss._server._connections) {
            var data = sampleLogs[index];
            for (var i = 0; i < sockets.length; i++) {
                var socket = sockets[i];
                try {
                    socket.send(data);
                } catch (err) {
                    console.error('Cannot send data to socket', err);
                    sockets.splice(i, 1);
                    i--;
                }
            }
        }
        setTimeout(simulateLog, getRandomInt(500, 3000))
    }

    simulateLog();

})();
