angular.module('app.services').factory('ListenerSocketIO',
        ['$websocket', function ($websocket)
        {
            var dataStream;
            var listeners = {};

            function setListener(listenerName, callback)
            {
                listeners[listenerName] = callback;
                dataStream.onMessage(callback);
            }

            function removeListener(listenerName)
            {
                delete listeners[listenerName];
            }


            function reconnect()
            {
                dataStream = $websocket('ws://timelineserver.herokuapp.com');
            }

            function disconnect()
            {
                dataStream.close({force: true});
            }

            reconnect();

            return {
                setListener: setListener,
                removeListener: removeListener,
                reconnect: reconnect,
                disconnect: disconnect
            }
        }]);
