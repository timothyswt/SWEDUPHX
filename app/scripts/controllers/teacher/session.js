angular.module('inGuage').controller('TeacherSessionCtrl', ["$scope", "$http", "$io", "$timeout", "$location", "$routeParams", function ($scope, $http, $io, $timeout, $location, $routeParams) {
    $scope.session;

    $scope.states = {
        0: 0,
        1: 0,
        2: 0
    };
    $scope.studentsConnectedCount = 0;
    
    $scope.$watch('session', function() {
        // Count all distinct action states
        if ($scope.session && $scope.session.results) {
            var states = {};

            $scope.session.results.forEach(function(element) {
                if (!states[element.state]) {
                    states[element.state] = 0;
                }

                states[element.state]++;
            });

            $scope.session.results.states = states;
        }
    });
    
    // Calculate how long ago started
    var timeout = null;
    var updateFromNow = function() {
        // If called via setTimeout, have to use scope.apply so angular knows
        if ($scope.session && $scope.session.start) {
            $scope.session.momentFromNow = moment($scope.session.start).fromNow();
        }

        // Call again later
        $timeout.cancel(timeout);
        timeout = $timeout(updateFromNow, 60000);
    };
    $scope.showAssessments = false;

    $scope.toggleAssessments = function() {
        $scope.showAssessments = !$scope.showAssessments;
    };
    $scope.issueAssessment = function(assessment) {
        $http.post("/api/assessmentInstance/" + assessment._id + "/start").success(function(){
            $location.path("/teacher/session/" +  $routeParams.sessionId + "/assessment/" + assessment._id);
        });
    };
    
    $scope.startFeedback = function(){
        $location.path("/teacher/session/" +  $routeParams.sessionId + "/feedback");
    };
    // End the current session
    $scope.endSession = function(){
        $http.put('/api/session/' +  $routeParams.sessionId).success(function(){
            $location.path("/teacher");
        });
    };

    $scope.getPercent = function(val){
        return parseInt(100 * val);
    };
    var resultsByStudent = function(resultsArray){
        var students = {};
        if (!resultsArray ) {
            return students;
        }
        angular.forEach(resultsArray, function(item){
            if (!students[item.student]) {
                students[item.student] = [];
            }
            students[item.student].push(item);
        });
        return students;
    };
    $io.on('sessionresult:created', function() {
        $http.get("api/session/" +  $routeParams.sessionId + "/sessionResult").success(function(res) {
            var results = resultsByStudent(res.results);
            var states = {
                0: 0,
                1: 0,
                2: 0
            };
            var studentsConnectedCount = 0;

            if (results) {
                for (var key in results) {
                    var arr = results[key];
                    var result = arr[arr.length - 1];
                    if (typeof states[result.state] === 'number') {
                        states[result.state]++;
                        studentsConnectedCount++;
                    }
                };

                for (key in states) {
                    states[key] = states[key] / studentsConnectedCount || 0;
                }
            }

            $scope.states = states;
            $scope.studentsConnectedCount = studentsConnectedCount;
        });
    });
    
    $http.get("/api/session/" + $routeParams.sessionId).success(function(res){
        $scope.session = res.results;
        updateFromNow();
    });
    $http.get("/api/session/" + $routeParams.sessionId + "/assessmentInstance").success(function(res){
        $scope.assessments = res.results;
        updateFromNow();
    });
}]);