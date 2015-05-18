angular.module('app.controllers').controller('TimeLineCtrl',
        ['$rootScope', '$scope', '$state', 'ListenerSocketIO', 'moment', function ($rootScope, $scope, $state, ListenerSocketIO, moment)
        {
            var ctrl = this;
            var milestones = {};
            this.logs = [];
            this.milestones = [];
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
                    ctrl.milestones.push(logEntry)
                } else if (match = data.data.match(milestoneEnd)) {
                    logEntry.id = match[5];
                    logEntry.title = 'FINISH:' + match[5];
                    logEntry.description = match[6];
                    logEntry.milestone = true;
                    var startingMilestone = milestones[logEntry.id];
                    if (startingMilestone) {
                        startingMilestone.title = logEntry.title;
                        startingMilestone.description = logEntry.description;
                        startingMilestone.elapsedTime = logEntry.date - startingMilestone.date;
                        startingMilestone.elapsedTimeHumanized = moment.duration(logEntry.elapsedTime / -1000, 'seconds').humanize();
                    } else {
                        ctrl.milestones.push(logEntry)
                    }
                }
                logEntry.data = data.data;
                ctrl.logs.push(logEntry);
            }

            ListenerSocketIO.setListener('milestone', addMilestoneAndLogs);
        }]);
