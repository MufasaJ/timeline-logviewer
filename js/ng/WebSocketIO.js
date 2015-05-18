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
                //dataStream = $websocket('ws://timelineserver.herokuapp.com');
                dataStream = $websocket('ws://146.148.125.2/v1/ws/run/test1');
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
