angular.module('app.controllers').controller('TimeLineCtrl',
        ['$rootScope', '$scope', '$state', 'ListenerSocketIO', function ($rootScope, $scope, $state, ListenerSocketIO)
        {
            var ctrl = this;
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
            this.displayTerminal = function displayTerminal()
            {
                ctrl.showTerminal = true;
            };
            function addMilestoneAndLogs(data)
            {
                if (data.type) {
                    ctrl.displayWhenHideTerminal.unshift(data);
                }
                ctrl.events.unshift(data);
            }

            function init()
            {
                ListenerSocketIO.setListener('milestone', function (log)
                {
                    addMilestoneAndLogs(log);
                    $scope.$apply();
                });
                ListenerSocketIO.setListener('logs', function (log)
                {
                    addMilestoneAndLogs(log);
                    $scope.$apply();
                })
            }

            init();
        }]);