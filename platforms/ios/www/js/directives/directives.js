angular.module("gameboard.directives", [])


.directive("starRating", function() {
  return {
    restrict : "A",
    template : "<ul class='rating'>" +
               "  <li ng-repeat='star in stars' ng-class='star' ng-click='toggle($index)'>" +
               "    <i class='fa fa-star'></i>" + //&#9733
               "  </li>" +
               "</ul>",
    scope : {
      ratingValue : "=",
      max : "=",
      onRatingSelected : "&"
    },
    link : function(scope, elem, attrs) {
      var updateStars = function() {
        scope.stars = [];
        for ( var i = 0; i < scope.max; i++) {
          scope.stars.push({
            filled : i < scope.ratingValue
          });
        }
      };
      scope.toggle = function(index) {
        scope.ratingValue = index + 1;
        scope.onRatingSelected({
          rating : index + 1
        });
      };
      scope.$watch("ratingValue", function(oldVal, newVal) {
        if (newVal) { updateStars(); }
      });
    }
  };
})

.directive("masonary", function () {
	return {
		restrict: "A",
		link: function ($scope, $element, $attrs) {

			// Register Masonary for our Directive.
			if ($scope.$last) {
				var parent = $($element.parent())[0];
				// TMD: msnry never used
				var msnry = new Masonry(parent, {
					// options
					columnWidth: 160,
					itemSelector: ".genreItem"
				});
			}
		}
	};
})

.directive("lazyload", function () {
	return {
		restrict: "A",
		link: function ($scope, $element, $attrs, $q) {

			$element.bind("load", function () {

				// Remove the Spinner
				$($element.parent()).removeClass("spinner");

				// Fade in the Image
				$($element).addClass("genre-image-show");
			});
		}
	};
})

.directive("swipe", function () {
	return {
		restrict: "A",
		link: function ($scope, $element, $attrs) {

			// Register Masonary for our Directive.
			if ($scope.$last) {

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


.directive("currentTime", function ($timeout, $filter) {
	return {
		restrict: "E",
		replace: true,
		template: "<span class='current-time'>{{currentTime}}</span>",
		scope: {
			localtz: "=",
		},
		link: function ($scope, $element, $attr) {
			$timeout(function checkTime() {
				if ($scope.localtz) {
					// TMD: WTF?
					$scope.currentTime = $filter("date")(+(new Date), "h:mm") + $scope.localtz;
				}
				$timeout(checkTime, 500);
			});
		}
	};
})

.directive("backgroundCycler", function ($compile, $animate) {
	var animate = function ($scope, $element, newImageUrl) {
		var child = $element.children()[0];

		var scope = $scope.$new();
		scope.url = newImageUrl;
		var img = $compile("<background-image></background-image>")(scope);

		$animate.enter(img, $element, null, function () {
			console.log("Inserted");
		});
		if (child) {
			$animate.leave(angular.element(child), function () {
				console.log("Removed");
			});
		}
	};

	return {
		restrict: "E",
		link: function ($scope, $element, $attr) {
			$scope.$watch("activeBgImage", function (v) {
				if (!v) {
					return;
				}
				console.log("Active bg image changed", v);
				// TMD: item never used
				var item = v,
					url = "./img/call-of-duty-ghosts.jpg";
				animate($scope, $element, url);
			});
		}
	};
})

.directive("backgroundImage", function ($compile, $animate) {
	return {
		restrict: "E",
		template: "<div class='bg-image'></div>",
		replace: true,
		scope: true,
		link: function ($scope, $element, $attr) {
			if ($scope.url) {
				$element[0].style.backgroundImage = "url(" + $scope.url + ")";
			}
		}
	};
});
