$(document).ready(() => {
    let loginEle = getUrlParams(window.location.href, 'loginEle') === 'sign';

    const pageShowStyle = () => {
        $(loginEle ? '.sign' : '.login').css('display', 'block')
    }

    pageShowStyle()

    $(document).on('click', '.submit', (e) => {
        const pageType = loginEle ? 'sign' : 'login'
        if ($(`.${pageType}-name`).val().trim() === '' || $(`.${pageType}-pass`).val().trim() === '') return
        let data = {
            name: $(`.${pageType}-name`).val(),
            pass: $(`.${pageType}-pass`).val()
        }
        if (loginEle) {
            // 注册
            request(api.sign, data, 'POST').then((result) => {
                console.log(result)
            }).catch((err) => {

            });
        } else {
            // 登录

        }
    })
})