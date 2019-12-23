$(document).on('click', '.json-before', function (e) {
    let nowJsonDom = $($(e.target).parents()[0]);
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

$(document).on('click', '.addItem-input', function (e) {
    try {
        const val = JSON.parse($('.editer-data').val())
        const inputTreeCreated = valTreeCreate(val)

        $('.editer-input').html(`<form class='formInput'>${inputTreeCreated}</form>`)
    } catch {
        console.log('请填写正确的json格式')
    }

})

$(document).on('click', '.addItem-json', function (e) {
    try {
        const childArr = $('.formInput').children()
        if (!childArr.length) {
            console.log('请生成相应的inputTree')
            return
        }
        const inputCreateJson = treeJsonCreate(childArr)

        $('.editer-result').text(JSON.stringify(inputCreateJson, null, 4))

    } catch (err) {
        console.log(err)
    }

})

$(document).on('keydown', '.editer-data', function (e) {
    if (e.key !== 'Tab') return
    event.preventDefault();
    const text = document.querySelector('.editer-data')
    text.setRangeText('    ')
    text.selectionStart += 4;
})

function valTreeCreate(val) {
    let domTemp = ''
    for (let i in val) {
        if (['string', 'number'].includes(val[i].value) || ['string', 'number'].includes(typeof val[i].value)) {
            domTemp += `<div class='item'>
                    <div class='input-title'>
                        ${val[i].title} (${i})
                    </div>
                    <input class='input-content'
                        type='text'
                        value='${val[i].value}'
                        name='${i}'>
                    </input>
                </div>`
        } else if (['object'].includes(val[i].value) || ['object'].includes(typeof val[i].value)) {
            domTemp += `<div class='json' show='false'>${val[i].title} (${i})
                    <div class = 'json-before'></div>
                    <div class = 'json-content' name='${i}'>
                        ${valTreeCreate(val[i].value)}
                    </div>
                </div>`
        }
    }
    return domTemp
}

function treeJsonCreate(childArr) {
    let jsonTemp = {}
    for (let i in childArr) {
        const className = childArr[i].className
        if (className === 'item') {
            const itemChildren = $($(childArr[i]).children('.input-content')[0])
            jsonTemp[itemChildren.attr('name')] = itemChildren.val()
        } else if (className === 'json') {
            const itemChildren = $($(childArr[i]).children('.json-content')[0])
            jsonTemp[itemChildren.attr('name')] = treeJsonCreate(itemChildren.children())
        }
    }
    return jsonTemp
}