angular.module('app.services').factory('ListenerSocketIO',
        ['$timeout', function ($timeout)
         {
             //TODO: url to server
//             var socket = io.connect('http://localhost:3000');

           var listeners = {};
             function setListener(listenerName, callback)
             {
               listeners[listenerName]=callback;
//                 socket.on(listenerName, function (data)
//                 {
//                     callback(data)
//                 });

             }

             function removeListener(listenerName)
             {
               delete listeners[listenerName];
//                 socket.removeListener(listenerName);
             }


             function reconnect()
             {
//                 socket.connect();
             }

             function disconnect()
             {
//                 socket.emit('disconnect');
//                 socket.disconnect();
             }

             function simulateMilestone() {
               var message = {
                 data: new Date().getTime(),
                 eventName: 'Mock',
                 shortDescription: 'Lorem ipsumd',
                 detail: 'Details',
                 type: 'milestone'
               };
               var index = Math.round((Math.random() * 3));
               if (0 === index % 3) {
                 message.primary=true;
               } else if (1 === index % 3) {
                 message.danger=true;
               } else {
                 message.warning=true;
               }
               angular.forEach(listeners, function (callback) {
                 callback(message)
               });
               $timeout(simulateMilestone, Math.random() * 5000);
             }


             function simulateLog() {
               var message = {
                log:'Lorem impsum............log'
               };
               angular.forEach(listeners, function (callback) {
                 callback(message)
               });
               $timeout(simulateLog, Math.random() * 3000);
             }

             simulateMilestone();
             simulateLog();

             return {
                 setListener: setListener,
                 removeListener: removeListener,
                 reconnect: reconnect,
                 disconnect: disconnect
             }
         }]);
