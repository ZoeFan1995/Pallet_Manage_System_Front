var body = document.querySelector('body') 
var header = document.getElementById('header')
var nav = document.getElementById('nav')
var bar = document.getElementById('function_bar')
var footer = document.getElementById('footer')
var indexPage = '../index.html'
var homePage = '../html/Blank_page.html'
var oTimer;
var navArray = [{}]
let token = ''
let userId = ''
const check_btn = `<td class="last_td"><button id="check_btn"><i class="fa-checked icon"></i>確定</button></td>`
const close_btn = `<td class="second_last_td"><button id="close_btn"><i class="fa-close icon"></i>取消</button></td>`

getCookieByName()
//接金鑰
function parseCookie() {
    var cookieObj = {};
    var cookieAry = document.cookie.split(';');
    var cookie;
    for (var i = 0, l = cookieAry.length; i < l; ++i) {
        cookie = cookieAry[i].trim();
        cookie = cookie.split('=');
        cookieObj[cookie[0]] = cookie[1];
    }
    //非正常管道進入頁面
    if ( cookieObj.key === undefined){ 
        if ( window.location.pathname === '../index.html') { return }
        else { document.location.href = indexPage}
    }
    userId = cookieObj.userId
    token = 'Bearer ' + cookieObj.key
}

function getCookieByName() {
    var value = parseCookie();
    if (value) {
        value = decodeURIComponent(value);
    }
    return value;
}

//Header
function getHeader() {
    let template = `
    <h1><i class="fa-home icon"></i>棧板進出異動管理系統</h1>
    <span>${userId}</span>`
    header.insertAdjacentHTML('beforeend', template)
}

//Nav
function getNav() {
    const obj ={
        "account_number": userId
    }
    axios.post(permission_get_url, obj,{
        headers: {'Authorization': token}
    })
        .then(res => {
            const data = res.data.data
            navArray.item = data
        })
        .catch(err => {
            console.error(err);
        })
    BindValue(navArray, 'item', function (val) {
        val.forEach(item => {
            let template = `
            <li>
                <a href="./${item.app_url}?pd=${item.program_id}">
                    <i class="${item.app_icon}"></i>
                    ${item.program_name}
                </a>
            </li>`
            nav.insertAdjacentHTML('beforeend', template)
        });
        const liArray = nav.children
        for (var i = 0; i < liArray.length; i++) {
            const splitHref = nav.children[i].childNodes[1].href.split('')
            const index = splitHref.lastIndexOf('/')
            if ('/pallet/html' + nav.children[i].childNodes[1].href.substr(index) === window.location.pathname+window.location.search) {
                nav.children[i].setAttribute('class', 'active')
            }
        }
        const logout = `<li><a href="../index.html"><i class="fa-signout icon"></i>登出</a></li>`
        nav.insertAdjacentHTML('beforeend', logout)
    })
}

//Bar
function getBar() {
    let template = `
    <li><a id="add_btn"><i class="fa-add icon"></i>新增</a></li>
    <div id="search_bar"> 
        <i class="fa-search icon"></i>
        <input type="text" placeholder="search" value="">
    </div>`
    bar.insertAdjacentHTML('beforeend', template)
}

//nosearch_Bar
function getNoSearchBar() {
    let template = `
    <li><a id="add_btn"><i class="fa-add icon"></i>新增</a></li>`
    bar.insertAdjacentHTML('beforeend', template)
}

//footer
function getFooter() {
    let template = `
    <button id="previous"><i class="fa-arrow-left icon"></i>
    <button id="next"><i class="fa-arrow-right icon"></i>`
    footer.insertAdjacentHTML('beforeend', template)
}

//取得program_id
function getQueryParams(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const progid= urlParams.get('pd')
    return progid
}
//關閉已打開列表
function close_openTrs(){
    const openTrs = document.getElementsByClassName('bg_blue')
    for (let i = 0; i < openTrs.length; i++) {
        openTrs[i].nextElementSibling.style.display = 'none'
        openTrs[i].removeAttribute('class', 'bg_blue')
    }
}
//清除cookie
function clearCookie(){
    document.cookie = 'key= ;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'userId= ;expires=Thu, 01 Jan 1970 00:00:00 GMT';
}
//登出
function logout() {
    document.location.href = indexPage
}
//閒置20分鐘 登出
function reCalculateTime(){
    clearTimeout(oTimer)
    oTimer = setInterval(() => {
        clearCookie()
        document.location.href = indexPage + '?timeout'
    }, 20*60*1000);
    
}