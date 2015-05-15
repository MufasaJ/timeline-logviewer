angular.module('app.services').factory('ListenerSocketIO',
        ['$websocket', function ($websocket)
        {
            var dataStream = $websocket('ws://localhost:3000');
            var listeners = {};

            function setListener(listenerName, callback)
            {
                listeners[listenerName] = callback;
                dataStream.onMessage(function (message)
                {
                    console.log(message.data);
                    callback(message)
                });
            }

            function removeListener(listenerName)
            {
                delete listeners[listenerName];
            }


            function reconnect()
            {
                dataStream = $websocket('ws://localhost:3000');
            }

            function disconnect()
            {
                dataStream.close({force: true});
            }


            return {
                setListener: setListener,
                removeListener: removeListener,
                reconnect: reconnect,
                disconnect: disconnect
            }
        }]);
