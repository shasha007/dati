var GetRankUrl = 'http://pocketuni.net/index.php?app=wap&mod=Asking&act=simpleRanking&id=4';
//var GetRankUrl = "json/dd.json";
var RankNum = 1;
var uid = null;

$(function () {
    try {
        uid = Android.getUid();
        getrank();
        getheight();
    } catch (e) {
        setTimeout(function () {
            try {
                uid = Android.getUid();
                getrank();
                getheight();
            } catch (e) {
                alert("系统异常,请稍后再试");
            }
        }, 500);
    }

});

var getheight = function () {
    var img_height = $(".h-rank-header img").height();
    $(".h-rank-ul").css({"top": "-" + (img_height - 80) + "px", "height": (img_height - 120) + "px"});
    $(".h-rank-footer").css("top", "-" + (img_height - 80) + "px");
};

function getrank() {
    $.ajax({
        url: GetRankUrl,
        type: 'post',
        dataType: "json",
        data: {
            page: 1,
            uid: uid
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        },
        success: function (data) {
            console.log(data)
            if (data.status == '1') {
                var html = '';
                for (var i = 0; i < data.data.length; i++) {
                    html = html + '<li><p><span class="L-rankNum">' + RankNum + '</span>&emsp13;&emsp13;&emsp13;&emsp13;' + '<img class="L-icon-img" src=' + data.data[i].icon + '/>' + '&emsp13;' + data.data[i].uname + '&emsp13;&emsp13;&emsp13;' + data.data[i].score + '</p></li>';
                    RankNum++;
                }
                $('.h-rank-ul').append(html);
                $('.L-my-score').html(data.myscore);
            } else {
                $('.h-rank-ul').append('<li> <span>暂无排名</span></li>');
            }
        }
    });
}
