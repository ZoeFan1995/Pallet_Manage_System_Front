window.onload = function(){
    const add_permission_span = `<span class="add_pm"><i class="fa-add icon"></i></span>`
    const tBody = document.querySelector('tbody')
    const listArray = [{}]
    let token = ''
    let userId = ''
    let program_id = getQueryParams();

    getCookieByName()
    getHeader()
    getNav()
    getHandler()

    //接金鑰
    function parseCookie() {
        var cookieObj = {};
        var cookieAry = document.cookie.split(';');
        var cookie;
        for (var i=0, l=cookieAry.length; i<l; ++i) {
            cookie = cookieAry[i].trim();
            cookie = cookie.split('=');
            cookieObj[cookie[0]] = cookie[1];
        }
        userId = cookieObj.userId
        token = 'Bearer '+cookieObj.key
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
    bar.addEventListener('click', (e)=>{
        if (e.target.id === 'add_btn' || e.target.className === 'fa-baby icon'){
            add_user_pop()
        }
    })
    tBody.addEventListener('click', (e)=>{
        const tr = e.target.parentElement;
        //打開列表
        if (tr.nodeName === 'TR' && tr.classList[0] !== 'detail'){
            const detailTrDom = tr.nextElementSibling;
            if ( tr.classList.contains('bg_blue') === true){
                tr.classList.remove('bg_blue')
                document.getElementsByClassName(detailTrDom.classList[1])[0].style.display = 'none'
            } else {
                close_openTrs()
                tr.classList.add('bg_blue')
                document.getElementsByClassName(detailTrDom.classList[1])[0].style.display = 'inline-block'
            };
        }
        //編輯-使用者資訊
        if ( e.target.className === 'fa-edit icon' && e.target.parentElement.classList[0] === 'edit_userdata'){
            const datailTr = e.target.offsetParent.parentElement.children
            if ( e.target.parentElement.classList.contains('active') === false){
                e.target.parentElement.classList.toggle('active')
                datailTr[2].children[0].removeAttribute('readonly', 'readonly')//名字
                datailTr[4].children[0].removeAttribute('readonly', 'readonly')//密碼
                datailTr[5].children[0].removeAttribute('readonly', 'readonly')//電子信箱
            } else {
                e.target.parentElement.classList.toggle('active')
                datailTr[2].children[0].setAttribute('readonly', 'readonly')//名字
                datailTr[4].children[0].setAttribute('readonly', 'readonly')//密碼
                datailTr[5].children[0].setAttribute('readonly', 'readonly')//電子信箱
                patchHandler(datailTr)
            }
        }
        //可編輯-使用者權限
        if ( e.target.className === 'fa-edit icon' && e.target.parentElement.classList[0] === 'edit_pm'){
            const pm_box = e.target.parentElement.parentElement
            const permission_box = e.target.parentElement.parentElement.nextElementSibling
            const numRegExp = /^\d{5}/
            if ( e.target.parentElement.classList.contains('active') === false){
                e.target.parentElement.classList.toggle('active')
                pm_box.insertAdjacentHTML('beforeend', add_permission_span)
                if ( numRegExp.test(permission_box.children[0].innerText) === true){
                    for (let i = 0; i < permission_box.children.length; i++) {
                        let closeSapn = `<i class="fa-close icon"></i>`
                        permission_box.children[i].insertAdjacentHTML('beforeend', closeSapn)
                    }
                }
            } else {
                e.target.parentElement.classList.toggle('active')
                pm_box.removeChild(document.getElementsByClassName('add_pm')[0])
                if ( numRegExp.test(permission_box.children[0].innerText) === true) {
                    for (let i = 0; i < permission_box.children.length; i++) {
                        permission_box.children[i].removeChild(permission_box.children[i].children[0])
                    }
                }
            }
        }
        //新增-使用者權限
        if ( e.target.className === 'fa-add icon' && e.target.parentElement.className === 'add_pm'){
            add_permission_pop()
        }
        //刪除-使用者權限
        if (e.target.className === 'fa-close icon' && e.target.offsetParent.className === 'permission_box'){
            const user_program_id = e.target.parentElement.innerText.substr(0,5)
            const user_id = document.getElementsByClassName('bg_blue')[0].children[0].innerText
            deletePmHandler(user_id, user_program_id)
        }
        //刪除-使用者
        if (e.target.className === 'fa-grave icon' || e.target.className === 'delet_user'){
            const user_id = document.getElementsByClassName('bg_blue')[0].children[0].innerText
            deleteHandler(user_id)
        }
        //離職-使用者
        if (e.target.className === 'fa-bye icon' || e.target.className === 'resign_user'){
            const user_id = document.getElementsByClassName('bg_blue')[0].children[0].innerText
            const active = false;
            resignUser(user_id, active)
        }
        //復職-使用者
        if (e.target.className === 'fa-baby icon' || e.target.className === 'resume_user'){
            const user_id = document.getElementsByClassName('bg_blue')[0].children[0].innerText
            const active = true;
            resignUser(user_id, active)
        }
    })
    body.addEventListener('keyup', (e)=>{
        //新增-使用者權限-確定(enter)
        if (e.key === 'Enter' && e.target.parentElement.className === 'add_permission'){
            const user_id = document.getElementsByClassName('bg_blue')[0].children[0].innerText
            const div_Pop = e.target.parentElement.children
            const numRegExp = /^\d{5}/
            if ( numRegExp.test(div_Pop[2].value) === false) {
                div_Pop[3].innerText = '程式代號需為五碼數字'
                setTimeout(function(){
                    div_Pop[3].innerText = ''
                }, 3000)
            } else { postPmHandler(user_id, div_Pop[2].value)}
        }
        //新增-使用者-確定(enter)
        if (e.key === 'Enter' && e.target.parentElement.className === 'add_user'){
            const div_Pop = document.getElementsByClassName('add_user')[0].children
            var valueIsNull = 0;
            for(var i = 0; i < div_Pop.length; i++){
                if (div_Pop[i].nodeName === "INPUT"){
                    if ( div_Pop[i].value === ""){
                        div_Pop[i].setAttribute('class', 'change')
                        valueIsNull = 1
                    }}};
            if ( valueIsNull === 0 && div_Pop[2].value.length === 5) {postHandler(div_Pop)}
            else { 
                div_Pop[6].innerText ='使用者帳號需為五碼'
                setTimeout(function(){
                    div_Pop[6].innerText = ''
                }, 3000)
            };
        }
    })
    body.addEventListener('click', (e)=>{
        //新增-使用者-關閉
        if (e.target.parentElement.className === 'add_user' && e.target.className === 'fa-close icon'){
            close_pop()
        }
        //新增-使用者-確定
        if (e.target.id === 'check_btn' && e.target.parentElement.className === 'add_user'){
            const div_Pop = document.getElementsByClassName('add_user')[0].children
            var valueIsNull = 0;
            for(var i = 0; i < div_Pop.length; i++){
                if (div_Pop[i].nodeName === "INPUT"){
                    if ( div_Pop[i].value === ""){
                        div_Pop[i].setAttribute('class', 'change')
                        valueIsNull = 1
                    }}};
            if ( valueIsNull === 0 && div_Pop[2].value.length === 5) {postHandler(div_Pop)}
            else { 
                div_Pop[6].innerText ='使用者帳號需為五碼'
                setTimeout(function(){
                    div_Pop[6].innerText = ''
                }, 3000)
            };
        }
        //新增-使用者權限-關閉
        if (e.target.parentElement.className === 'add_permission' && e.target.className === 'fa-close icon'){
            close_pop()
            getHandler()
        }
        //新增-使用者權限-確定
        if (e.target.id === 'check_btn' && e.target.parentElement.className === 'add_permission'){
            const user_id = document.getElementsByClassName('bg_blue')[0].children[0].innerText
            const div_Pop = e.target.parentElement.children
            const numRegExp = /^\d{5}/
            if ( numRegExp.test(div_Pop[2].value) === false) {
                div_Pop[3].innerText = '程式代號需為五碼數字'
                setTimeout(function(){
                    div_Pop[3].innerText = ''
                }, 3000)
            } else { postPmHandler(user_id, div_Pop[2].value)}
        }
    })

    //取得所有使用者資訊
    function getHandler(){
        tBody.innerHTML = ""
        tBody.innerHTML = `
        <tr id="list_tittle">
            <td>使用者帳號:</td>
            <td>使用者名稱:</td>
            <td>電子信箱:</td>
        </tr>`
        const obj = {
            "program_id": program_id,
            "account_number": userId
        }
        axios.post(users_getAll_url ,obj ,{
            headers: {'Authorization': token}
        })
        .then(res => {
            const data = res.data.data
            listArray.lists = data
        })
        .catch(error => {
            console.log(error.response);
        })
    }
    BindValue(listArray, 'lists', (val)=>{
        val.forEach(item =>{
            let template = `
            <tr ${item.active === false ? 'class="resign"' : ''}>
                <td>${item.account_number}</td>
                <td>${item.user_name}</td>
                <td>${item.email}</td>
            </tr>`
            tBody.insertAdjacentHTML('beforeend',template)

            let detailTemplate = `
            <tr class="detail ${item.account_number}" >
                <td>使用者資訊</td>
                <td><span class="edit_userdata">${item.active === true ? '<i class="fa-edit icon"></i>' : ''}</span></td>
                <td>名字:<input type="text" value="${item.user_name}" name="user_name" readonly="readonly"></td>
                <td>帳號:<input type="text" value="${item.account_number}" name="account_number" readonly="readonly"></td>
                <td>密碼:<input type="password" value="" placeholder="**********" name="password" readonly="readonly"></td>
                <td>電子信箱:<input type="text" value="${item.email}" name="email" readonly="readonly"></td>
                <td>使用者權限</td>
                <td class="pm_box">
                    <span class="edit_pm">${item.active === true ? '<i class="fa-edit icon"></i>' : ''}</span>
                </td>
                <td class="permission_box"></td>
                <td>
                    ${item.active === true ? '<span class="resign_user"><i class="fa-bye icon"></i>離職</span>' : '<span class="resume_user"><i class="fa-baby icon"></i>復職</span>'}
                    <span class="delet_user"><i class="fa-grave icon"></i>刪除</span>
                </td>
            </tr>`
            tBody.insertAdjacentHTML('beforeend',detailTemplate)
            document.getElementsByClassName(item.account_number)[0].style.display = 'none'
            renderPermission(item.authority, item.account_number)
        })
    })
    function renderPermission(authority, user_id){
        const detailNodeList = document.getElementsByClassName(user_id)[0].childNodes
        const permission_box = detailNodeList[17]
        if ( authority.length === 0) {
            let template = `<span>他目前沒有任何權限喔</span>`
            permission_box.insertAdjacentHTML('beforeend', template)
        } else {
            authority.forEach(item =>{
                let template = `
                <span>${item.program_id + item.program_name}</span>`
                permission_box.insertAdjacentHTML('beforeend', template)
            })
        }
    }
    //新增使用者資訊
    function postHandler(div_Pop){
        const obj = {
            "program_id": program_id,
            "account_number": userId,
            "user_id": div_Pop[2].value,
            "user_name": div_Pop[3].value,
            "password": div_Pop[4].value,
            "email": div_Pop[5].value,
            "creator_user": userId
        }
        axios.post(users_dataChange_url ,obj ,{
            headers: {'Authorization': token}
        })
        .then(res => {
            console.log(res)
            addSuccess()
            close_pop()
            getHandler()
        })
        .catch(error => {
            console.log(error.response);
            if (error.response.status === 417){
                div_Pop[6].innerText = '此使用者帳號已存在'
                setTimeout(function(){
                    div_Pop[6].innerText = ""
                }, 3000)
            }
        })
    }
    //編輯使用者資訊
    function patchHandler(datailTr){
        const obj = {
            "account_number": datailTr[3].children[0].value,
            "profile": {
                "user_name": datailTr[2].children[0].value,
                "email": datailTr[5].children[0].value,
                "modifier_user": userId
            }
        }
        if ( datailTr[4].children[0].value !== ""){
            obj['account'] = {
                "password": datailTr[4].children[0].value,
                "modifier_user": userId
            }
        }
        axios.patch(users_url ,obj ,{
            headers: {'Authorization': token}
        })
        .then(res => {
            console.log(res)
            editSuccess()
            getHandler()
        })
        .catch(error => {
            console.log(error.response);
        })
    }
    
    //新增權限
    function postPmHandler(user_id, user_program_id){
        const obj = {
            "account_number": userId,
            "program_id": program_id,
            "user_program_id": user_program_id,
            "user_id": user_id,
            "creator_user": userId
        }
        axios.post(permission_dataChange_url ,obj ,{
            headers: {'Authorization': token}
        })
        .then(res => {
            console.log(res)
            document.getElementsByClassName('add_permission')[0].children[2].value = ""
            addSuccess()
        })
        .catch(error => {
            console.log(error.response);
        })
    }
    //刪除權限
    function deletePmHandler(user_id, user_program_id){
        const obj = {
            "account_number": userId,
            "program_id": program_id,
            "user_program_id": user_program_id,
            "user_id": user_id,
            "modifier_user": userId
        }
        axios.put(permission_dataChange_url ,obj ,{
            headers: {'Authorization': token}
        })
        .then(res => {
            console.log(res)
            deletSuccess()
            getHandler()
        })
        .catch(error => {
            console.log(error.response);
        })
    }

    //刪除使用者資訊
    function deleteHandler(user_id){
        const obj = {
            "program_id": program_id,
            "account_number": userId,
            "user_id": user_id,
            "modifier_user": userId
        }
        axios.put(users_dataChange_url ,obj ,{
            headers: {'Authorization': token}
        })
        .then(res => {
            console.log(res)
            deletSuccess()
            getHandler()
        })
        .catch(error => {
            console.log(error.response);
        })
    }

    //使用者離職
    function resignUser(user_id, active){
        const obj = {
            "program_id": program_id,
            "account_number": userId,
            "user_id": user_id,
            "active": active,
            "modifier_user": userId
        }
        axios.patch(users_resign_url ,obj ,{
            headers: {'Authorization': token}
        })
        .then(res => {
            console.log(res)
            editSuccess()
            getHandler()
        })
        .catch(error => {
            console.log(error.response);
        })
    }
}