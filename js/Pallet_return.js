window.onload = function(){
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
        if (value) {
            value = decodeURIComponent(value);
        }
        return value;
    }
    //閒置過久登出
    body.addEventListener('mousemove', function () {
        reCalculateTime()
    })
    body.addEventListener('keydown', function () {
        reCalculateTime()
    })

    //監聽事件
    header.addEventListener('click',(e)=>{
        //home btn導回借出列表
        if ( e.target.className === 'fa-home icon'){ 
            document.location.href = homePage
        }
    })
    bar.addEventListener('click',function(e){
        //新增表單
        if (e.target.id ==="add_btn" || e.target.className ==="fa-add icon"){ add_pallet_return_form() };
    })
    bar.addEventListener('keyup', (e)=>{
        //搜尋BAR
        if (e.key === 'Enter' && e.target.parentElement.id === 'search_bar'){
            const parameter = e.target.value.toUpperCase()
            index = 1
            if (parameter === '') {getHandler(parameter, index)
            }else {getHandler(parameter)}
        }
    })
    body.addEventListener('change', function(e){
        //在庫棧板搜尋select 換type
        if ( e.target.id === 'selectBox'){
            const source_warehouse_id = document.getElementById('form_left').children[0].children[0]
            document.getElementById('inventory_form').innerHTML = ""
            getInventory(source_warehouse_id.value, program_id)
        }
    })
    body.addEventListener('keyup',(e) =>{
        //廠別代碼搜尋-搜尋(Enter)
        if( e.key === 'Enter' && e.target.parentElement.id === 'IdNamePop'){
            getIdName(e.target.value, program_id)
        }
        //來源廠別變更，清空已選棧板
        if (e.target.placeholder === '所在地...' || e.target.parentElement.innerText === '來源廠商:'){
            document.getElementById('pallet_box').innerHTML =""
        }
    })
    body.addEventListener('click',function(e){
        //廠別代號搜尋-來源廠別
        if ( e.target.className === 'fa-search icon' && e.target.parentElement.className === 'search_warehouse source'){
            document.getElementById('pallet_box').innerHTML =""
            const className = 'source'
            IdNamePop(className, program_id)
            remove_search()
        }
        //廠別代號搜尋-目的廠別
        if ( e.target.className === 'fa-search icon' && e.target.parentElement.className === 'search_warehouse destination'){
            const className = 'destination'
            IdNamePop(className, program_id)
            remove_search()
        }
        //廠別代號搜尋-關閉
        if (e.target.className === 'fa-close icon' && e.target.parentElement.id === 'IdNamePop'){
            close_secondPop()
            add_search()
        }
        //廠別代號搜尋-點選項目
        if (e.target.nodeName === 'INPUT' && e.target.parentElement.id === 'IdName_form'){
            const IdName_array = document.getElementById('IdName_form').children
            for (let i = 0; i < IdName_array.length; i++) {
                if (IdName_array[i].className === 'selected'){
                    IdName_array[i].classList.remove('selected')
                }
            }
            e.target.classList.add('selected')
        }
        //廠別代號搜尋-確定
        if (e.target.id ==="check_btn" && e.target.parentElement.id === 'IdNamePop'){
            const warehouse_id = document.getElementsByClassName('selected')[0].value.substr(0, 9)
            const source_input =  document.getElementById('form_left').children[0].children[0]
            const destination_input =  document.getElementById('form_left').children[2].children[0]
            if (e.target.parentElement.className === 'source'){
                source_input.value = warehouse_id
                close_secondPop()
            } else {
                destination_input.value = warehouse_id
                close_secondPop()
            }
            add_search()
        }
        //add棧板編號
        if (e.target.className === 'fa-add icon' && e.target.parentElement.className === 'add_in') {
            const source_input =  document.getElementById('form_left').children[0].children[0]
            const right_h5Dom = document.getElementById('form_right').children[1]
            const left_h5Dom = document.getElementById('form_left').children[4]
            const pallet= e.path[2].children[0].children[0]
            const letterRegExp = /^[a-zA-Z]*$/
            if ( pallet.value === "" || source_input.value === ""){ 
                pallet.setAttribute('class', 'change')
                source_input.setAttribute('class', 'change')
            }else if( pallet.value.substr(1).length !== 5 || letterRegExp.test(pallet.value.substr(0, 1)) === false){
                right_h5Dom.innerText = "棧板編號第一個為英文，後面需為五碼數字"
                setTimeout(function(){
                    right_h5Dom.innerText = ""
                }, 3000)
            }else if ( source_input.value.length !== 9) { 
                left_h5Dom.innerText = "廠商代號需為九碼"
                setTimeout (function(){
                    left_h5Dom.innerText = ""
                }, 3000)
            } else { 
                checkInventory(pallet.value, source_input.value, program_id)
                pallet.removeAttribute('class', 'change')
                pallet.value = ""
            }
        }
        //在庫棧板搜尋
        if (e.target.className === 'fa-search icon' && e.target.parentElement.className === 'search_pallet') {
            const source_input =  document.getElementById('form_left').children[0].children[0]
            const left_h5Dom = document.getElementById('form_left').children[4]
            if ( source_input.value === ""){ source_input.setAttribute('class', 'change')}
            else if ( source_input.value.length !== 9) { 
                left_h5Dom.innerText = "廠商代號需為九碼"
                setTimeout (function(){
                    left_h5Dom.innerText = ""
                }, 3000)
            } else { 
                remove_search()
                get_pallet_type().then((res) => {
                    const data = res.data
                    inventoryPop(source_input.value, program_id, data)
                })
            }
        }
        //在庫棧板搜尋-確定
        if (e.target.id ==="check_btn" && e.target.parentNode.id === 'inventoryPop') {
            const source_input =  document.getElementById('form_left').children[0].children[0]
            const array = document.getElementsByName('checkbox')
            const checkedArray = []
            for (let i = 0; i < array.length; i++) {
                if ( array[i].checked == true){checkedArray.push(array[i].value)}
            }
            document.getElementById('inventory_form').innerHTML = ""
            getInventory(source_input.value, program_id)
            ckeckedPalletPush(checkedArray)
        }
        //在庫棧板搜尋-關閉
        if (e.target.className ==="fa-close icon" && e.target.parentElement.id === 'inventoryPop'){
            close_secondPop()
            add_search()
        }
        //移除pallet
        if (e.target.className === 'fa-close icon' && e.target.parentElement.parentElement.id === 'pallet_box'){
            document.getElementById('pallet_box').removeChild(e.target.parentElement)
        }
        //新增表單-關閉
        if (e.target.className ==="fa-close icon" && e.target.parentElement.id === 'pop'){
            if (document.getElementById('popBox') === null){ 
                close_pop()
            } else {
                close_secondPop()
                close_pop()
            }
        };
        //新增表單-確定
        if (e.target.id ==="check_btn" && e.target.parentNode.id === 'pop'){
            const form_left = document.getElementById('form_left').children
            const left_h5Dom = document.getElementById('form_left').children[4]
            const palletBox = document.getElementById('pallet_box').children
            const postArray = []
            for (let i = 0; i < palletBox.length; i++) {
                if (palletBox[i].nodeName === 'SPAN') {
                    let postObject = {
                        "pallet_type_id": palletBox[i].innerText.substr(0, 1),
                        "pallet_id": palletBox[i].innerText.substr(1)
                    }
                    postArray.push(postObject)
                }
            }
            if ( form_left[0].children[0].value === "" || form_left[2].children[0].value === "" ){ 
                form_left[0].children[0].setAttribute('class', 'change')
                form_left[2].children[0].setAttribute('class', 'change')
            } else if ( form_left[5].children[0].value === "") {
                form_left[5].children[0].style.border = '1px solid #f23030'
                setTimeout(function(){
                    form_left[5].children[0].style.border = '1px solid #648F84'
                }, 3000)
            } else if ( postArray.length === 0) {
                document.getElementById('pallet_box').style.border = '1px solid #f23030'
                setTimeout(function(){
                    document.getElementById('pallet_box').style.border = '1px solid #648F84'
                }, 3000)
            } else if ( form_left[2].children[0].value.length !== 9) {
                left_h5Dom.innerText = "廠商代號需為九碼"
                setTimeout (function(){
                    left_h5Dom.innerText = ""
                }, 3000)
            } else { 
                postHandler(form_left, postArray) 
            }
        }
        //刪除列表-跳出視窗-取消
        if (e.target.id === 'close_pop_btn'){
            close_pop()
            const closeBtnAll = document.getElementsByClassName('fa-close')
            for (i = 0 ;i < closeBtnAll.length ;i++){closeBtnAll[i].classList.remove('activ')};
        }
        //刪除列表-跳出視窗-刪除
        if (e.target.id === 'delet_btn'){
            const return_id = e.target.parentElement.classList[1]
            deleteHeadler(return_id)
        }
    })
    tBody.addEventListener('click', function(e){
        const tr = e.target.parentElement;
        //打開列表
        if (tr.nodeName === 'TR' && tr.classList[0] !== 'detail'){
            const detailTrDom = tr.nextElementSibling;
            if ( tr.hasAttribute('class')){
                close_openTrs()
                tr.removeAttribute('class', 'bg_blue')
                document.getElementsByClassName(detailTrDom.classList[1])[0].style.display = 'none'
            } else {
                close_openTrs()
                tr.setAttribute('class', 'bg_blue')
                document.getElementsByClassName(detailTrDom.classList[1])[0].style.display = 'inline-block'
            };
        }
        //刪除列表-跳出視窗
        if (e.target.className ==="fa-close icon") {
            const closeIcon = e.target;
            const return_id = tr.parentElement.nextElementSibling.classList[1]
            close_openTrs()
            closeIcon.classList.add('activ');
            tr.parentElement.setAttribute('class', 'bg_blue');
            document.getElementsByClassName(return_id)[0].style.display = 'inline-block';
            delet_list_pop(return_id)
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
            else {getHandler(parameter, index--)}
        }
    })

    //get歸還棧板資料
    function getHandler(parameter){
        tBody.innerHTML = ""
        tBody.innerHTML = `
        <tr id="list_tittle">
            <td></td>
            <td></td>
            <td>歸還單號:</td>
            <td>來源廠別:</td>
            <td>目的廠別:</td>
            <td>入庫日期:</td> 
        </tr>`
        //firstPage disabled
        if (index === 1) {footer.childNodes[1].setAttribute('class', 'opacity')} 
        else {footer.childNodes[1].removeAttribute('class', 'opacity')}
        if (parameter === undefined) { parameter = ""}

        const obj = {
            "program_id": program_id,
            "page": index,
            "search": parameter,
            "account_number": userId
        }
        axios.post(return_get_url ,obj ,{
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
            console.error(error.response); 
        })
    }
    BindValue(listArray, 'lists',function(val){
        val.forEach(item => {
            let template = `
            <tr id="${item.return_id}">
                <td><i class="fa-close icon"></i></td>
                <td></td>
                <td>${item.return_id}</td>
                <td>${item.source_warehouse_name}</td>
                <td>${item.destination_warehouse_name}</td>
                <td>${item.return_date}</td>
            </tr>`
            tBody.insertAdjacentHTML('beforeend',template)

            let detailTemplate = `
            <tr class="detail ${item.return_id} ${item.source_warehouse_id}" >
                <td>棧板來源廠別<input type="text" value="${item.source_warehouse_name}" name="source_warehouse_id" readonly="readonly"></td>
                <td>棧板目的廠別<input type="text" value="${item.destination_warehouse_name}" name="destination_warehouse_id" readonly="readonly"></td>
                <td>歸還單號<input type="text" value="${item.return_id}" name="return_id" readonly="readonly"></td>
                <td>入庫日期<input type="text" value="${item.return_date}" name="return_date" readonly="readonly"></td>
                <td>棧板編號<div></div></td>
                <td>棧板數量總計</td>
                <td>備註<input type="text" value="${item.remark}" name="remark" readonly="readonly"></td>
            </tr>`
            tBody.insertAdjacentHTML('beforeend',detailTemplate)
            document.getElementsByClassName(item.return_id)[0].style.display = 'none'
            palletIdHandler(item.pallet, item.return_id)
        });
        function palletIdHandler(palletArray, return_id){
            const detailNodeList = document.getElementsByClassName(return_id)[0].children
            const pallet_div = detailNodeList[4].children[0]
            const pallet_total = detailNodeList[5]
            palletArray.forEach(item => {
                for (let i = 0; i < item.pallet_id.length; i++) {
                    let pallet_span = `
                    <span>${item.pallet_type_id + item.pallet_id[i]}</span>`
                    pallet_div.insertAdjacentHTML('beforeend', pallet_span)
                }
                let total_span = `
                <span>${item.pallet_type_name} ${item.pallet_id.length}個</span>`
                pallet_total.insertAdjacentHTML('beforeend', total_span)
            })
        }
    })
    //刪除歸還單
    function deleteHeadler(return_id){
        const obj = {
            "program_id": program_id,
            "return_id": return_id,
            "modifier_user": userId,
            "account_number": userId
        }
        axios.put(return_dataChange_url, obj ,{
            headers: {'Authorization': token}
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
            if ( error.response.data.data === '400.2'){
                close_pop()
                getHandler()
                deletFail()
            }
        })
    }
    //新增歸還表單
    function postHandler(form_left, postArray){
        const obj = {
            "program_id": program_id,
            "source_warehouse_id": form_left[0].children[0].value,
            "destination_warehouse_id": form_left[2].children[0].value,
            "return_date": form_left[5].children[0].value,
            "remark": form_left[6].children[0].value,
            "creator_user": userId,
            "account_number": userId,
            "pallet_return_detail": postArray
        }
        axios.post(return_dataChange_url ,obj ,{
            headers: {'Authorization': token}
        })
        .then(res => {
            console.log(res)
            document.getElementById('search_bar').children[1].value = ""
            if (document.getElementById('popBox') === null){ 
                close_pop()
            } else {
                close_secondPop()
                close_pop()
            }
            getHandler()
            addSuccess()
        })
        .catch(error => {
            console.error(error.response);
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