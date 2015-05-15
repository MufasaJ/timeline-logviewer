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
                if ('*' === data.data.charAt(0)) {
                    data.primary = true;
                } else if ('?' === data.data.charAt(0)) {
                    data.warning = true;
                } else if ('!' === data.data.charAt(0)) {
                    data.danger = true;
                }
                ctrl.displayWhenHideTerminal.unshift(data);
            }

            function init()
            {
                ListenerSocketIO.setListener('milestone', function (log)
                {
                    addMilestoneAndLogs(log);
                });
            }

            init();
        }]);