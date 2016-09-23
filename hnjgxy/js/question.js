/**
 * Created by huqiwen on 16/4/20.
 */
//设置超时时间为10分钟
var timeout = 10;
//当前题目编号
var number = 0;
var correct = 0;
var isover = false;
var isright = false;
var maxnum = 19;
var GetAskUrl = 'http://pocketuni.net/index.php?app=wap&mod=Asking&act=questions&id=4';
var GetAnswerUrl = 'http://pocketuni.net/index.php?app=wap&mod=Asking&act=doAnswer';
var uid = null;

function show() {
    var showbox = $("#timer");
    showbox.html(timeout + "&emsp13;分钟");
    timeout--;
    if (timeout < 0) {
        showalert(2);
    } else {
        timeoutId = setTimeout("show()", 60000);
    }
}

$(function () {
    try {
        uid = Android.getUid();
        getask();
    } catch (e) {
        setTimeout(function () {
            try {
                uid = Android.getUid();
                getask();
            } catch (e) {
                alert(e);
            }
        }, 500);
    }
    //倒计时
    showalert(3);
    setTimeout(function () {
        if (!isover) {
            hidealert(3);
            show();
            setquestion(number);
        }

    }, 1500);


});
function showalert(type) {
    if (type == '1') {
        $('.h-back-cover').show();
        $('.h-back-cover').css('opacity', '0.2');
        $('.h-back-timeover').show();
    } else if (type == '2') {
        $('.h-back-cover').show();
        $('.h-back-cover').css('opacity', '0.2');
        $('.h-back-error').show();
    } else {
        $('.h-back-cover').show();
        $('.h-back-cover').css('opacity', '0.2');
        $('.h-back-loading').show();
    }
}
function hidealert(type) {
    if (type == '1') {
        $('.h-back-cover').css('opacity', '0');
        $('.h-back-cover').hide();
        $('.h-back-timeover').hide();
    } else if (type == '2') {
        $('.h-back-cover').css('opacity', '0');
        $('.h-back-cover').hide();
        $('.h-back-error').hide();
    } else {
        $('.h-back-cover').css('opacity', '0');
        $('.h-back-cover').hide();
        $('.h-back-loading').css('opacity', '0');
    }
}
$('.question-p').click(function (event) {
    if (typeof (Android) == "undefined") {
        alert("请在PU中打开");
        return false;
    }
    $('.question-a').attr("id", "");
    $('.question-p i').removeClass('choosed');
    $('.choose').remove();
    $(this).children('span').attr("id", "choose");
    $(this).children('span').after('<img class="choose" src="http://pic.pocketuni.net/data/sys_pic/wisdom/choose.png">');
    $(this).children('i').addClass('choosed');
    var qid = $('.question').data('question');
    var answer = $(".choosed").html();
//  clearTimeout(timeoutId);
    setTimeout(function () {
        getanswer(qid, number, answer);
        reset();
        if (isover) {
            showalert(1);
        } else {
            if (isright) {
                if (number < maxnum) {
                    number++;
                    setquestion(number);
                } else if (number == maxnum) {
                    window.location.href = 'rank.html';
                }
            } else {
                showalert(2);
            }
        }
    }, 200);

});

function getask() {
    number = 0;
    $.ajax({
        url: GetAskUrl,
        type: 'post',
        dataType: "json",
        data: {
            uid: uid
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        },
        success: function (data) {
            console.log(data)
            if (data.status == "0") {
                showalert(2);
            } else if (data.leftTimes != 0 && data.status == "1") {
                test = data;
            } else {
                isover = true;
                hidealert(3);
                showalert(2);
            }
        }
    });

}
function  setquestion(number) {
    if (number >= 0 && number <= 8) {
        $(".question-number").html("0" + (number + 1));
    } else {
        $(".question-number").html((number + 1));
    }
    $(".question-no").html((number + 1) + ".&emsp13;" + test.data.qusetion[number].title);
    $("#answer-a").html(test.data.qusetion[number].options[0]);
    $("#answer-b").html(test.data.qusetion[number].options[1]);
    $("#answer-c").html(test.data.qusetion[number].options[2]);
    $("#answer-d").html(test.data.qusetion[number].options[3]);
    $(".question").data("question", test.data.qusetion[number].id + "");
//  timeout = 600;
//  clearTimeout(timeoutId);
//  show();
}

function getanswer(id, numbers, content) {
    $.ajax({
        url: GetAnswerUrl,
        type: 'post',
        async: false,
        dataType: "json",
        data: {
            uid: uid,
            qid: id,
            number: (numbers + 1),
            answer: content,
            correct: (correct + 1)
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        },
        success: function (data) {
            console.log(data)
            if (data.status == "1") {
                isright = true;
            } else if (data.status == "2") {
                isright = true;
                correct = correct + 1;
            } else if (data.status == "0") {
                isright = false;
            } else {
                isover = true;
            }
        }
    });
}
function reset() {
    $('.question-a').attr("id", "");
    $('.question-p i').removeClass('choosed');
    $('.choose').remove();
}
