window.onload = function () {
    const homePage = './html/Blank_page.html'
    const indexPage = './index.html'
    const wrap = document.getElementById('wrap')
    const body = document.querySelector('body') 
    const message = document.querySelector('h6')

    clearCookie()
    //因閒置登出 提示訊息
    if (window.location.search === '?timeout') {
        timeoutAlert()
    }
    //監聽事件
    body.addEventListener('click', (e) => {
        if (e.target.id === 'timeout_btn') {
            document.location.href = indexPage
        }
    })
    wrap.addEventListener('click', (e) => {
        if (e.target.nodeName === 'BUTTON') {
            console.log(123);
            const account_number = e.target.parentNode.children[2].value
            const password = e.target.parentNode.children[3].value
            postHandler(account_number, password)
        }
    })
    wrap.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            const account_number = e.path[1].children[2].value
            const password = e.path[1].children[3].value
            postHandler(account_number, password)
        }
    })
    //登入取金鑰
    function postHandler(account_number, password) {
        let obj = {
            "account_number": account_number,
            "password": password
        }
        axios.post(login_url, obj)
            .then(res => {
                message.innerText = ''
                let account_number = document.getElementById('account_number').value
                let token = res.data.data
                document.cookie = 'key=' + token;
                document.cookie = 'userId=' + account_number;
                //登入成功跳轉畫面
                if (res.data.status === 'success') {
                    document.location.href = homePage
                }
                console.log(res.data);
            })
            .catch(error => {
                console.error(error.response);
                message.innerText = '帳號或密碼錯誤，請重新輸入。'
            })
    }

    //清除cookie
    function clearCookie(){
        document.cookie = 'key= ;expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'userId= ;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    //逾時登出訊息
    function timeoutAlert() {
        const body = document.querySelector('body')
        let template = `
        <div id="timeout">
            <span>哎呀呀~你超過20分鐘沒看我了<br>你需要重新登入啦!</span>
            <button id="timeout_btn">好窩</button>
        </div>
        <div id="mask"></div>`
        body.insertAdjacentHTML('beforeend', template)
    }
}