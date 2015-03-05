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
                var datamodel = $scope.datamodel;
                $scope.data = [];
                $scope.Filters = [];

                if (datamodel) {
                    datamodel.Extend = {
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

                    if (datamodel.Enable != false) datamodel.Enable = true;
                    var keys = datamodel.DefaultFilter;
                    if (keys) {
                        for (var l = 0, length = keys.length; l < length; l++) {
                            $scope.Filters.push({
                                Key: keys[l],
                                Value: ""
                            });
                        }
                    }

                    var cols = datamodel.ColumnDefs;
                    for (var k = 0, length = cols.length; k < length ; k++) {
                        var col = cols[k];
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
                        var desurl = datamodel.ApiUrl;
                        if (-1 == desurl.indexOf('?')) {
                            desurl = desurl + "?";
                        } else {
                            desurl = desurl + "&";
                        }
                        desurl = desurl + "$top=" + $scope.Page.pageSize;
                        if ($scope.Page.currentIndex > 0) {
                            desurl = desurl + "&$skip=" + $scope.Page.currentIndex * $scope.Page.pageSize;
                        }
                        if (datamodel.OrderBy) {
                            if (datamodel.OrderBy != "N/A") desurl = desurl + "&$orderby=" + datamodel.OrderBy;
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
                                "Authorization": "Bearer " + datamodel.Token
                            }
                        }).
                        success(function (data) {
                            $scope.data = data;
                            if (datamodel.OnDataLoaded) datamodel.OnDataLoaded(data);
                        }).
                        error(function (data) { });
                    };
                    $scope.Search = function () {
                        $scope.Page.firstPage();
                    };

                    if (datamodel.IsAutoLoad != false && datamodel.ApiUrl && datamodel.ApiUrl != "") $scope.Refresh();
                    if (!datamodel.PageToolbarMode) datamodel.PageToolbarMode = "Full";
                    else if (datamodel.PageToolbarMode == "None") {
                        $scope.Page.pageSize = 50;
                    }

                    delete datamodel.ExtCMDExt;
                    if (datamodel.ExtCMD) {
                        var delIndexs = [];
                        //可以整合权限
                        //for (var i = 0; i < datamodel.ExtCMD.length; i++) {
                        //    if (datamodel.ExtCMD[i].Permission) {
                        //        if (!permissions.hasPermission(datamodel.ExtCMD[i].Permission)) {
                        //            delIndexs.push(i);
                        //        }
                        //    }
                        //}
                        for (var i = 0, length = delIndexs.length; i < length; i++) {
                            datamodel.ExtCMD.splice(delIndexs[i], 1);
                        }
                        if (!datamodel.ECDisplayLength) datamodel.ECDisplayLength = 3;
                        if (datamodel.ExtCMD.length > datamodel.ECDisplayLength) {
                            datamodel.ExtCMDExt = datamodel.ExtCMD.slice(datamodel.ECDisplayLength - 1);
                            datamodel.ExtCMD.splice(datamodel.ECDisplayLength - 1);
                        }
                    }
                }
            };
            $scope.Init();
        }],
        templateUrl: 'directives/apTable.html'
    };
}]);