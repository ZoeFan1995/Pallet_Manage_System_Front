
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

function close_pop(){
    const pop = document.getElementById('pop')
    const mask = document.getElementById('mask')
    const body = document.querySelector('body')
    body.removeChild(pop)
    body.removeChild(mask)
}
function close_secondPop(){
    const pop = document.getElementById('pop')
    const popBox= document.getElementById('popBox')
    const mask = document.getElementById('mask')
    const body = document.querySelector('body')
    body.insertBefore(pop, mask)
    body.removeChild(popBox)
}

//add廠商
function add_supplier_pop(data){
    let template = `
    <div id="pop" class="add_supplier">
        <i class="fa-close icon"></i>
        <h6>新增廠商</h6>
        <input type="text" placeholder="輸入廠商代號..." value="">
        <input type="text" placeholder="輸入廠商名稱..." value="">
        <select id="selectBox"></select>
        <input type="text" placeholder="輸入棧板基量..." value="">
        <h5></h5>
        <button id="check_btn"><i class="fa-checked icon"></i>確定</button>
    </div>
    <div id="mask"></div>`
    
    document.querySelector('body').insertAdjacentHTML('beforeend',template)
    for (let i = 0; i < data.length; i++) {
        let type = `
        <option value="${data[i].sup_type_id}">${data[i].sup_type_name}</option>`
        document.getElementById('selectBox').insertAdjacentHTML('beforeend', type)
    }
}

//delet借出/歸還/報廢
function delet_list_pop(id){
    let template = `
    <div id="pop" class="delet_list ${id}">
        <p>您將刪除此表單，刪除後將無法回復。<br>您仍要刪除嗎?</p>
        <button id="delet_btn">我要刪除!!</button>
        <button id="close_pop_btn">我再想想..</button>
    </div>
    <div id="mask"></div>`
    document.querySelector('body').insertAdjacentHTML('beforeend',template)
}

//add棧板借出
function add_sallet_lend_form(){
    let template = `
    <div id="pop" class="add_form">
        <i class="fa-close icon"></i>
        <h6><i class="fa-log-out icon"></i>棧板借出</h6>
        <div>
            <div id="form_left">
                <span>來源廠商:<input type="text" placeholder="所在地..." value="" name="source_warehouse_id"></span>
                <span class="search_warehouse source"><i class="fa-search icon"></i></span>
                <span>目的廠商:<input type="text" placeholder="目的地..." value="" name="destination_warehouse_id"></span>
                <span class="search_warehouse destination"><i class="fa-search icon"></i></span>
                <h5></h5>
                <input type="text" placeholder="輸入銷貨單據號碼..." value="" name="order_number">
                <span class="date">借出日期:<input type="date"  value="" name="lend_date"></span>
                <span class="remark">備註:<textarea name="remark" placeholder="物流、棧板狀況..." value="" cols="37" rows="3"></textarea></span>
            </div>
            <div id="form_right">
                <div id="pallet_search"  class="lend">
                    <span>棧板編號:<input type="text" placeholder="輸入棧板編號..." value="" name="pallet"></span>
                    <span class="add_in"><i class="fa-add icon"></i></span>
                    <span class="search_pallet"><i class="fa-search icon"></i></span>
                </div>
                <h5></h5>
                <div id="pallet_box" class="lend"></div>
            </div>
        </div>
        <button id="check_btn"><i class="fa-checked icon"></i>確定</button>
    </div>
    <div id="mask"></div>`
    document.querySelector('body').insertAdjacentHTML('beforeend',template)
}

//add棧板報廢
function add_discard_form() {
    let template = `
    <div id="pop" class="add_form">
        <i class="fa-close icon"></i>
        <h6><i class="fa-trashcan icon"></i>棧板報廢</h6>
        <div>
            <div id="form_left">
                <span class="discard_date">報廢日期:<input type="date" value="" name="discard_date"></span>
                <span class="reason">報廢原因:<textarea name="reason" placeholder="輸入報廢原因..." value="" cols="37" rows="5"></textarea></span>
                <span class="remark">備註:<textarea name="remark" placeholder="..." value="" cols="37" rows="2"></textarea></span>
            </div>
            <div id="form_right">
                <div id="pallet_search">
                    <span>棧板編號:<input type="text" placeholder="輸入棧板編號..." value="" name="pallet"></span>
                    <span class="add_in"><i class="fa-add icon"></i></span>
                    <span class="search_pallet"><i class="fa-search icon"></i></span>
                </div>
                <h5></h5>
                <div id="pallet_box" class="discard"></div>
            </div>
        </div>
        <button id="check_btn"><i class="fa-checked icon"></i>確定</button>
    </div>
    <div id="mask"></div>`
    document.querySelector('body').insertAdjacentHTML('beforeend',template)
}

