window.onload = function () {
    const tBody = document.querySelector('tbody')
    const listArray = [{}]
    let index = 1
    let token = ''
    let userId = ''
    let program_id = getQueryParams();

    getCookieByName()
    getHeader()
    getNav()
    getBar()
    getFooter()
    getHandler()
    reCalculateTime()

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

    //監聽事件*/
    header.addEventListener('click',(e)=>{
        //home btn導回借出列表
        if ( e.target.className === 'fa-home icon'){ 
            document.location.href = homePage
        }
    })
    bar.addEventListener('click', (e) => {
        //新增表單
        if (e.target.id === "add_btn" || e.target.className === "fa-add icon") {
            get_pallet_type().then((res) => {
                const data = res.data
                add_pallet_pop(data)
            })
        };
    })
    bar.addEventListener('keyup', (e)=>{
        //搜尋BAR
        if (e.key === 'Enter' && e.target.parentElement.id === 'search_bar'){
            const parameter = e.target.value.toUpperCase()
            index = 1
            if (parameter === '') {getHandler(parameter, index)
            }else {getHandler(parameter)}
        }})
    body.addEventListener('click', function (e) {
        //新增表單-關閉
        if (e.target.className === "fa-close icon" && e.target.parentElement.id === 'pop') {
            close_pop()
        };
        //新增表單-確定
        if (e.target.id === "check_btn" && e.target.parentNode.id === 'pop') {
            const selectItem = document.getElementById('selectBox')
            const pallet_type_id = selectItem.options[selectBox.selectedIndex].value;
            const pallet_id = e.target.offsetParent.childNodes[7];
            const letterRegExp = /^[a-zA-Z]*$/
            if ( pallet_id.value === "" ) {
                pallet_id.setAttribute('class', 'change')
            } else if (pallet_id.value.length !== 5 || letterRegExp.test(pallet_id.value) === true) {
                document.querySelector('h5').innerText = "棧板編號需為五碼的數字"
                setTimeout(() => {
                    document.querySelector('h5').innerText = ''
                }, 3000)
            } else {
                postHandler(pallet_id.value, pallet_type_id)
            }
        }
        //刪除棧板-跳出視窗-取消
        if (e.target.id === 'close_pop_btn') {
            close_pop()
            const closeBtnAll = document.getElementsByClassName('fa-close')
            for (i = 0; i < closeBtnAll.length; i++) {
                closeBtnAll[i].classList.remove('activ')
            };
        }
        //刪除棧板-跳出視窗-刪除
        if (e.target.id === 'delet_btn') {
            const pallet = e.path[1].children[0].firstElementChild.innerText
            deleteHeadler(pallet)
        }
    })
    body.addEventListener('keyup', function (e){
        //新增表單-確定(enter)
        if (e.key === "Enter" && e.target.parentNode.id === 'pop') {
            const selectItem = document.getElementById('selectBox')
            const pallet_type_id = selectItem.options[selectBox.selectedIndex].value;
            const pallet_id = e.target.offsetParent.childNodes[7];
            const letterRegExp = /^[a-zA-Z]*$/
            if ( pallet_id.value === "" ) {
                pallet_id.setAttribute('class', 'change')
            } else if (pallet_id.value.length !== 5 || letterRegExp.test(pallet_id.value) === true) {
                document.querySelector('h5').innerText = "棧板編號需為五碼的數字"
                setTimeout(() => {
                    document.querySelector('h5').innerText = ''
                }, 3000)
            } else {
                postHandler(pallet_id.value, pallet_type_id)
            }
        }
    })
    tBody.addEventListener('click', (e) => {
        const tr = e.target.parentNode;
        //打開列表
        if (tr.nodeName === 'TR' && tr.classList[0] !== 'detail') {
            const detailTrDom = tr.nextElementSibling;
            if (tr.hasAttribute('class')) {
                tr.removeAttribute('class', 'bg_blue')
                document.getElementsByClassName(detailTrDom.classList[1])[0].style.display = 'none'
            } else {
                close_openTrs()
                tr.setAttribute('class', 'bg_blue')
                document.getElementsByClassName(detailTrDom.classList[1])[0].style.display = 'inline-block'
            };
        }
        //刪除列表
        if (e.target.className === "fa-close icon") {
            const closeIcon = e.target;
            const pallet_detail = tr.parentNode.id
            const pallet = tr.parentNode.children[2].innerText
            close_openTrs()
            closeIcon.classList.add('activ');
            tr.parentNode.setAttribute('class', 'bg_blue');
            document.getElementsByClassName(pallet_detail)[0].style.display = 'inline-block';
            delet_pallet_pop(pallet)
        }
    })
    footer.addEventListener('click', (e)=>{
        //下一頁
        if ( e.target.classList[0] === 'fa-arrow-right' || e.target.id === 'next'){ 
            const parameter = bar.children[1].children[1].value.toUpperCase()
            getHandler(parameter, index++) 
        }
        //上一頁
        if ( e.target.classList[0] === 'fa-arrow-left' || e.target.id === 'previous'){
            const parameter = bar.children[1].children[1].value.toUpperCase()
            if (index === 1){return}
            else { getHandler(parameter, index--)}
        }
    })
    //get棧板資料
    function getHandler(parameter) {
        tBody.innerHTML = ""
        tBody.innerHTML = `
        <tr id="list_tittle">
            <td></td>
            <td></td>
            <td>棧板編號:</td>
            <td>類型:</td>
            <td>目前所在廠商:</td>
        </tr>`
        //firstPage disabled
        if (index === 1){ footer.childNodes[1].setAttribute('class', 'opacity')}
        else { footer.childNodes[1].removeAttribute('class', 'opacity')}
        if (parameter === undefined) { parameter = ""}

        const obj = {
            "program_id": program_id,
            "page": index,
            "search": parameter,
            "account_number": userId
        }
        axios.post(pallet_get_url , obj, {
            headers: {'Authorization': token}
        })
            .then(res => {
                const data = res.data.data
                //lastPage disabled
                if (data.length === 0 ) {
                    footer.childNodes[2].setAttribute('class', 'opacity')
                    if ( index === 1) { 
                        let tr = `
                        <tr id="not_found">
                        <td colspan="6">找不到資料餒( ; ω ; )</td>
                        </tr>`
                        tBody.insertAdjacentHTML('beforeend', tr)
                    } else {getHandler(parameter,index--)}
                } else if (data.length !== 10) {
                    footer.childNodes[2].setAttribute('class', 'opacity')
                    listArray.lists = data
                } else {
                    footer.childNodes[2].removeAttribute('class', 'opacity')
                    listArray.lists = data
                }
            })
            .catch(error => {
                console.log(error.response);
            })
    }
    BindValue(listArray, 'lists', (val) => {
        val.forEach(item => {
            let template = `
            <tr id="${item.pallet_type_id+item.pallet_id}">
                <td><i class="fa-close icon"></i></td>
                <td></td>
                <td>${item.pallet_type_id+item.pallet_id}</td>
                <td>${item.pallet_type_name}</td>
                <td>${item.warehouse_name}</td>
            </tr>`
            tBody.insertAdjacentHTML('beforeend', template)
            let detailTemplate = `
            <tr class="detail ${item.pallet_type_id+item.pallet_id}">
                <td>棧板編號:<input type="text" value="${item.pallet_type_id+item.pallet_id}" name="pallet_id" readonly="readonly"></td>
                <td>棧板類型:<input type="text" value="${item.pallet_type_name}" name="pallet_id" readonly="readonly"></td></td>
                <td>目前所在廠商:<input type="text" value="${item.warehouse_name}" name="creator" readonly="readonly"></td>
            </tr>`
            tBody.insertAdjacentHTML('beforeend', detailTemplate)
            document.getElementsByClassName(item.pallet_type_id + item.pallet_id)[0].style.display = 'none'
        });
    })
    //新增棧板
    function postHandler(pallet_id, pallet_type_id) {
        const obj = {
            "program_id": program_id,
            "pallet_id": pallet_id, 
            "pallet_type_id": pallet_type_id,
            "creator_user": userId,
            "account_number": userId
        }
        axios.post(pallet_dataChange_url, obj, {
                headers: {'Authorization': token}
            })
            .then(res => {
                console.log(res)
                document.getElementById('search_bar').children[1].value = ""
                close_pop()
                getHandler()
                get_pallet_type().then((res) => {
                    const data = res.data
                    add_pallet_pop(data)
                })
                addSuccess()
            })
            .catch(error => {
                console.log(error.response);
                if( error.response.data.data === '400.1'){ 
                    document.getElementById('pop').children[4].innerText = "此棧板編號已建立"
                    setTimeout(() => {
                        document.getElementById('pop').children[4].innerText = ''
                    }, 3000)
                }
            })
    }
    //刪除棧板
    function deleteHeadler(pallet) {
        const obj = {
            "program_id": program_id,
            "pallet_id": pallet.substr(1), 
            "pallet_type_id": pallet.substr(0, 1),
            "modifier_user": userId,
            "account_number": userId
        }
        axios.put(pallet_dataChange_url, obj, {
            headers: {'Authorization': token},
        })
            .then(res => {
                console.log(res)
                document.getElementById('search_bar').children[1].value = ""
                close_pop()
                getHandler()
                deletSuccess()
            })
            .catch(error => {
                console.log(error.response);
                if (error.response.data.data === '400.2'){
                    close_pop()
                    getHandler()
                    can_not_delet_pallet()
                }
            })
    }
    //棧板類型 Promise
    function get_pallet_type() {
        const obj = {
            "program_id": program_id,
            "account_number": userId
        }
        const promise = axios.post(palletType_get_url, obj ,{headers: {'Authorization': token}})
        const dataPromise = promise.then((res) => res.data )
        return dataPromise
    }
}