/**
 * 分页模块
 */

var template = require('lib/template');

var _total,     // 总记录数
    _pageSize,     // 每页显示的记录数
    _url;       // 请求数据的url


// 设置分页显示的文字信息
var _configs = {
    total: '条记录',
    next: '下一页',
    prev: '上一页',
    first: '首页',
    last: '末页',
    go: '跳转',
}

// 设置是否显示首页、上一页、下一页、尾页、go
var _normalization = {
    first: false,
    next: true,
    prev: true,
    last: false,
    go: false
}

// 返回“首页”字符串
function first() {
    return '<li id="first"><a href="javascript:;">'+ _configs.first +'</a></li>';
}

// 返回“尾页”字符串   
function last() {
    // let listNum = Math.ceil(_total/_pageSize);
    return '<li id="last"><a href="javascript:;">'+ _configs.last +'</a></li>';
}

// 返回“跳转”字符串
function go() {
    return '<li id="go"><input type="text" value=""/><button onclick="javascript:;">Go</button></li>';
}

// 返回"下一页"字符串
function next() {
    return '<li id="next"><a href="javascript:;">'+ _configs.next +'</a></li>';
}

// 返回"上一页"字符串
function prev() {
    return '<li id="prev"><a href="javascript:;">'+ _configs.prev +'</a></li>';
}

// 返回总页数字符串
function total() {
    return '<li><span>共'+ Math.ceil(_total/_pageSize) +'页</span><li>';
}

/**
 * 显示所有分页项信息
 * @param  {number} cur 当前页
 */
function pageList(cur) {
    var listNum = Math.ceil(_total/_pageSize);  // 总页数
    var start, end;     // 显示 从 start 到 end 的分页信息
    var res = '';   // 最终输出的字符串

    // 当前页前面显示5项，后面显示4项
    start = cur - 5;
    end = cur + 4;

    // 如果当前页<=5,则从第一项开始显示，最多显示10项
    if(cur - 5 <= 0 ) {start = 1; end = Math.min(listNum, 10)};
    
    // 如果当前页是最后5页，则显示最后10项
    if(cur + 4 >= listNum) {
        end = listNum;
        start = end - 9;
    }

    // 如果总项数小于10， 则显示全部项
    if(listNum <= 10) {
        start = 1;
        end = listNum;
    }

    // 是否需要 首页 和 上一页 分页信息
    if(_normalization.first === true) res += first();
    if(_normalization.prev === true) res += prev();

    // 中间数字显示分页信息部分
    while(start <= end) {
         res += '<li serial='+ start +'><a href="javascript:;">' + start + '</a></li>';
        start++;
    }

    // 是否需要 下一页、尾页和跳转 分页信息
    if(_normalization.next === true) res += next();
    if(_normalization.last === true) res += last();
    if(_normalization.go === true) res += go();

    // 总页数信息
    res += total();


    $('#pagination').html(res);    // 向模板中显示分页信息

    // 当前页为第一页，为上一页添加‘disabled’样式
    if(cur == 1) {
        $('li:contains('+_configs.prev+')').addClass("disabled");
    }

    // 当前页为最后一页，为下一页添加'disabled'样式
    if(cur == listNum) {
        $('li:contains('+_configs.next+')').addClass("disabled");
    }

    // 为当前页添加active样式
    $('li[serial='+ cur +']').addClass('active');

}

// 将对象a与b合并，用b中的同名属性覆盖a中的同名属性，a中不存在的属性不合并。 
function combine(a, b) {
    for(var key in b) {
        if(key in a) {
            a[key] = b[key];
        }
    }
    return a;
}


/**
 * Ajax请求下一页数据
 * @param {string} url         请求地址
 * @param {number} currentPage 要显示的当前页
 */
function setPage(url, currentPage) {

    $.ajax({
        type: 'post',
        url: url,
        data: {
            pageSize: _pageSize,
            currentPage: currentPage,
            totalNum: _total
        }
    }).done(function(data){
        $('#pagination li').removeClass('active disabled');    // 移除所有li的 active 和 disabled样式

        // 输出template模板信息
        $('#table-wrapper').html(template('template', data));
        
        // 更新分页项信息
        pageList(currentPage);

    }).fail(function(){
        console.log('加载失败！');
    })
}

function bindEvent() {
    var cur = 1;
    // 为分页项绑定click事件
    $(document).on("click", "#pagination li a", function(){
        var $pa = $(this).parent();  // 选择a元素的父元素，也就是li元素
        switch($pa.attr('id')){
            case 'first':
                cur = 1;
                break;
            case 'last':
                cur = Math.ceil(_total/_pageSize);
                break;
            case 'next':
            if(cur < Math.ceil(_total/_pageSize))
                cur++;
            break;
            case 'prev':
            if(cur > 1) cur--;
            break;
            default:
            cur = $pa.attr('serial'); 
        }

        setPage(_url, cur);      // 调用setPage刷新页面数据和分页信息
        
    });

    // 为分页的跳转按钮绑定click事件
    $(document).on("click", "#pagination li button", function(){
        var temp = parseInt($('#pagination li input').val());
        if(temp > 0 && temp <= Math.ceil(_total/_pageSize)){
            cur = temp;
            setPage(_url, cur);
        }   
    })

}






// 要输出的对象
var page = {
    // 初始化方法，用于初始化分页配置信息
    init: function(url, total, pageSize, normalization, configs) {
        _url = url;
        _total = total;
        _pageSize = pageSize;
       /* for(var key in configs) {
            if (key in _configs) {
                _configs[key] = configs[key];
            }
        }*/

        _configs = combine(_configs, configs);
        _normalization = combine(_normalization, normalization);
        pageList(1);
        bindEvent();
    },
    pageList: pageList
}


module.exports = page;