(function ()
{
    'use strict';
    var WebSocketServer = require('ws').Server;
    var wss = new WebSocketServer({port: 3000});
    var timeOut;
    var index = 0;
    var arrayWithLogs = ['**** START:Listing directory,Listing the contents of a directory\n' +
                         'ls -al /usr/bin\n' +
                         '-rwxr-xr-x 1 root wheel 13968 Sep 9 2014 dserr\n' +
                         '-rwxr-xr-x 1 root wheel 29216 Sep 9 2014 dsexport\n' +
                         '-rwxr-xr-x 1 root wheel 79664 Sep 9 2014 dsimport\n' +
                         '-rwxr-xr-x 1 root wheel 23664 Sep 9 2014 dsmemberutil\n' +
                         '-rwxr-xr-x 1 root wheel 14160 Sep 28 2014 dsymutil\n' +
                         '-rwxr-xr-x 1 root wheel 19878 Feb 6 20:59 dtruss\n' +
                         '-rwxr-xr-x 1 root wheel 19520 Nov 6 2014 du\n' +
                         '-rwxr-xr-x 1 root wheel 14160 Sep 28 2014 dwarfdump\n' +
                         '**** FINISH:Listing directory,Listing completed\n',

                         '???? START:Listing directory,Listing the contents of a directory\n' +
                         'ls -al /usr/bin\n' +
                         '-rwxr-xr-x 1 root wheel 13968 Sep 9 2014 dserr\n' +
                         '-rwxr-xr-x 1 root wheel 29216 Sep 9 2014 dsexport\n' +
                         '-rwxr-xr-x 1 root wheel 79664 Sep 9 2014 dsimport\n' +
                         '-rwxr-xr-x 1 root wheel 23664 Sep 9 2014 dsmemberutil\n' +
                         '-rwxr-xr-x 1 root wheel 14160 Sep 28 2014 dsymutil\n' +
                         '-rwxr-xr-x 1 root wheel 19878 Feb 6 20:59 dtruss\n' +
                         '-rwxr-xr-x 1 root wheel 19520 Nov 6 2014 du\n' +
                         '-rwxr-xr-x 1 root wheel 14160 Sep 28 2014 dwarfdump\n' +
                         '???? FINISH:Listing directory,Listing completed\n',

                         '!!!! START:Listing directory,Listing the contents of a directory\n' +
                         'ls -al /usr/bin\n' +
                         '-rwxr-xr-x 1 root wheel 13968 Sep 9 2014 dserr\n' +
                         '-rwxr-xr-x 1 root wheel 29216 Sep 9 2014 dsexport\n' +
                         '-rwxr-xr-x 1 root wheel 79664 Sep 9 2014 dsimport\n' +
                         '-rwxr-xr-x 1 root wheel 23664 Sep 9 2014 dsmemberutil\n' +
                         '-rwxr-xr-x 1 root wheel 14160 Sep 28 2014 dsymutil\n' +
                         '-rwxr-xr-x 1 root wheel 19878 Feb 6 20:59 dtruss\n' +
                         '-rwxr-xr-x 1 root wheel 19520 Nov 6 2014 du\n' +
                         '-rwxr-xr-x 1 root wheel 14160 Sep 28 2014 dwarfdump\n' +
                         '!!!! FINISH:Listing directory,Listing completed\n'];

    function getRandomInt(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    function sendMilestone(socket)
    {
        timeOut = setTimeout(function ()
        {
            index++;
            if (wss._server._connections) {
                console.log('send');
                socket.send(arrayWithLogs[index % 3]);
                sendMilestone(socket);
            } else {
                console.log('clear');
                clearTimeout(timeOut)
            }
        }, getRandomInt(1000, 3000))
    }

    wss.on('connection', function connection(socket)
    {
        sendMilestone(socket);
        socket.on('close', function ()
        {
            console.log('close');
            clearTimeout(timeOut);
        })
    });


})();