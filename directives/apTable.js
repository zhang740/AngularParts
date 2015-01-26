Aparts
.directive('aptable', [function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            datamodel: '='
        },
        controller: ['$scope', '$http', function ($scope, $http) {
            //controller: ['$scope', '$http', 'permissions', function ($scope, $http, permissions) {
            //var datamodel = {
            //    Extend: {
            //        ReInit: function () { },
            //        Clear: function () { },
            //        Refresh: function () { }
            //    },
            //    Token: "",
            //    ApiUrl: "",
            //    Enable: true,
            //    IsAutoLoad: true,
            //    OrderBy: "",
            //    PageToolbarMode: "Full/Simple/None",
            //    ColumnDefs: [
            //    {
            //        width: '',
            //        field: '',
            //        displayName: '',
            //        dataType: '',
            //        filterType: 'Text/Select',
            //        filterKey: 'Id eq %Value%',
            //        filterParam: [
            //        {
            //            Name: '',
            //            Key: ''
            //        }]
            //    }],
            //    DefaultFilter: [
            //    "Name eq 'xxx'"
            //    ],
            //    ExtCMD: [
            //    {
            //        Icon: "",
            //        Style: "",
            //        Name: "",
            //        Permission: "",
            //        Func: function (data) { }
            //    }],
            //    ECDisplayLength: 3,
            //    OnDataLoaded: function (data) { },
            //};

            $scope.Init = function () {

                $scope.data = [];

                $scope.Filters = [];

                if ($scope.datamodel) {
                    $scope.datamodel.Extend = {
                        ReInit: function () {
                            $scope.Init();
                        },
                        Refresh: function () {
                            $scope.Refresh();
                        },
                        Clear: function () {
                            $scope.data = [];
                        }
                    };
                    $scope.PageInfo = [{
                        pageSize: 10,
                    }, {
                        pageSize: 20,
                    }, {
                        pageSize: 50,
                    }];
                    $scope.Page = {
                        currentIndex: 0,
                        pageSize: $scope.PageInfo[0].pageSize,
                        firstPage: function () {
                            $scope.Page.currentIndex = 0;
                            $scope.Refresh();
                        },
                        prePage: function () {
                            if ($scope.Page.currentIndex > 0) {
                                $scope.Page.currentIndex--;
                                $scope.Refresh();
                            }
                        },
                        nextPage: function () {
                            if ($scope.data.length == $scope.Page.pageSize) {
                                $scope.Page.currentIndex++;
                                $scope.Refresh();
                            }
                        }
                    };
                    $scope.pageCfgChanged = function (page) {
                        $scope.Page.currentIndex = 0;
                        $scope.Refresh();
                    };

                    if ($scope.datamodel.Enable != false) $scope.datamodel.Enable = true;
                    if ($scope.datamodel.DefaultFilter) {
                        for (var l = 0; l < $scope.datamodel.DefaultFilter.length; l++) {
                            $scope.Filters.push({
                                Key: $scope.datamodel.DefaultFilter[l],
                                Value: ""
                            });
                        }
                    }

                    for (var k = 0; k < $scope.datamodel.ColumnDefs.length; k++) {
                        var col = $scope.datamodel.ColumnDefs[k];
                        if (col.filterType) {
                            switch (col.filterType) {
                                case "Text":
                                    $scope.Filters.push({
                                        Name: col.displayName,
                                        Key: col.filterKey,
                                        Type: col.filterType,
                                        Value: ""
                                    });
                                    break;

                                case "Select":
                                    $scope.Filters.push({
                                        Name: col.displayName,
                                        Key: col.filterKey,
                                        Type: col.filterType,
                                        Value: "",
                                        Param: col.filterParam
                                    });
                                    break;
                            }
                        }
                    }

                    $scope.Refresh = function () {
                        var desurl = $scope.datamodel.ApiUrl;
                        if (-1 == desurl.indexOf('?')) {
                            desurl = desurl + "?";
                        } else {
                            desurl = desurl + "&";
                        }
                        desurl = desurl + "$top=" + $scope.Page.pageSize;
                        if ($scope.Page.currentIndex > 0) {
                            desurl = desurl + "&$skip=" + $scope.Page.currentIndex * $scope.Page.pageSize;
                        }
                        if ($scope.datamodel.OrderBy) {
                            if ($scope.datamodel.OrderBy != "N/A") desurl = desurl + "&$orderby=" + $scope.datamodel.OrderBy;
                        } else {
                            desurl = desurl + "&$orderby=Id";
                        }
                        var isF = false;
                        for (var j = 0; j < $scope.Filters.length ; j++) {
                            if ($scope.Filters[j].Value && $scope.Filters[j].Value != "") {
                                if (isF) {
                                    desurl = desurl + " and ";
                                } else {
                                    isF = true;
                                    desurl = desurl + "&$filter=";
                                }
                                desurl = desurl + $scope.Filters[j].Key.replace("%Value%", $scope.Filters[j].Value);
                            }
                        }

                        $scope.data = [];
                        $http({
                            method: 'GET',
                            dataType: 'json',
                            url: desurl,
                            headers: {
                                "Authorization": "Bearer " + $scope.datamodel.Token
                            }
                        }).
                        success(function (data) {
                            $scope.data = data;
                            if ($scope.datamodel.OnDataLoaded) $scope.datamodel.OnDataLoaded(data);
                        }).
                        error(function (data) { });
                    };
                    $scope.Search = function () {
                        $scope.Page.firstPage();
                    };

                    if ($scope.datamodel.IsAutoLoad != false && $scope.datamodel.ApiUrl && $scope.datamodel.ApiUrl != "") $scope.Refresh();
                    if (!$scope.datamodel.PageToolbarMode) $scope.datamodel.PageToolbarMode = "Full";
                    else if ($scope.datamodel.PageToolbarMode == "None") {
                        $scope.Page.pageSize = 50;
                    }

                    delete $scope.datamodel.ExtCMDExt;
                    if ($scope.datamodel.ExtCMD) {
                        var delIndexs = [];
                        //可以整合权限
                        //for (var i = 0; i < $scope.datamodel.ExtCMD.length; i++) {
                        //    if ($scope.datamodel.ExtCMD[i].Permission) {
                        //        if (!permissions.hasPermission($scope.datamodel.ExtCMD[i].Permission)) {
                        //            delIndexs.push(i);
                        //        }
                        //    }
                        //}
                        for (var i = 0; i < delIndexs.length; i++) {
                            $scope.datamodel.ExtCMD.splice(delIndexs[i], 1);
                        }
                        if (!$scope.datamodel.ECDisplayLength) $scope.datamodel.ECDisplayLength = 3;
                        if ($scope.datamodel.ExtCMD.length > $scope.datamodel.ECDisplayLength) {
                            $scope.datamodel.ExtCMDExt = $scope.datamodel.ExtCMD.slice($scope.datamodel.ECDisplayLength - 1);
                            $scope.datamodel.ExtCMD.splice($scope.datamodel.ECDisplayLength - 1);
                        }
                    }
                }
            };
            $scope.Init();
        }],
        templateUrl: 'directives/apTable.html'
    };
}]);