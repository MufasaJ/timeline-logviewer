(function ()
{
    'use strict';

    angular.module('app.directives').directive('autoScroll',
            ['$anchorScroll', '$location', function ($anchorScroll, $location)
            {
                var watch;
                return {
                    restrict: 'A',
                    scope: {
                        autoScroll: '='
                    },
                    link: function (scope, element)
                    {
                        var scroll;
                        var initWatch = scope.$watch(function ()
                        {
                            return element.children().length;
                        }, function ()
                        {
                            var old = $location.hash();
                            $anchorScroll($location.hash('bottom'));
                            $location.hash(old);
                        });

                        function createWatchToAutoScroll()
                        {
                            return scope.$watch(function ()
                            {
                                return element.children().length;
                            }, function ()
                            {
                                if (scroll) {
                                    var old = $location.hash();
                                    $anchorScroll($location.hash('bottom'));
                                    $location.hash(old);
                                }
                            });
                        }

                        scope.$watch('autoScroll', function (newValue, oldValue)
                        {
                            if (!newValue) {
                                watch = createWatchToAutoScroll();
                            } else if (!oldValue) {
                                watch();
                            }
                        });

                        $(window).scroll(function ()
                        {
                            initWatch();
                            scroll = $(window).scrollTop() + $(window).height() == $(document).height();
                        });

                    }
                }

            }])
})();