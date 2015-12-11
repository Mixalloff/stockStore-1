'use strict';

var app = angular.module('app',[]);

var formCreateStock = $("#stock");
var server = "https://obscure-headland-5700.herokuapp.com";
app.controller('Stock', function($scope,$http) {

    $http({
        method: 'GET',
        url: 'https://obscure-headland-5700.herokuapp.com/stocks/company?'+"&token="+getCookie("token")
    }).then(function successCallback(response) {
        var responseData = response.data;
        $scope.stocks = responseData.data;
        $scope.stocks.forEach(function(item) {
           item.startDate = new Date(item.startDate).toLocaleString().split(',')[0];
           item.endDate =  new Date(item.endDate).toLocaleString().split(',')[0];
        });

    }, function errorCallback(response) {
        alert("error");

    });

    $scope.add = function() {
        $.ajax({
            url: server + "/stocks/create",
            type: "post",
            data: formCreateStock.serialize() + "&token=" + getCookie("token"),
            success: function (result) {
                var resultJSON = JSON.parse(result);
                if (resultJSON.type == 'stock')
                {
                    var new_obj = new Object();
                    formCreateStock.serializeArray().forEach(function(item) {
                        if (item.name=="startDate" || item.name=="endDate")
                        {
                            new_obj[item.name] = new Date(item.value).toLocaleString().split(',')[0];
                        }
                        new_obj[item.name] = item.value;
                       });
                    new_obj['id'] = resultJSON.data;
                    $scope.stocks.push(new_obj);
                    $scope.$apply();
                    $.fancybox.close();
                }
            },
            error: function () {
                console.dir(arguments);
            }
        });
    };
    $scope.update = function(stock_id) {
        var stockForm = document.getElementsByClassName(stock_id)[0];
        var formEdit = document.getElementById("edit");
        [].forEach.call(formEdit.childNodes,function(element){
            if (element.nodeType != Node.TEXT_NODE)
            {
                var name = element.getAttribute("name");
                var value = stockForm.getAttribute("data-" + name);
                if (value) {
                    element.value = value;
                }
            }
        });

        formEdit.onsubmit = function(e)
        {
            e.preventDefault();
            var form = $(this);
            var data = form.serialize() + "&token=" + getCookie("token") + "&id=" + stock_id;
            $.ajax({
                type: 'POST',
                url: server + "/stocks/edit",
                data: data
            }).success(function(data) {
                var dataParsed = JSON.parse(data);
                $scope.stocks.forEach(function(item) {
                    if (item.id == stock_id)
                    {
                        form.serializeArray().forEach(function(form_item) {
                            item[form_item.name] = form_item.value;
                        });
                        $scope.$apply();
                    }
                    $.fancybox.close();
                });
            }).error(function(data) {
                alert("eror");
            })
        };
        $(stockForm).children("a#edit").fancybox();
        };

    $scope.sortField = 'startDate';
    $scope.reverse  = false;

    $scope.sort = function(name)
    {
        if ($scope.sortField == name)
        {
            $scope.reverse = !$scope.reverse;
        }
        else
        {
            $scope.sortField = name;
            $scope.reverse = false;
        }
    };
    $scope.isDown = function(name) {
        return $scope.sortField == name && $scope.reverse;
    }
    $scope.isUp = function(name) {
        return $scope.sortField == name && !$scope.reverse;
    }
});
