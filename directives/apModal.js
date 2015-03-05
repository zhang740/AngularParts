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

            var datamodel = $scope.datamodel;
            if (datamodel) {
                if (datamodel.MultiLayoutManaged) {
                    if (!datamodel.MultiLayoutManaged.isInited) {
                        datamodel.MultiLayoutManaged.isInited = true;
                        datamodel.MultiLayoutManaged.CurrentLayout = null;
                        datamodel.MultiLayoutManaged.Layouts = [];
                    }
                }

                var isInited = false;
                var Init = function () {
                    isInited = true;
                    $('#' + datamodel.Id).on('show.bs.modal', function () {
                        if (datamodel.OnShow) datamodel.OnShow();
                        if (datamodel.MultiLayoutManaged) {
                            if (datamodel.MultiLayoutManaged.CurrentLayout != datamodel.Id) {
                                datamodel.MultiLayoutManaged.CurrentLayout = datamodel.Id;
                                if (datamodel.MultiLayoutManaged.Layouts.length > 0) {
                                    $('#' + datamodel.MultiLayoutManaged.Layouts.slice(-1)).modal('hide');
                                }
                                datamodel.MultiLayoutManaged.Layouts.push(datamodel.Id);
                            }
                        }
                    });
                    $('#' + datamodel.Id).on('shown.bs.modal', function () {
                        if (datamodel.OnShown) datamodel.OnShown();
                    });
                    $('#' + datamodel.Id).on('hide.bs.modal', function () {
                        if (datamodel.OnHide) datamodel.OnHide();
                        if (datamodel.MultiLayoutManaged) {
                            if (datamodel.MultiLayoutManaged.CurrentLayout == datamodel.Id) {
                                datamodel.MultiLayoutManaged.Layouts.pop(datamodel.Id);
                                if (datamodel.MultiLayoutManaged.Layouts.length > 0) {
                                    datamodel.MultiLayoutManaged.CurrentLayout = datamodel.MultiLayoutManaged.Layouts.slice(-1);
                                    $('#' + datamodel.MultiLayoutManaged.Layouts.slice(-1)).modal('show');
                                } else {
                                    datamodel.MultiLayoutManaged.CurrentLayout = null;
                                }
                            }
                        }
                    });
                    $('#' + datamodel.Id).on('hidden.bs.modal', function () {
                        if (datamodel.OnHidden) datamodel.OnHidden();
                    });

                    if (datamodel.OnInit) datamodel.OnInit();
                };

                datamodel.Extend = {
                    Toggle: function () {
                        if (!isInited) Init();
                        $('#' + datamodel.Id).modal('toggle');
                    },
                    Show: function () {
                        if (!isInited) Init();
                        $('#' + datamodel.Id).modal('show');
                    },
                    Hide: function () {
                        if (!isInited) Init();
                        $('#' + datamodel.Id).modal('hide');
                    }
                };
            }
        }],
        templateUrl: 'directives/apModal.html'
    };
}]);