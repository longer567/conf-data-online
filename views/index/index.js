$(document).ready(() => {
    request(api.findUserAllItems, {
        name: window.localStorage.getItem('name'),
    }, 'POST').then((result) => {
        const {
            status,
            msg
        } = result
        console.log(status === 200)
        if (status === 200) {
            
            

        } else {
            alert(`登录失败${msg}`)
            window.location.href = `${API_BASE}login`
        }
    })
})
$(document).on('click', '.header-right', function(e) {
    window.location.href = `${API_BASE}editer`
})