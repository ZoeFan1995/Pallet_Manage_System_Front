window.onload = function(){
    const tBody = document.querySelector('tbody')
    const warehouse_id = '199000001'
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
    header.addEventListener('click',(e)=>{
        //home btn導回借出列表
        if ( e.target.className === 'fa-home icon'){ 
            document.location.href = homePage
        }
    })
    bar.addEventListener('click',(e)=>{
        //新增表單
        if (e.target.id ==="add_btn" || e.target.className ==="fa-add icon"){ add_discard_form() };
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
            document.getElementById('inventory_form').innerHTML = ""
            getInventory(warehouse_id, program_id)
        }
    })
    body.addEventListener('click',(e)=>{
        //add棧板編號
        if (e.target.className === 'fa-add icon' && e.target.parentElement.className === 'add_in') {
            const pallet= e.path[2].children[0].children[0]
            const h5Dom = document.getElementById('form_right').childNodes[3]
            const rule = new RegExp("[A-Za-z]+");
            if ( pallet.value === "" ){ pallet.setAttribute('class', 'change')}
            else if( pallet.value.substr(1).length !== 5 || rule.test(pallet.value.substr(0, 1)) === false){
                h5Dom.innerText = "棧板編號第一個為英文，後面需為五碼數字"
                setTimeout(function(){
                    h5Dom.innerText = ""
                }, 3000)
            }
            else { 
                checkInventory(pallet.value, warehouse_id, program_id)
                pallet.removeAttribute('class', 'change')
                pallet.value = ""
            }
        }
        //在庫棧板搜尋
        if (e.target.className === 'fa-search icon' && e.target.parentElement.className === 'search_pallet') {
            remove_search()
            get_pallet_type().then((res) => {
                const data = res.data
                inventoryPop(warehouse_id, program_id, data)
            })
        }
        //在庫棧板搜尋-確定
        if (e.target.id ==="check_btn" && e.target.parentNode.id === 'inventoryPop') {
            const array = document.getElementsByName('checkbox')
            const checkedArray = []
            for (let i = 0; i < array.length; i++) {
                if ( array[i].checked == true){checkedArray.push(array[i].value)}
            }
            document.getElementById('inventory_form').innerHTML = ""
            getInventory(warehouse_id, program_id)
            ckeckedPalletPush(checkedArray)
        }
        //在庫棧板搜尋-關閉
        if (e.target.className ==="fa-close icon" && e.target.parentElement.id === 'inventoryPop'){
            add_search()
            close_secondPop()
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
            const palletBox = document.getElementById('pallet_box').children
            const postArray = []
            for (let i = 0; i < palletBox.length; i++) {
                if ( palletBox[i].nodeName === 'SPAN'){
                    let postObject = {
                        "pallet_type_id": palletBox[i].innerText.substr(0, 1),
                        "pallet_id": palletBox[i].innerText.substr(1)
                    }
                    postArray.push(postObject)
                }
            }
            if ( form_left[0].children[0].value === "") {
                form_left[0].children[0].style.border = '1px solid #f23030'
                setTimeout(function(){
                    form_left[0].children[0].style.border = '1px solid #648F84'
                }, 3000)
            } else if ( form_left[1].children[0].value === ""){ 
                form_left[1].children[0].setAttribute('class', 'change')
            } else if ( postArray.length === 0) {
                document.getElementById('pallet_box').style.border = '1px solid #f23030'
                setTimeout(function(){
                    document.getElementById('pallet_box').style.border = '1px solid #648F84'
                }, 3000)
            } else { 
                postHandler(form_left, postArray)
            }
        }
        //刪除跳出視窗-取消
        if (e.target.id === 'close_pop_btn'){
            close_pop()
            const closeBtnAll =  document.getElementsByClassName('fa-close')
            for (i = 0 ;i < closeBtnAll.length ;i++){closeBtnAll[i].classList.remove('activ')};
        }
        //刪除跳出視窗-刪除
        if (e.target.id === 'delet_btn'){
            const discard_id = e.target.offsetParent.classList[1]
            deleteHeadler(discard_id)
        }
        if (e.target.id === 'timeout_btn'){logout()}
    })
    tBody.addEventListener('click', (e)=>{
        const tr = e.target.parentNode;
        //打開列表
        if (tr.nodeName === 'TR' && tr.classList[0] !== 'detail'){
            const detailTrDom = tr.nextElementSibling;
            const lastTd = tr.nextElementSibling.lastElementChild;
            if ( tr.hasAttribute('class')){
                tr.removeAttribute('class', 'bg_blue')
                document.getElementsByClassName(detailTrDom.classList[1])[0].style.display = 'none'
            } else {
                tr.setAttribute('class', 'bg_blue')
                document.getElementsByClassName(detailTrDom.classList[1])[0].style.display = 'inline-block'
            };
            if (lastTd.childNodes[0].nodeName === 'BUTTON'){
                detailTrDom.removeChild(lastTd);
            };;
        }
        //刪除列表
        if (e.target.className ==="fa-close icon") {
            const closeIcon = e.target;
            const discard_id = tr.parentNode.id
            closeIcon.classList.add('activ');
            tr.parentNode.setAttribute('class', 'bg_blue');
            document.getElementsByClassName(discard_id)[0].style.display = 'inline-block';
            delet_list_pop(discard_id)
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
    
    //get報廢棧板資料
    function getHandler(parameter){
        tBody.innerHTML = ""
        tBody.innerHTML = `
        <tr id="list_tittle">
            <td></td>
            <td></td>
            <td>棧板報廢單號:</td>
            <td>報廢原因:</td>
            <td>報廢日期:</td>
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
        axios.post(discard_get_url ,obj ,{
            headers: {'Authorization': token}
        })
        .then(res => {
            const data = res.data.data
            //lastPage disabled
            if (data.length === 0 ) {
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
    BindValue(listArray, 'lists',(val)=>{
        val.forEach(item => {
            let template = `
            <tr id="${item.discard_id}">
                <td><i class="fa-close icon"></i></td>
                <td></td>
                <td>${item.discard_id}</td>
                <td>${item.reason}</td>
                <td>${item.discard_date}</td>
            </tr>`
            tBody.insertAdjacentHTML('beforeend',template)

            let detailTemplate = `
            <tr class="detail ${item.discard_id}" >
                <td>棧板報廢單號<input type="text" value="${item.discard_id}" name="discard_id" readonly="readonly"></td>
                <td>報廢日期<input type="text" value="${item.discard_date}" name="discard_date" readonly="readonly"></td>
                <td>報廢原因<input type="text" value="${item.reason}" name="reason" readonly="readonly"></td>
                <td>棧板編號<div></div></td>
                <td>棧板數量總計</td>
                <td>備註<input type="text" value="${item.remark}" name="remark" readonly="readonly"></td>
            </tr>`
            tBody.insertAdjacentHTML('beforeend',detailTemplate)
            document.getElementsByClassName(item.discard_id)[0].style.display = 'none'
            palletIdHandler(item.pallet, item.discard_id)
        });
    })
    function palletIdHandler(palletArray, discard_id){
        const detailNodeList = document.getElementsByClassName(discard_id)[0].children
        const pallet_div = detailNodeList[3].children[0]
        const pallet_total = detailNodeList[4]
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
    //刪除報廢單
    function deleteHeadler(discard_id){
        const obj = {
            "program_id": program_id,
            "discard_id": discard_id,
            "modifier_user": userId,
            "account_number": userId
        }
        axios.put(discard_dataChange_url, obj, {
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
            console.error(error.response);
        })
    }
    //新增報廢表單
    function postHandler(form_left, postArray){
        const obj = {
            "program_id": program_id,
            "discard_date": form_left[0].children[0].value,
            "reason": form_left[1].children[0].value,
            "remark": form_left[2].children[0].value,
            "creator_user": userId,
            "account_number": userId,
            "discard_detail": postArray
        }
        axios.post(discard_dataChange_url, obj ,{
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