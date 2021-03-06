const name = window.localStorage.getItem('name')
$(document).ready(() => {
    loginPermission(() => {
        request(api.findUserAllItems, {
            name,
        }, 'POST').then(result => {
            const {
                status,
                msg,
                data
            } = result
            console.log(status === 200)
            if (status === 200) {
                let tempDom = ``
                data.forEach(i => {
                    const {
                        hash,
                        itemTitle,
                        date,
                        ownName,
                        itemName
                    } = i
                    tempDom +=
                        `<div class="item">
                        <div class = "item-name text">${itemTitle}</div>
                        <div class = "text">创建者${ownName}</div>
                        <div class = "text">创建日期${formatDate(new Date(Number(date)))}</div>
                        <div class = "item-edit text" hash="${hash}" itemTitle="${itemTitle}">编辑</div> 
                        <div class = "item-delete text" hash="${hash}" itemTitle="${itemTitle}">删除</div>
                        <div class = "watch-item-json text" itemPath="/originValue/${itemName}-origin.json">查看线上json</div>
                        <div class = "watch-item-js text" itemPath="/jsItems/${itemName}.js">查看线上js</div>                    
                    </div>`
                })
                $('.content').append(tempDom)
            } else {
                alert(`登录失败${msg}`)
                window.location.href = `${API_BASE}/login`
            }
        })
    })
});

[{
    DOM: '.header-right',
    func() {
        window.location.href = `${API_BASE}/editer`
    }
}, {
    DOM: '.watch-item-js',
    func() {
        window.open(API_BASE + $(this).attr('itemPath'))
    }
}, {
    DOM: '.watch-item-json',
    func() {
        window.open(API_BASE + $(this).attr('itemPath'))
    }
}, {
    DOM: '.item-edit',
    func() {
        window.location.href = `${API_BASE}/editer?itemHash=${$(this).attr('hash')}&itemTitle=${$(this).attr('itemTitle')}`
    }
}, {
    DOM: '.header-logout',
    func() {
        localStorage.clear()
        window.location.href = `${API_BASE}/login`
    }
}, {
    DOM: '.item-delete',
    func() {
        request(api.deleteItemByHash, {
            name,
            hash: $(this).attr('hash'),
            itemTitle: $(this).attr('itemTitle')
        }, 'POST').then(res => {
            console.log(res)
        })
    }
}].forEach(i => {
    $(document).on('click', i.DOM, i.func)
})

const formatDate = (timer) => {
    const year = timer.getFullYear()
    const month = timer.getMonth() + 1
    const date = timer.getDate()
    const hour = timer.getHours()
    const minute = timer.getMinutes()
    const second = timer.getSeconds()
    return `${year}/${month}/${date} - ${hour}:${minute}:${second}`
}