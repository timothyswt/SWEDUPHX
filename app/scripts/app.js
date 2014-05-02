angular.module('inGuage', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ui.bootstrap',
    'btford.socket-io'
])
.factory('$io', ['socketFactory', function (socketFactory) {
    return socketFactory({
        ioSocket: io.connect('/', { resource:'socket.io' })
    });
}])
.factory('$authInterceptor', ["$q", "$window", "$location", function ($q, $window, $location) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.localStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
            }
            return config;
        },
        responseError: function (response) {
            if (response.status === 401 && $location.path().indexOf("login") === -1) {
                delete $window.localStorage.token;
                $location.path("/login/student");
            }
            return response || $q.when(response);
        }
    };
}])
.config(["$routeProvider", "$locationProvider", "$httpProvider", function ($routeProvider, $locationProvider, $httpProvider){
    $routeProvider
        /* Login routes */
        .when('/login/student', {
            templateUrl: 'partials/student/login',
            controller: 'StudentLoginCtrl'
        })
        .when('/login/teacher', {
            templateUrl: 'partials/teacher/login',
            controller: 'TeacherLoginCtrl'
        })
        .when('/login/register', {
            templateUrl: 'partials/register',
            controller: 'RegisterCtrl'
        })
        /* Student Routes */
        .when('/student/session/:id', {
            templateUrl: 'partials/student/session',
            controller: 'StudentSessionCtrl'
        })
        .when('/student/assessment/:sessionId', {
            templateUrl: 'partials/student/assessment',
            controller: 'StudentAssessmentCtrl'
        })
        .when('/student/feedback/:sessionId', {
            templateUrl: 'partials/student/feedback',
            controller: 'StudentFeedbackCtrl'
        })
        /* Teacher routes*/
        .when('/teacher', {
            templateUrl: 'partials/teacher/index',
            controller: 'TeacherIndexCtrl'
        })
        .when('/teacher/session/:id', {
            templateUrl: 'partials/teacher/session',
            controller: 'TeacherSessionCtrl'
        })
        .when('/teacher/session/:id/manage', {
            templateUrl: 'partials/teacher/sessionDetail',
            controller: 'TeacherSessionCtrl'
        })
        .when('/teacher/assessments', {
            templateUrl: 'partials/teacher/assessments',
            controller: 'TeacherAssessmentsCtrl'
        })
        .when('/teacher/assessment/:id', {
            templateUrl: 'partials/teacher/assessmentDetail',
            controller: 'TeacherAssessmentDetailCtrl'
        })
        .when('/teacher/feedback/:sessionId', {
            templateUrl: 'partials/teacher/feedback',
            controller: 'TeacherFeedbackCtrl'
        })
        .when('/reports', {
            templateUrl: 'partials/reports/index',
            controller: 'ReportsIndexCtrl'
        })
        .when("/logout", {
            templateUrl: 'partials/logout',
            controller: 'LogoutCtrl'
        })
        .otherwise({
            redirectTo: '/login/student'
        });
    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('$authInterceptor');
}]);