//add棧板歸還
function add_pallet_return_form() {
    let template = `
    <div id="pop" class="add_form">
        <i class="fa-close icon"></i>
        <h6><i class="fa-log-in icon"></i>棧板歸還</h6>
        <div>
            <div id="form_left">
                <span>來源廠商:<input type="text" placeholder="所在地..." value="" name="source_warehouse_id"></span>
                <span class="search_warehouse source"><i class="fa-search icon"></i></span>
                <span>目的廠商:<input type="text" placeholder="目的地..." value="" name="destination_warehouse_id"></span>
                <span class="search_warehouse destination"><i class="fa-search icon"></i></span>
                <h5></h5>
                <span class="date">歸還日期:<input type="date"  value="" name="return_date"></span>
                <span class="remark">備註:<textarea name="remark" placeholder="物流、棧板狀況..." value="" cols="37" rows="3"></textarea></span>
            </div>
            <div id="form_right">
                <div id="pallet_search">
                    <span>棧板編號:<input type="text" placeholder="輸入棧板編號..." value="" name="pallet"></span>
                    <span class="add_in"><i class="fa-add icon"></i></span>
                    <span class="search_pallet"><i class="fa-search icon"></i></span>
                </div>
                <h5></h5>
                <div id="pallet_box" class="return"></div>
            </div>
        </div>
        <button id="check_btn"><i class="fa-checked icon"></i>確定</button>
    </div>
    <div id="mask"></div>`
    document.querySelector('body').insertAdjacentHTML('beforeend',template)
}

//在庫棧板搜尋
function inventoryPop(warehouse_id, program_id, data){
    let template =`
    <div id="inventoryPop"> 
        <i class="fa-close icon"></i>
        <h6>在庫棧板搜尋</h6>
        <select id="selectBox"></select>
        <form id="inventory_form"></form>
        <button id="check_btn"><i class="fa-checked icon"></i>確定</button>
    </div>`
    const popBox = document.createElement('div')
    const pop =document.getElementById('pop')

    popBox.setAttribute('id', 'popBox')
    popBox.appendChild(pop)
    popBox.insertAdjacentHTML('beforeend',template)
    document.querySelector('body').appendChild(popBox)

    for (let i = 0; i < data.length; i++) {
        let option = `
        <option value="${data[i].pallet_type_id}">${data[i].pallet_type_name}</option>`
        document.getElementById('selectBox').insertAdjacentHTML('beforeend', option)
    }
    getInventory(warehouse_id, program_id)
}

//抓該廠商的 在庫棧板搜尋
function getInventory(warehouse_id, program_id){
    const selectItem = document.getElementById('selectBox')
    const inventory_form = document.getElementById('inventory_form')
    const pallet_type_id = selectItem.options[selectBox.selectedIndex].value;
    const obj = {
        "program_id": program_id,
        'warehouse_id': warehouse_id,
        'pallet_type_id': pallet_type_id,
        "account_number": userId
    }
    axios.post(inventory_url, obj, {
        headers: {'Authorization': token}
    })
    .then(res => {
        const palletArray = res.data.data
        for (let i = 0; i < palletArray.length; i++) {
            let newSpan = `
            <span>
            <input type="checkbox" name="checkbox" value="${pallet_type_id + palletArray[i]}">
            ${pallet_type_id + palletArray[i]}
            </span>`
            inventory_form.insertAdjacentHTML('beforeend',newSpan)
        }
    })
    .catch(error => {
        console.error(error.response); 
    })
}

//勾選之棧板 放至主表單中
function ckeckedPalletPush(checkedArray){
    const pallet_box= document.getElementById('pallet_box')
    const originArray = []
    for (let i = 0; i < pallet_box.children.length; i++) {
        originArray.push(pallet_box.children[i].outerText)
    }
    const result = new Set (originArray)
    checkedArray.forEach(item =>{
        if (result.has(item)){ 
            console.log('有重複');
        } else { 
            let newSpan = `
            <span>${item}<i class="fa-close icon"></i></span>`
            pallet_box.insertAdjacentHTML('beforeend',newSpan)
        }
    })
}

