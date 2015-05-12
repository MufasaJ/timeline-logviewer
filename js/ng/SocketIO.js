angular.module('app.services').factory('ListenerSocketIO',
        [function ()
        {
            //TODO: url to server
            var socket = io.connect('http://timelineserver.herokuapp.com');


            var listeners = {};

            function setListener(listenerName, callback)
            {
                listeners[listenerName] = callback;
                socket.on(listenerName, function (data)
                {
                    callback(data)
                });
            }

            function removeListener(listenerName)
            {
                delete listeners[listenerName];
                socket.removeListener(listenerName);
            }


            function reconnect()
            {
                socket.connect();
            }

            function disconnect()
            {
                socket.emit('disconnect');
                socket.disconnect();
            }



            return {
                setListener: setListener,
                removeListener: removeListener,
                reconnect: reconnect,
                disconnect: disconnect
            }
        }]);
