Aparts
.directive('apmodal', [function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            datamodel: '='
        },
        controller: ['$scope', function ($scope) {
            //var datamodel = {
            //    Extend: {
            //        Toggle: function () { },
            //        Show: function () { },
            //        Hide: function () { }
            //    },
            //    Id: "",
            //    Title: "",
            //    Style: "",
            //    Data: {},
            //    MultiLayoutManaged: {},
            //    ExtCMD: [
            //    {
            //        Icon: "",
            //        Style: "",
            //        Name: "",
            //        Func: function (data) { }
            //    }],
            //    OnInit: function (data) { },
            //    OnShow: function (data) { },
            //    OnShown: function (data) { },
            //    OnHide: function (data) { },
            //    OnHidden: function (data) { },
            //};

            if ($scope.datamodel) {
                if ($scope.datamodel.MultiLayoutManaged) {
                    if (!$scope.datamodel.MultiLayoutManaged.isInited) {
                        $scope.datamodel.MultiLayoutManaged.isInited = true;
                        $scope.datamodel.MultiLayoutManaged.CurrentLayout = null;
                        $scope.datamodel.MultiLayoutManaged.Layouts = [];
                    }
                }

                var isInited = false;
                var Init = function () {
                    isInited = true;
                    $('#' + $scope.datamodel.Id).on('show.bs.modal', function () {
                        if ($scope.datamodel.OnShow) $scope.datamodel.OnShow();
                        if ($scope.datamodel.MultiLayoutManaged) {
                            if ($scope.datamodel.MultiLayoutManaged.CurrentLayout != $scope.datamodel.Id) {
                                $scope.datamodel.MultiLayoutManaged.CurrentLayout = $scope.datamodel.Id;
                                if ($scope.datamodel.MultiLayoutManaged.Layouts.length > 0) {
                                    $('#' + $scope.datamodel.MultiLayoutManaged.Layouts.slice(-1)).modal('hide');
                                }
                                $scope.datamodel.MultiLayoutManaged.Layouts.push($scope.datamodel.Id);
                            }
                        }
                    });
                    $('#' + $scope.datamodel.Id).on('shown.bs.modal', function () {
                        if ($scope.datamodel.OnShown) $scope.datamodel.OnShown();
                    });
                    $('#' + $scope.datamodel.Id).on('hide.bs.modal', function () {
                        if ($scope.datamodel.OnHide) $scope.datamodel.OnHide();
                        if ($scope.datamodel.MultiLayoutManaged) {
                            if ($scope.datamodel.MultiLayoutManaged.CurrentLayout == $scope.datamodel.Id) {
                                $scope.datamodel.MultiLayoutManaged.Layouts.pop($scope.datamodel.Id);
                                if ($scope.datamodel.MultiLayoutManaged.Layouts.length > 0) {
                                    $scope.datamodel.MultiLayoutManaged.CurrentLayout = $scope.datamodel.MultiLayoutManaged.Layouts.slice(-1);
                                    $('#' + $scope.datamodel.MultiLayoutManaged.Layouts.slice(-1)).modal('show');
                                } else {
                                    $scope.datamodel.MultiLayoutManaged.CurrentLayout = null;
                                }
                            }
                        }
                    });
                    $('#' + $scope.datamodel.Id).on('hidden.bs.modal', function () {
                        if ($scope.datamodel.OnHidden) $scope.datamodel.OnHidden();
                    });

                    if ($scope.datamodel.OnInit) $scope.datamodel.OnInit();
                };

                $scope.datamodel.Extend = {
                    Toggle: function () {
                        if (!isInited) Init();
                        $('#' + $scope.datamodel.Id).modal('toggle');
                    },
                    Show: function () {
                        if (!isInited) Init();
                        $('#' + $scope.datamodel.Id).modal('show');
                    },
                    Hide: function () {
                        if (!isInited) Init();
                        $('#' + $scope.datamodel.Id).modal('hide');
                    }
                };
            }
        }],
        templateUrl: 'directives/apModal.html'
    };
}]);