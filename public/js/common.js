$(document).ready(function () {
    var menu_items = ["Домой", "Акции", "Статистика"];
    $(".menu li").hover(
        function () {
            var index = $(this).index("li");
            var top_offset = 35 * (index + 1);
            $("<div class='hint' style='display:none top:" + top_offset + "px'>" + menu_items[index] + "</div>").insertAfter($(this)).fadeIn(500);
        },
        function () {
            var hint = $(this).next().remove();

        }
    );
    var formRegister = $("#signup");
    var server = "https://obscure-headland-5700.herokuapp.com";
    formRegister.submit(function (e) {
        $.ajax({
            url: server + "/auth/register/company",
            type: "post",
            data: formRegister.serialize(),
            success: function (result) {
                console.log(result);
                resultJSON = JSON.parse(result);
                setCookie("token", resultJSON.data, 1000);
            },
            error: function () {
                alert("error");
                console.dir(arguments);
            }
        });
        e.preventDefault();
    });


    $(".fancybox").fancybox();

    var ctx = $("#myChart").get(0).getContext("2d");

    var data = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                label: "My First dataset",
                fillColor: "rgba(220,220,220,0.5)",
                strokeColor: "rgba(220,220,220,0.8)",
                highlightFill: "rgba(220,220,220,0.75)",
                highlightStroke: "rgba(220,220,220,1)",
                data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
                label: "My Second dataset",
                fillColor: "rgba(151,187,205,0.5)",
                strokeColor: "rgba(151,187,205,0.8)",
                highlightFill: "rgba(151,187,205,0.75)",
                highlightStroke: "rgba(151,187,205,1)",
                data: [28, 48, 40, 19, 86, 27, 90]
            }
        ]
    };

    var myBarChart = new Chart(ctx).Bar(data);

    var riceData = {
        labels: ["January", "February", "March", "April", "May", "June"],
        datasets: [
            {
                fillColor: "rgba(172,194,132,0.4)",
                strokeColor: "#ACC26D",
                pointColor: "#fff",
                pointStrokeColor: "#9DB86D",
                data: [203000, 15600, 99000, 25100, 30500, 24700]
            }
        ]
    };

    var rice = document.getElementById('myChart2').getContext('2d');
    new Chart(rice).Line(riceData);

    //$(".stocks").jScrollPane({
    //});
    $("#dataPickerStart").datapicker();


});