//棧板在庫狀態
function checkInventory(pallet, warehouse_id, program_id){
    const h5Dom = document.getElementById('form_right').children[1]
    const array = []
    const toUpper_pallet = pallet.toUpperCase()
    array.push(toUpper_pallet)
    const obj = {
        "program_id": program_id,
        'warehouse_id': warehouse_id,
        'pallet_type_id': toUpper_pallet.substr(0,1),
        'pallet_id': toUpper_pallet.substr(1),
        "account_number": userId
    }
    axios.post(inventory_status_url, obj ,{
        headers: {'Authorization': token}
    })
    .then(res => {
        const data =  res.data.data
        if ( data.inventory === true && data.pallet_founded === true ){ ckeckedPalletPush(array) }
        else if ( data.inventory === false && data.pallet_founded === true ){
            h5Dom.innerText = "該廠商並無此棧板" 
            setTimeout(function(){
                h5Dom.innerText = ""
            }, 2000)
        } else {
            h5Dom.innerText = "查無此棧板，請確認該棧板編號是否正確，或是該棧板未被建立"
            setTimeout(function(){
                h5Dom.innerText = ""
            }, 3000)
        }
    })
    .catch(err => {
        console.error(err); 
    })
}

//add棧板
function add_pallet_pop(data){
    let template = `
    <div id="pop" class="add_pallet">
        <i class="fa-close icon"></i>
        <h6>新增棧板</h6>
        <select id="selectBox"></select>
        <input type="text" placeholder="輸入棧板編號..." value="">
        <h5></h5>
        <button id="check_btn"><i class="fa-checked icon"></i>確定</button>
    </div>
    <div id="mask"></div>`
    document.querySelector('body').insertAdjacentHTML('beforeend',template)
    for (let i = 0; i < data.length; i++) {
        let type = `
        <option value="${data[i].pallet_type_id}">${data[i].pallet_type_name}</option>`
        document.getElementById('selectBox').insertAdjacentHTML('beforeend', type)
    }
}

//delet棧板
function delet_pallet_pop(pallet){
    let template = `
    <div id="pop" class="delet_pallet">
        <p>您將刪除棧板"<span>${pallet}</span>"，刪除後將無法回復。<br>您仍要刪除嗎?</p>
        <button id="delet_btn">我要刪除!!</button>
        <button id="close_pop_btn">我再想想..</button>
    </div>
    <div id="mask"></div>`
    document.querySelector('body').insertAdjacentHTML('beforeend',template)
}

//廠別代碼搜尋
function IdNamePop(className, program_id){
    let template = `
    <div id="IdNamePop" class="${className}"> 
        <i class="fa-close icon"></i>
        <h6>廠別代碼搜尋</h6>
        <input type="text" placeholder="輸入廠別代號/廠商名稱..." value="">
        <form id="IdName_form"></form>
        <button id="check_btn"><i class="fa-checked icon"></i>確定</button>
    </div>`
    const popBox = document.createElement('div')
    const pop =document.getElementById('pop')

    popBox.setAttribute('id', 'popBox')
    popBox.appendChild(pop)
    popBox.insertAdjacentHTML('afterbegin',template)
    document.querySelector('body').appendChild(popBox)

    let search = ""
    getIdName(search, program_id)
}

//廠別代碼搜尋-搜尋data帶入form中
function getIdName(search, program_id){
    const IdName_form = document.getElementById('IdName_form')
    IdName_form.innerHTML = ""
    const obj = {
        "program_id": program_id,
        "search": search,
        "account_number": userId
    }
    axios.post(IdName_url ,obj ,{
        headers: {'Authorization': token}
    })
    .then(res => {
        const IdNmaeArray = res.data.data
        for (let i = 0; i < IdNmaeArray.length; i++) {
            let input = '<input type="text" value="' + IdNmaeArray[i].warehouse_id +' '+ IdNmaeArray[i].warehouse_name + '" readonly>'
            IdName_form.insertAdjacentHTML('beforeend', input)
        }
    })
    .catch(error => {
        console.error(error.response); 
    })
}

