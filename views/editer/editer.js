let inputCreateJson, inputTreeCreated, originValue

loginPermission(async () => {
    const itemHash = getUrlParams(window.location.href, 'itemHash')
    const itemTitle = getUrlParams(window.location.href, 'itemTitle')
    if (itemHash && itemTitle) {
        const originJsonContent = await request(`${API_BASE}/originValue/${itemTitle}-${itemHash}-origin.json`)
        $('.itemName').val(itemTitle)
        const itemGroups = $('.itemOwn').val().trim().split('')
        $('.editer-data').html(JSON.stringify(originJsonContent, null, 4))
        contentRender()

        $(document).on('click', '.addItem-add', function (e) {
            if (!inputCreateJson) {
                console.log('output内容不能为空')
                return
            }
            // editer authority
            request(api.editerAuth, {
                name: window.localStorage.getItem('name'),
                hash: itemHash,
                itemTitle,
                itemContent: JSON.stringify(inputCreateJson),
                originValue: JSON.stringify(originValue),
                itemGroups
            }, 'POST').then(result => {
                if (result.status === 200) {
                    console.log(result)
                } else {
                    alert('您无权编辑该项目')
                    window.location.href = `${API_BASE}/index`
                }
            })
        })
    } else {
        // create
        $(document).on('click', '.addItem-add', function (e) {
            const itemTitle = $('.itemName').val().trim()
            const itemGroups = $('.itemOwn').val().trim().split('')
            if (!itemTitle || !inputCreateJson) {
                console.log('项目名称 output内容不能为空')
                return
            }
            request(api.addItem, {
                ownName: window.localStorage.getItem('name'),
                itemTitle,
                itemGroups,
                itemContent: JSON.stringify(inputCreateJson),
                date: (new Date()).getTime(),
                originValue: JSON.stringify(originValue)
            }, 'POST').then(res => {

            })
        })
    }
})



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

$(document).on('keydown', '.editer-data', function (e) {
    if (e.key !== 'Tab') return
    event.preventDefault();
    const text = document.querySelector('.editer-data')
    text.setRangeText('    ')
    text.selectionStart += 4;
})
$(document).on('keyup', '.editer-data', function (e) {
    contentRender()
})

function contentRender() {
    try {
        originValue = JSON.parse($('.editer-data').val())

        inputTreeCreated = valTreeCreate(originValue)
        $('.editer-input').html(`<form class='formInput'>${inputTreeCreated}</form>`)

        const childArr = $('.formInput').children()
        inputCreateJson = treeJsonCreate(childArr)
        if (Object.keys(inputCreateJson).length) $('.editer-result').text(JSON.stringify(inputCreateJson, null, 4))
    } catch {
        $('.editer-input').html('')
        $('.editer-result').text('')
        console.log('请填写正确的json格式')
    }
}

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