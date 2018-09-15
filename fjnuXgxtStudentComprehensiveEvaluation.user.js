// ==UserScript==
// @name        FJNU 学工系统 学生互评
// @description 学工系统 学生互评 自动测评 随机分数
// @description 使用时，请手动打开页面，【学生事务】 —— 【综合测评】 —— 【学生互评】 —— 选择评测学年--按F12进入开发者模式的console控制台，把代码粘贴进去按回车键
// @match       http://xgxt.fjnu.edu.cn/*
// @version     2.0.0
// @grant       none
// ==/UserScript==
//生成测评按钮
var html = '【<a href=\'javascript:void(0);\' id=\'post\'>点此开始学生互评</a>】';
$('<span></span>').appendTo($('#loginNameMain')).html(html);
var post = $('#post').css('color', 'blue').click(function() {
    var yearid = $("input[class=combo-value]").last().val();
    if (yearid == '' || yearid == null) {
        $.messager.alert('操作提示', '请手动打开这一页面：<span style="color:red">学生事务</span> / <span style="color:red">综合测评</span> / <span style="color:red">学生互评</span>，并选择需要评测的这一学年。若学年出错，请尝试刷新页面后重试。');
        return;
    }
    $('#post').text('互评中...');
    fjnuStudentEvaluation(yearid, false);
});

//评议
function fjnuStudentEvaluation(yearid, isRandom = false) {
    var queryUrl = 'http://xgxt.fjnu.edu.cn/studentComprehensiveEvaluation/queryByStuStu2StuComprehensiveEvaluation.do';
    $.post(queryUrl, {
        'page': '1',
        'rows': '100',
        'comprehensiveEvaluationPlan.schoolYear.schoolYearId': yearid,
        'isEvaluation': '0'
    },
    function(jsonStr) {
        if (jsonStr.total <= 0) {
            console.log('失败');
        } else {
            var table = '<div style="height:600px; width:230px; overflow:auto"><table border="1" style="height:550px; width:220px; text-align: center; "><tr><th>名字</th><th>结果</th><th>思政</th><th>文体</th></tr>';
            var resultStr = '';
            for (var index in jsonStr.rows) {
                var r = '<tr><td>' + jsonStr.rows[index].studentName + '</td>'; //名字
                console.log(index);
                var timeStamp = Date.now();
                var saveUrl = 'http://xgxt.fjnu.edu.cn/studentComprehensiveEvaluation/saveByStuStu2StuComprehensiveEvaluation.do';
                if(index>=0 && index<=4){
                    var stuScore = isRandom ? parseInt(Math.random() * 4 + 60, 10) : parseInt(Math.random() * 4 + 60, 10); // 随机则 70 分以上，不随机人人 80 分
                    var stuSportsScore = isRandom ? parseInt(Math.random() * 4 + 60, 10) : parseInt(Math.random() * 4 + 60, 10);

                }
                if(index>4 && index<33){
                    var stuScore = isRandom ? parseInt(Math.random() * 4 + 69, 10) : parseInt(Math.random() * 4 + 69, 10); // 随机则 70 分以上，不随机人人 80 分
                    var stuSportsScore = isRandom ? parseInt(Math.random() * 4 + 69, 10) : parseInt(Math.random() * 4 + 69, 10);

                }
                if(index >=33 && index<=54){
                    var stuScore = isRandom ? parseInt(Math.random() * 4 + 75, 10) : parseInt(Math.random() * 4 + 75, 10); // 随机则 70 分以上，不随机人人 80 分
                    var stuSportsScore = isRandom ? parseInt(Math.random() * 4 + 75, 10) : parseInt(Math.random() * 4 + 75, 10);

                }


                $.ajax({
                    url: saveUrl,
                    type: 'GET',
                    dataType: 'json',
                    cache: false,
                    async: false,
                    data: {
                        paramStr : jsonStr.rows[index].stu2StuComprehensiveEvaluationId + ',' + stuScore + ',' + stuSportsScore + '^',
                        _ : timeStamp
                    },
                    success: function(jsonStr2) {
                        if( jsonStr2.isSuccess) {
                            r = r + '<td style="color:green">成功</td>';
                        } else {
                            r = r + '<td style="color:red">失败</td>';
                        }
                    }
                });
                r = r + '<td>' + stuScore + '</td><td>' + stuSportsScore + '</td></tr>'; //分数
                resultStr = resultStr + r;

            }
            $('#post').text('学生互评已完成');
            table = table + resultStr;
            table = table + '</table></div>';

            $.messager.show({
                title: '测评结果',
                msg: table,
                height: 650,
                timeout: 10000,
                showType: 'slide'
            });
        }
    },
    'json');
}
