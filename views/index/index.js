$(document).ready(() => {
    request(api.findUserAllItems, {
        name: window.localStorage.getItem('name'),
    }, 'POST').then((result) => {
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
                    itemPath,
                    date,
                    ownName
                } = i
                tempDom +=
                    `<div class="item">
                        <div class = "item-name text">${itemTitle}</div>
                        <div class = "text">创建者${ownName}</div>
                        <div class = "text">创建日期${formatDate(new Date(Number(date)))}</div>
                        <div class = "item-edit text" hash="${hash}">编辑</div> 
                        <div class = "item-delete text" hash="${hash}">删除</div>
                        <div class = "watch-item-js text" itemPath="${itemPath}">查看线上js</div>                    
                    </div>`
            })
            $('.content').append(tempDom)
        } else {
            alert(`登录失败${msg}`)
            window.location.href = `${API_BASE}/login`
        }
    })
})
$(document).on('click', '.header-right', function (e) {
    window.location.href = `${API_BASE}/editer`
})

$(document).on('click', '.watch-item-js', function (e) {
    window.open(API_BASE + $(this).attr('itemPath'))
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