function remove_search(){
    const search_icon = document.getElementsByClassName('fa-search')
    for (let i = 1; i < search_icon.length; i++) {
        search_icon[i].classList.remove('icon')
        search_icon[i].style.cursor = 'not-allowed'
    }
}
function add_search(){
    const search_icon = document.getElementsByClassName('fa-search')
    for (let i = 1; i < search_icon.length; i++) {
        search_icon[i].classList.add('icon')
        search_icon[i].style.cursor = 'pointer'
    }
}

//廠商還有在庫棧板，不能刪除訊息
function can_not_delet_warehouse(){
    const body = document.querySelector('body')
    let span = `<span class="alert"style="color: #457B9D;background-color:rgba(255, 255, 255,0.7);font-weight: 400;font-family: 'Noto Sans TC', sans-serif;font-size:24px;letter-spacing: .08em;padding: 10px 20px;margin-left:160px;border-radius:4px;transform:translate(-50%,-50%);position:fixed;top:15%;left:45%;z-index:100;box-shadow:0px 0px 8px #5c677a;">此廠商還有在庫棧板，不能刪除喔!</span>`
    body.insertAdjacentHTML('beforeend',span)
    setTimeout(function(){
        const alert = document.getElementsByClassName('alert')[0]
        body.removeChild(alert)
    },3000);
}

//棧板不在廠內，不能刪除訊息
function can_not_delet_pallet(){
    const body = document.querySelector('body')
    let span = `<span class="alert"style="color: #457B9D;background-color:rgba(255, 255, 255,0.7);font-weight: 400;font-family: 'Noto Sans TC', sans-serif;font-size:24px;letter-spacing: .08em;padding: 10px 20px;margin-left:160px;border-radius:4px;transform:translate(-50%,-50%);position:fixed;top:15%;left:45%;z-index:100;box-shadow:0px 0px 8px #5c677a;">此棧板不在廠內，不能刪除喔!</span>`
    body.insertAdjacentHTML('beforeend',span)
    setTimeout(function(){
        const alert = document.getElementsByClassName('alert')[0]
        body.removeChild(alert)
    },3000);
}

//類型仍被使用，不能刪除訊息
function can_not_delet_palletType(){
    const body = document.querySelector('body')
    let span = `<span class="alert"style="color: #457B9D;background-color:rgba(255, 255, 255,0.7);font-weight: 400;font-family: 'Noto Sans TC', sans-serif;font-size:24px;letter-spacing: .08em;padding: 10px 20px;margin-left:160px;border-radius:4px;transform:translate(-50%,-50%);position:fixed;top:15%;left:45%;z-index:100;box-shadow:0px 0px 8px #5c677a;">此類型仍被使用，不能刪除喔!</span>`
    body.insertAdjacentHTML('beforeend',span)
    setTimeout(function(){
        const alert = document.getElementsByClassName('alert')[0]
        body.removeChild(alert)
    },3000);
}

//新增成功訊息
function addSuccess(){
    const body = document.querySelector('body')
    let span = `<span class="alert"style="color: #457B9D;background-color:rgba(255, 255, 255,0.7);font-weight: 400;font-family: 'Noto Sans TC', sans-serif;font-size:24px;letter-spacing: .08em;padding: 10px 20px;margin-left:160px;border-radius:4px;transform:translate(-50%,-50%);position:fixed;top:15%;left:45%;z-index:100;box-shadow:0px 0px 8px #5c677a;">新增完成!</span>`
    body.insertAdjacentHTML('beforeend',span)
    setTimeout(function(){
        const alert = document.getElementsByClassName('alert')[0]
        body.removeChild(alert)
    },3000);
}

//修改成功訊息
function editSuccess(){
    const body = document.querySelector('body')
    let span = `<span class="alert"style="color: #457B9D;background-color:rgba(255, 255, 255,0.7);font-weight: 400;font-family: 'Noto Sans TC', sans-serif;font-size:24px;letter-spacing: .08em;padding: 10px 20px;margin-left:160px;border-radius:4px;transform:translate(-50%,-50%);position:fixed;top:15%;left:45%;z-index:100;box-shadow:0px 0px 8px #5c677a;;">修改完成!</span>`
    body.insertAdjacentHTML('beforeend',span)
    setTimeout(function(){
        const alert = document.getElementsByClassName('alert')[0]
        body.removeChild(alert)
    },3000);
}

