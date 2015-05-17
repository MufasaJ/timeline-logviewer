angular.module('app.controllers').controller('TimeLineCtrl',
        ['$rootScope', '$scope', '$state', 'ListenerSocketIO', 'moment', function ($rootScope, $scope, $state, ListenerSocketIO, moment)
        {
            var ctrl = this;
            var milestones = {};
            this.displayWhenHideTerminal = [];
            this.events = [];
            $rootScope.$on('$stateChangeStart', function ()
            {
                if ('app.timeLine' === $state.current.name) {
                    ListenerSocketIO.disconnect()
                } else {
                    ListenerSocketIO.reconnect()
                }
            });
            ctrl.showTerminal = true;
            this.hideTerminal = function hideTerminal()
            {
                ctrl.showTerminal = false;
            };
            this.toggleTerminal = function ()
            {
                ctrl.showTerminal = !ctrl.showTerminal;
            };
            function addMilestoneAndLogs(data)
            {
                var logEntry = {
                    date: data.timeStamp
                };
                if ('*' === data.data.charAt(0)) {
                    logEntry.severity = 'primary';
                } else if ('?' === data.data.charAt(0)) {
                    logEntry.severity = 'warning';
                } else if ('!' === data.data.charAt(0)) {
                    logEntry.severity = 'danger';
                }
                var milestoneStart = /((\*{4})|(\?{4})|(!{4})) START:(.*),(.*).*((\*{4})|(\?{4})|(!{4}))/;
                var milestoneEnd = /((\*{4})|(\?{4})|(!{4})) FINISH:(.*),(.*).*((\*{4})|(\?{4})|(!{4}))/;
                var match;
                if (match = data.data.match(milestoneStart)) {
                    logEntry.id = match[5];
                    logEntry.title = 'START:' + match[5];
                    logEntry.description = match[6];
                    logEntry.milestone = true;
                    milestones[logEntry.id] = logEntry;
                } else if (match = data.data.match(milestoneEnd)) {
                    logEntry.id = match[5];
                    logEntry.title = 'FINISH:' + match[5];
                    logEntry.description = match[6];
                    logEntry.milestone = true;
                    var startingMilestone = milestones[logEntry.id];
                    if (startingMilestone) {
                        logEntry.elapsedTime = logEntry.date - startingMilestone.date;
                        logEntry.elapsedTimeHumanized = moment.duration(logEntry.elapsedTime/-1000, 'seconds').humanize();
                    }
                }
                logEntry.data = data.data;
                ctrl.displayWhenHideTerminal.push(logEntry);
            }

            ListenerSocketIO.setListener('milestone', addMilestoneAndLogs);
        }]);
