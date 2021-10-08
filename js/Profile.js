window.onload = function () {
    const wrap = document.getElementById('wrap')
    let token = ''
    let userId = ''

    getCookieByName()
    getHeader()
    getNav()
    getHandler()
    reCalculateTime()

    //取用金鑰
    function parseCookie() {
        var cookieObj = {};
        var cookieAry = document.cookie.split(';');
        var cookie;
        for (var i = 0, l = cookieAry.length; i < l; ++i) {
            cookie = cookieAry[i].trim();
            cookie = cookie.split('=');
            cookieObj[cookie[0]] = cookie[1];
        }
        userId = cookieObj.userId
        token = 'Bearer ' + cookieObj.key
    }
    function getCookieByName() {
        var value = parseCookie();
        if (value) {value = decodeURIComponent(value);}
        return value;
    }
    //閒置過久登出
    body.addEventListener('mousemove',function(){reCalculateTime()})
    body.addEventListener('keydown',function(){reCalculateTime()})

    //監聽事件
    body.addEventListener('click', (e) => {
        if (e.target.id === 'timeout_btn'){logout()}
    })
    header.addEventListener('click', (e) => {
        //home btn導回借出列表
        if ( e.target.className === 'fa-home icon'){ 
            document.location.href = homePage
        }
    })
    wrap.addEventListener('click', (e) => {
        const button = document.querySelector('button')
        const check_btn = document.getElementById('check_btn')
        const close_btn = document.getElementById('close_btn')
        const wrapArray = wrap.children
        const h5Dom = document.querySelector('h5')
        //編輯
        if (e.target.innerText === '編輯' || e.target.classList[0] === 'fa-edit') {
            for (i = 0; i < wrapArray.length; i++) {
                if (wrapArray[i].nodeName === 'SPAN'){
                    wrapArray[i].children[0].removeAttribute('readonly', 'readonly')
                }
            }
            wrapArray[2].children[0].setAttribute('readonly', 'readonly')
            button.style.display = 'none'
            check_btn.style.display = 'block'
            close_btn.style.display = 'block'
            h5Dom.innerText = '*密碼需包含至少一個英文大寫、英文小寫及數字'
        }
        //確定
        if (e.target.innerText === '確定' || e.target.classList[0] === 'fa-checked') {
            const firstRegExp = /.*[A-Za-z]+.*[\d]+.*|.*[\d]+.*[A-Za-z]+.*/ //英文與數字的組成
            const capitalRegExp = /[A-Z]+/ //至少一個英文大寫
            const password = wrapArray[3].children[0].value 
            const postArray = []
            if ( password !== ""){
                if ( firstRegExp.test(password) == false || capitalRegExp.test(password) == false) { 
                    h5Dom.innerText = '*密碼需包含至少一個英文大寫、英文小寫及數字'
                    h5Dom.style.color = 'rgba(242, 48, 48, 0.8)'
                } else {
                    for (i = 0; i < wrapArray.length; i++) {
                        if (wrapArray[i].nodeName === 'SPAN'){
                            wrapArray[i].children[0].setAttribute('readonly', 'readonly')
                            postArray.push(wrapArray[i].children[0].value)
                        }
                    }
                    button.style.display = 'block'
                    check_btn.style.display = 'none'
                    close_btn.style.display = 'none'
                    h5Dom.innerText = ''
                    patchHandler(postArray)
                }
            } else {
                for (i = 0; i < wrapArray.length; i++) {
                    if (wrapArray[i].nodeName === 'SPAN'){
                        wrapArray[i].children[0].setAttribute('readonly', 'readonly')
                        postArray.push(wrapArray[i].children[0].value)
                    }
                }
                button.style.display = 'block'
                check_btn.style.display = 'none'
                close_btn.style.display = 'none'
                h5Dom.innerText = ''
                patchHandler(postArray)
            }
        }
        //取消
        if (e.target.innerText === '取消' || e.target.classList[0] === 'fa-close') {
            button.style.display = 'block'
            check_btn.style.display = 'none'
            close_btn.style.display = 'none'
            getHandler()
        }
    })
    //get使用者資訊
    function getHandler() {
        wrap.innerHTML = ""
        const obj ={
            "account_number": userId
        }
        axios.post(users_url , obj,{
            headers: {'Authorization': token}
        })
        .then(res => {
            data = res.data.data
            renderHandler(data)
        })
        .catch(error => {
            console.error(error.response);
        })
    }

    function renderHandler(data) {
        let template = `
            <h6><i class="fa-user icon"></i>個人資料</h6>
            <span>姓名 <input type="text" value="${data.user_name}" readonly="readonly"></span>
            <span>帳號 <input type="text" value="${userId}" readonly="readonly"></span>
            <span>密碼 <input type="password" value="" placeholder="**********" readonly="readonly"></span>
            <h5></h5>
            <span>電子信箱 <input type="text" value="${data.email}" readonly="readonly"></span>
            <button><i class="fa-edit icon"></i>編輯</button>
            <button id="close_btn"><i class="fa-close icon"></i>取消</button>
            <button id="check_btn"><i class="fa-checked icon"></i>確定</button>`
        wrap.insertAdjacentHTML('beforeend', template)
    }

    //編輯使用者資料
    function patchHandler(postArray) {
        const obj = {
            "account_number": userId,
            "profile": {
                "user_name": postArray[0],
                "email": postArray[3],
                "modifier_user": userId
            }
        }
        if ( postArray[2] !== ""){
            obj['account'] = {
                "password": postArray[2],
                "modifier_user": userId
            }
        }
        axios.patch(users_url, obj,{
            headers: {'Authorization': token}
        })
            .then(res => {
                editSuccess()
                getHandler()
                console.log(res)
            })
            .catch(error => {
                console.error(error.response);
            })
    }
}