//刪除成功訊息
function deletSuccess(){
    const body = document.querySelector('body')
    let span = `<span class="alert"style="color: #457B9D;background-color:rgba(255, 255, 255,0.7);font-weight: 400;font-family: 'Noto Sans TC', sans-serif;font-size:24px;letter-spacing: .08em;padding: 10px 20px;margin-left:160px;border-radius:4px;transform:translate(-50%,-50%);position:fixed;top:15%;left:45%;z-index:100;box-shadow:0px 0px 8px #5c677a;">刪除完成!</span>`
    body.insertAdjacentHTML('afterbegin',span)
    setTimeout(function(){
        const alert = document.getElementsByClassName('alert')[0]
        body.removeChild(alert)
    },3000);
}

//刪除失敗訊息
function deletFail(){
    const body = document.querySelector('body')
    let span = `<span class="alert"style="color: #457B9D;background-color:rgba(255, 255, 255,0.7);font-weight: 400;font-family: 'Noto Sans TC', sans-serif;font-size:24px;letter-spacing: .08em;padding: 10px 20px;margin-left:160px;border-radius:4px;transform:translate(-50%,-50%);position:fixed;top:15%;left:45%;z-index:100;box-shadow:0px 0px 8px #5c677a;">無法刪除，請檢查棧板的所在廠別!</span>`
    body.insertAdjacentHTML('afterbegin',span)
    setTimeout(function(){
        const alert = document.getElementsByClassName('alert')[0]
        body.removeChild(alert)
    },3000);
}

//add使用者權限
function add_permission_pop(){
    let template = `
    <div id="pop" class="add_permission">
        <i class="fa-close icon"></i>
        <h6>新增使用者權限</h6>
        <input type="text" placeholder="輸入程式代號..." value="">
        <h5></h5>
        <button id="check_btn"><i class="fa-checked icon"></i>確定</button>
    </div>
    <div id="mask"></div>`
    document.querySelector('body').insertAdjacentHTML('beforeend',template)
}
//add使用者
function add_user_pop(){
    let template = `
    <div id="pop" class="add_user">
        <i class="fa-close icon"></i>
        <h6>新增使用者</h6>
        <input type="text" placeholder="輸入使用者帳號..." value="">
        <input type="text" placeholder="輸入使用者名稱..." value="">
        <input type="password" placeholder="輸入使用者密碼..." value="">
        <input type="text" placeholder="輸入電子信箱..." value="">
        <h5></h5>
        <button id="check_btn"><i class="fa-checked icon"></i>確定</button>
    </div>
    <div id="mask"></div>`
    document.querySelector('body').insertAdjacentHTML('beforeend',template)
}

//delet 廠商/棧板 類型
function delet_type_pop(type){
    let template = `
    <div id="pop" class="delet_type ${type}">
        <p>您將刪除此類型，刪除後將無法回復。<br>您仍要刪除嗎?</p>
        <button id="delet_btn">我要刪除!!</button>
        <button id="close_pop_btn">我再想想..</button>
    </div>
    <div id="mask"></div>`
    document.querySelector('body').insertAdjacentHTML('beforeend',template)
}

//add棧板類型
function add_pallet_type_pop(){
    let template = `
    <div id="pop" class="add_pallet_type">
        <i class="fa-close icon"></i>
        <h6>新增棧板類型</h6>
        <input type="text" placeholder="輸入棧板類型代碼..." value="">
        <input type="text" placeholder="輸入棧板類型名稱..." value="">
        <input type="text" placeholder="輸入備註..." value="">
        <h5></h5>
        <button id="check_btn"><i class="fa-checked icon"></i>確定</button>
    </div>
    <div id="mask"></div>`
    document.querySelector('body').insertAdjacentHTML('beforeend',template)
}

//add廠商類型
function add_supplier_type_pop(){
    let template = `
    <div id="pop" class="add_supplier_type">
        <i class="fa-close icon"></i>
        <h6>新增廠商類型</h6>
        <input type="text" placeholder="輸入廠商類型代碼..." value="">
        <input type="text" placeholder="輸入廠商類型名稱..." value="">
        <input type="text" placeholder="輸入備註..." value="">
        <h5></h5>
        <button id="check_btn"><i class="fa-checked icon"></i>確定</button>
    </div>
    <div id="mask"></div>`
    document.querySelector('body').insertAdjacentHTML('beforeend',template)
}