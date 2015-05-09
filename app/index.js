(function ()
{
    'use strict';
    var io = require('socket.io')(3000);
    io.serveClient(false);
    //TODO jest problem z timeoutem ponieważ one cały czas
    // wysyłają dane chociaż sam sockect się rozłączył i przy kolejnym wejściu na stronę nakładają się one wysyłają podwojne dane
    var index = 1;
    var mockPrimary = {
        data: new Date().getTime(),
        eventName: 'Mock',
        shortDescription: 'Lorem ipsumd',
        detail: 'Details',
        primary: true
    };
    var mockDanger = {
        data: new Date().getTime(),
        eventName: 'Mock',
        shortDescription: 'Lorem ipsum',
        detail: 'Details',
        danger: true
    };
    var mockWarning = {
        data: new Date().getTime(),
        eventName: 'Mock',
        shortDescription: 'Lorem ipsum',
        detail: 'Details',
        warning: true
    };

    function mockMileston()
    {
        if (0 === index % 3) {
            return mockPrimary;
        } else if (1 === index % 3) {
            return mockDanger;
        } else {
            return mockWarning;
        }

    }

    function getRandomInt(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function sendLogs(socket)
    {
        setTimeout(function ()
        {
            socket.emit('logs', {log: 'Lorem impsum............'});
            sendLogs(socket);
        }, getRandomInt(500, 1000))

    }

    function sendMilestone(socket)
    {
        setTimeout(function ()
        {
            index++;
            socket.emit('milestone', mockMileston());
            sendMilestone(socket);
        }, getRandomInt(1000, 3000))
    }

    io.on('connection', function (socket)
    {
        sendLogs(socket);
        sendMilestone(socket);
        socket.on('disconnect', function ()
        {
            socket.disconnect();
        });
    });

})();