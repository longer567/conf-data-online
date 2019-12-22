$(document).on('click', '.json-before', function (e) {
    var nowJsonDom = $($(e.target).parents()[0]);
    console.log(nowJsonDom.attr('index'))
    console.log(nowJsonDom.attr('cj'))
    if (nowJsonDom.attr('show') === 'true') {
        nowJsonDom.children('.json-content').css('height', '0')
        nowJsonDom.children('.json-before').css('transform', 'rotate(0)')
        nowJsonDom.attr('show', 'false')
    } else {
        nowJsonDom.children('.json-content').css('height', 'auto')
        nowJsonDom.children('.json-before').css('transform', 'rotate(90deg)')
        nowJsonDom.attr('show', 'true')
    }
})

// 创建点击
$(document).on('click', '.addItem', function (e) {
    console.log($('.editer-data').val())
})

// request(api.addItem, {
//     itemName: 'test1',
//     itemContent: {

//     }
// }).then(res=> console.log(res))