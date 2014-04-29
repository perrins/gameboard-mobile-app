angular.module('gameboard.directives', [])



.directive('masonary', function() {
    return {
        restrict: 'A',
        link: function($scope, $element, $attrs) {

            // Register Masonary for our Directive.
            if($scope.$last) {
              $($element.parent()).masonry({
                  columnWidth: 200,
                  itemSelector: '.genreItem'
              });
            }  

        }
    };
})

.directive('lazyload', function() {
    return {
        restrict: 'A',
        link: function($scope, $element, $attrs,$q) {

            var opts = {
                lines: 10, // The number of lines to draw
                length: 3, // The length of each line
                width: 2, // The line thickness
                radius: 3, // The radius of the inner circle
                color: '#000', // #rbg or #rrggbb
                speed: 1, // Rounds per second
                trail: 60, // Afterglow percentage
                shadow: false // Whether to render a shadow
            };

            $element.loadNicely({
                preLoad: function (img) {
                    //$(img).parent().spin(spinnerOptions);

                    var spinner = new Spinner(opts).spin($(img));
                },
                onLoad: function (img) {
                    $(img).fadeIn(200, function () {
                        var spinner = $(this).parent().data("spinner");
                        if (spinner)
                            spinner.stop();
                    });
                }
            });

        }
    };
})


.directive('swipe', function() {
    return {
        restrict: 'A',
        link: function($scope, $element, $attrs) {

            // Register Masonary for our Directive.
            if($scope.$last) {
   
                // Create the Slider
                this.swipe = new Swipe($element.parent().parent()[0], {
                  startSlide: 0,
                  speed: 400,
                  auto: 3000,
                  continuous: true,
                  disableScroll: true,
                  stopPropagation: false
                });
            }    

        }
    };
})


.directive('currentTime', function($timeout, $filter) {
    return {
        restrict: 'E',
        replace: true,
        template: '<span class="current-time">{{currentTime}}</span>',
        scope: {
            localtz: '=',
        },
        link: function($scope, $element, $attr) {


            $timeout(function checkTime() {

                if ($scope.localtz) {
                    $scope.currentTime = $filter('date')(+(new Date), 'h:mm') + $scope.localtz;
                }
                $timeout(checkTime, 500);
            });
        }
    }
})

.directive('backgroundCycler', function($compile, $animate) {
    var animate = function($scope, $element, newImageUrl) {
        var child = $element.children()[0];

        var scope = $scope.$new();
        scope.url = newImageUrl;
        var img = $compile('<background-image></background-image>')(scope);

        $animate.enter(img, $element, null, function() {
            console.log('Inserted');
        });
        if (child) {
            $animate.leave(angular.element(child), function() {
                console.log('Removed');
            });
        }
    };

    return {
        restrict: 'E',
        link: function($scope, $element, $attr) {
            $scope.$watch('activeBgImage', function(v) {
                if (!v) {
                    return;
                }
                console.log('Active bg image changed', v);
                var item = v;
                var url = "./img/call-of-duty-ghosts.jpg";
                animate($scope, $element, url);
            });
        }
    }
})

.directive('backgroundImage', function($compile, $animate) {
    return {
        restrict: 'E',
        template: '<div class="bg-image"></div>',
        replace: true,
        scope: true,
        link: function($scope, $element, $attr) {
            if ($scope.url) {
                $element[0].style.backgroundImage = 'url(' + $scope.url + ')';
            }
        }
    }
});
