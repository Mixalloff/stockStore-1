$(document).ready(function () {

    var formRegister = $("#signup");
    var formLogin = $("#signin");
    var spinner = Config.spinner;

    //регистрация компании
    formRegister.submit(function (e) {
        spinner.start("spinner_register");
        e.preventDefault();
        var formData = new FormData(formRegister[0]);
        $.ajax({
            url: Config.registerCompany,
            type: "post",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (result) {
                resultJSON = JSON.parse(result);
                console.dir(resultJSON);
                if (resultJSON.type == "register")
                {
                    setCookie("token", resultJSON.data, Config.cookieExpiredDays);
                    $.fancybox.close();
                    window.location.href = Config.pageCompany;
                }
                else
                {
                    alertify.notify(resultJSON.data, 'error');
                    spinner.stop();
                }
            },
            error: function () {
                alertify.notify(Config.mesWrongRegister, 'error');
            }
        });
    });

    //авторизация компании
    formLogin.submit(function (e) {
        e.preventDefault();
        spinner.start("spinner_login");
        $.ajax({
            url: Config.authorizeCompany,
            type: "post",
            data: formLogin.serialize(),
            success: function (result) {
                resultJSON = JSON.parse(result);
                if (resultJSON.type == "token")
                {
                    setCookie("token", resultJSON.data, Config.cookieExpiredDays);
                    $.fancybox.close();
                    window.location.href = Config.pageCompany;
                }
                else
                {
                    alertify.notify(resultJSON.data, 'error');
                    spinner.stop();
                }

            },
            error: function () {
                alertify.notify(Config.mesWrongAuthorize, 'error');
            }
        });
    });

    //показ pop-up форм
    $(".fancybox").fancybox();

    $(".toggle-mnu").click(function() {
        $(this).toggleClass("on");
        $(".main-mnu").slideToggle();
        return false;
    });


});