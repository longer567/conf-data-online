$(document).ready(() => {
    const loginEle = getUrlParams(window.location.href, 'loginEle') === 'sign';

    const pageShowStyle = () => {
        $('.text').html(loginEle ? '登录' : '注册')
        $(loginEle ? '.sign' : '.login').css('display', 'block')
    }

    loginPermission(() => {
        pageShowStyle()

        $(document).on('click', '.text', (e) => {
            window.location.href = `${API_BASE}/login${loginEle ? '' : '?loginEle=sign'}`
        })

        $(document).on('click', '.submit', (e) => {
            const pageType = loginEle ? 'sign' : 'login'
            if ($(`.${pageType}-name`).val().trim() === '' || $(`.${pageType}-pass`).val().trim() === '') return
            let data = {
                name: $(`.${pageType}-name`).val(),
                pass: $(`.${pageType}-pass`).val()
            }
            if (loginEle) {
                // 注册
                request(api.sign, data, 'POST').then(result => {
                    console.log(result)
                }).catch((err) => {

                });
            } else {
                // 登录
                request(api.login, data, 'POST').then(result => {
                    const {
                        status,
                        msg,
                        data
                    } = result
                    if (status === 200) {
                        for (let i in data) {
                            window.localStorage.setItem(i, data[i])
                        }
                        window.location.href = `${API_BASE}/index`
                        console.log(window.localStorage)
                    } else {
                        console.log(msg)
                    }
                })
            }
        })
    })
})