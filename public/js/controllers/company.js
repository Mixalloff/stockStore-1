'use strict';

if (getCookie("token")=="")
{
    window.location.href = Config.pageMain
}

var app = angular.module('app',[]);

var formCreateStock = $("#stock");


var menu_items = Config.menuCompanyItems;

$(".menu li").hover(
    function () {
        var index = $(this).index("li");
        var top_offset = Config.menuItemOffset * (index + 1);
        $("<div class='hint' style='display:none top:" + top_offset + "px'>" + menu_items[index] + "</div>").
        insertAfter($(this)).fadeIn(Config.menuFadeIn);
    },
    function () {
        var hint = $(this).next().remove();
    }
);

$("#logout").click(function() {
    deleteCookie("token");
    window.location.href = Config.pageMain;
});

$(".fancybox").fancybox();

app.controller('Stock', function($scope,$http) {

    //получение акций компании
    $http({
        method: 'GET',
        url: Config.getStocks+"?token="+getCookie("token")
    }).
    then(function successCallback(response) {
        var responseData = response.data;
        $scope.stocks = responseData.data;
        $scope.stocks.forEach(function(item) {
        item.startDate = new Date(item.startDate);
        item.endDate =  new Date(item.endDate);
        });

    }, function errorCallback(response) {
        alertify.notify(Config.mesWrongGetStocks, 'error');
    });

        //запрос на получение информации о компании
        $.ajax({
            url: Config.getCompanyInfo + "?token="+getCookie("token"),
            type: "get",
            success: function (result) {
                var resultJSON = JSON.parse(result).data;
                $("#avatar").attr("src",server + resultJSON.logo);
                $("#company_name").html(resultJSON.name);
                document.title = resultJSON.name;
            },
            error: function () {
                alertify.notify(Config.mesWrongGetCompanyInfo, 'error');
            }
        });

    //добавление акции
    $scope.add = function() {
        var formData = new FormData(formCreateStock[0]);
        formData.append("token",getCookie("token"));
        $.ajax({
            url: Config.createStock,
            type: "post",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (result) {
                var resultJSON = JSON.parse(result);
                if (resultJSON.type == 'stock')
                {
                    var new_obj = new Object();
                    formCreateStock.serializeArray().forEach(function(item) {
                        if (item.name=="startDate" || item.name=="endDate")
                        {
                            new_obj[item.name] = new Date(item.value);
                        }
                        else
                        new_obj[item.name] = item.value;
                       });
                    console.dir(resultJSON.data);
                    new_obj['id'] = resultJSON.data.id;
                    new_obj['logo'] = resultJSON.data.logo;
                    $scope.stocks.push(new_obj);
                    $scope.$apply();
                    $.fancybox.close();
                }
            },
            error: function () {
                alertify.notify(Config.mesWrongAddStock, 'error');
            }
        });
    };

    //обновление акции
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
            var formData = new FormData(form[0]);
            formData.append("token",getCookie("token"));
            formData.append("id",stock_id);
            $.ajax({
                type: 'POST',
                url: Config.editStock,
                data: formData,
                cache: false,
                contentType: false,
                processData: false
            }).success(function(data) {
                var dataParsed = JSON.parse(data);
                $scope.stocks.forEach(function(item) {

                    if (item.id == stock_id)
                    {
                        form.serializeArray().forEach(function(form_item) {
                                item[form_item.name] = form_item.value;
                        });
                        var elem = document.getElementsByClassName(item.id)[0];
                        elem.style.background = "url(" +server + dataParsed.data + ")";
                        $scope.$apply();
                    }
                });
                $.fancybox.close();
            }).error(function(data) {
                alertify.notify(Config.mesWrongEditStock, 'error');
            })
        };
        $(stockForm).children("a#edit").fancybox();
        };

    //удаление акции

    $scope.remove = function(stock_id) {
        var response = confirm("Вы действительно хотите удалить акцию?");
        if (response) {
            $.ajax({
                type: "post",
                url: Config.removeStock,
                data: {token: getCookie("token"), id: stock_id}
            }).success(function (data) {

                $scope.stocks.forEach(function(item,index) {
                    if (item['id']==stock_id)
                    {
                        $scope.stocks.splice(index,1);
                    }
                });
                $scope.$apply();
                alertify.notify(Config.mesSuccessRemoveStock, 'success');
            }).error(function (data) {
                alertify.notify(Config.mesWrongRemoveStock, 'error');
            });
        }
    };

    //сортировка акции по дате
    $scope.sortField = 'startDate';
    $scope.reverse  = true;

    $scope.sort = function(name)
    {
        if ($scope.sortField == name)
        {
            $scope.reverse = !$scope.reverse;
        }
        else
        {
            $scope.sortField = name;
            $scope.reverse = true;
        }
    };
    $scope.isDown = function(name) {
        return $scope.sortField == name && $scope.reverse;
    }
    $scope.isUp = function(name) {
        return $scope.sortField == name && !$scope.reverse;
    }

});
