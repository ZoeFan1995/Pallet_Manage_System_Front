window.onload = () =>{
    const tBody = document.querySelector('tbody')
    const listArray = [{}]
    let token = ''
    let userId = ''
    let program_id = getQueryParams();

    getCookieByName()
    getHeader()
    getNav()
    getNoSearchBar()
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

    //監聽事件
    bar.addEventListener('click', (e)=> {
        //新增表單
        if (e.target.id ==="add_btn" || e.target.className ==="fa-add icon"){add_supplier_type_pop()};
    })
    body.addEventListener('click', (e)=> {
        //新增表單-關閉
        if (e.target.className ==="fa-close icon" && e.target.parentElement.id === 'pop'){close_pop()};
        //新增表單-確定
        if (e.target.id ==="check_btn" && e.target.parentNode.id === 'pop'){
            const div_Pop = e.target.offsetParent.children;
            const numRegExp = /^[\d]*$/
            if (div_Pop[2].value === "" || div_Pop[3].value === ""){
                div_Pop[2].setAttribute('class', 'change')
                div_Pop[3].setAttribute('class', 'change')
            } else if ( numRegExp.test(div_Pop[2].value) === false || div_Pop[2].value.length > 10){
                div_Pop[5].innerText = '類型代號需為數字，最多十碼'
                setTimeout( ()=> {
                    div_Pop[5].innerText = ''
                }, 3000)
            } else { postHandler(div_Pop) }
        }
        //刪除-跳出視窗-取消
        if (e.target.id === 'close_pop_btn') {
            close_pop()
            const closeBtnAll = document.getElementsByClassName('fa-close')
            for (i = 0; i < closeBtnAll.length; i++) {
                closeBtnAll[i].classList.remove('activ')
            };
        }
        //刪除-跳出視窗-刪除
        if (e.target.id === 'delet_btn') {
            const type = e.target.offsetParent.classList[1]
            deleteHandler(type)
        }
    })
    tBody.addEventListener('click', (e)=>{
        const tr = e.target.parentNode;
        const editIconAll = document.querySelectorAll('.fa-edit');
        const closeIconAll =  document.querySelectorAll('.fa-close');
        const canEditAll = document.querySelectorAll('.can_edit');
        //打開列表
        if (tr.nodeName === 'TR' && tr.classList[0] !== 'detail') {
            const detailTrDom = tr.nextElementSibling;
            const check_btn_dom = !!document.getElementById('check_btn')
            if ( check_btn_dom === true ){
                getHandler()
            } else {
                if ( tr.hasAttribute('class')){
                    tr.removeAttribute('class', 'bg_blue')
                    document.getElementsByClassName(detailTrDom.classList[1])[0].style.display = 'none'
                } else {
                    close_openTrs()
                    tr.setAttribute('class', 'bg_blue')
                    document.getElementsByClassName(detailTrDom.classList[1])[0].style.display = 'inline-block'
                };
            }
        }
        //編輯列表
        if (e.target.className ==="fa-edit icon list"){
            const editIcon = e.target;
            const detailTrClassName = tr.parentNode.nextElementSibling.classList[1];
            close_openTrs()
            //編輯與刪除不可操作
            for (i = 0 ;i < closeIconAll.length ;i++){closeIconAll[i].classList.remove('icon')};
            for (i = 0 ;i < editIconAll.length ;i++){editIconAll[i].classList.remove('icon')};
            editIcon.classList.remove('icon');
            editIcon.classList.add('activ');
            tr.parentNode.setAttribute('class', 'bg_blue');
            document.getElementsByClassName(detailTrClassName)[0].style.display = 'inline-block';
            document.getElementsByClassName(detailTrClassName)[0].insertAdjacentHTML('beforeend',close_btn);
            document.getElementsByClassName(detailTrClassName)[0].insertAdjacentHTML('beforeend',check_btn);
            for (i = 0 ;i < canEditAll.length ;i++){canEditAll[i].removeAttribute('readonly', 'readonly')};
        }
        //確定編輯
        if (e.target.id ==="check_btn" || e.target.className === "fa-checked icon"){
            const detailTrNodeList = e.target.offsetParent.parentElement.children;
            patchHandler(detailTrNodeList);
        }
        //取消編輯
        if (e.target.id ==="close_btn" || e.target.className === "fa-close icon"){
            getHandler()
        }
        //刪除列表
        if ( e.target.className === 'fa-close icon list') {
            const trNodeList = tr.parentNode.children;
            const closeIcon = e.target
            closeIcon.classList.add('activ');
            tr.parentNode.setAttribute('class', 'bg_blue');
            document.getElementsByClassName(trNodeList[2].innerText)[0].style.display = 'inline-block';
            delet_type_pop(trNodeList[2].innerText)
        }
    })

    //取得廠商類型
    function getHandler(){
        tBody.innerHTML = ""
        tBody.innerHTML = `
        <tr id="list_tittle">
            <td></td>
            <td></td>
            <td>廠商類型代碼:</td>
            <td>廠商類型名稱:</td>
            <td>備註:</td>
        </tr>`
        const obj = {
            "program_id": program_id,
            "account_number": userId
        }
        axios.post(supplierType_get_url ,obj , {
            headers: {'Authorization': token}
        })
        .then(res => {
            const data = res.data.data
            listArray.lists = data
        })
        .catch(err => {
            console.error(err); 
        })
    }
    BindValue(listArray, 'lists', (val)=>{
        val.forEach(item => {
            let template = `
            <tr>
                <td><i class="fa-edit icon list"></i></td>
                <td><i class="fa-close icon list"></i></td>
                <td>${item.sup_type_id}</td>
                <td>${item.sup_type_name}</td>
                <td>${item.remark}</td>
            </tr>`
            tBody.insertAdjacentHTML('beforeend', template)
            let datailTemplate = `
            <tr class="detail ${item.sup_type_id}">
                <td>廠商類型代碼:<input type="text" name="pallet_type_id" value="${item.sup_type_id}" readonly="readonly"></td>
                <td>廠商類型名稱:<input type="text" name="pallet_type_name" value="${item.sup_type_name}" readonly="readonly" class="can_edit"></td>
                <td>備註:<input type="text" name="remark" value="${item.remark}" readonly="readonly" class="can_edit"></td>
            </tr>`
            tBody.insertAdjacentHTML('beforeend', datailTemplate)
            document.getElementsByClassName(item.sup_type_id)[0].style.display = 'none'
        })
    })

    //新增廠商類型
    function postHandler(div_Pop){
        const obj = {
            "program_id": program_id,
            "account_number": userId,
            "sup_type_id":  Number(div_Pop[2].value),
            "sup_type_name": div_Pop[3].value,
            "remark": div_Pop[4].value,
            "modifier_user": userId
        }
        axios.post(supplierType_datachange_url ,obj , {
            headers: {'Authorization': token}
        })
        .then(res => {
            console.log(res)
            close_pop()
            getHandler()
            addSuccess()
        })
        .catch(error => {
            console.error(error.response); 
            if ( error.response.data.data === '400.1' ){
                const h5Dom = document.getElementsByClassName('add_supplier_type')[0].children[5]
                h5Dom.innerText = '此類型代碼已建立'
                setTimeout(()=>{
                    h5Dom.innerText = ''
                }, 3000)
            }
        })
    }

    //修改廠商類型
    function patchHandler(detailTrNodeList){
        const obj = {
            "program_id": program_id,
            "account_number": userId,
            "sup_type_id": Number(detailTrNodeList[0].children[0].value),
            "sup_type_name": detailTrNodeList[1].children[0].value,
            "remark": detailTrNodeList[2].children[0].value,
            "modifier_user": userId
        }
        axios.patch(supplierType_datachange_url, obj, {
            headers: {'Authorization': token}
        })
        .then(res => {
            getHandler()
            editSuccess()
            console.log(res)
        })
        .catch(error => {
            console.error(error.response); 
        })
    }
    
    //刪除廠商類型
    function deleteHandler(type){
        const obj = {
            "program_id": program_id,
            "account_number": userId,
            "sup_type_id": Number(type),
            "modifier_user": userId
        }
        axios.put(supplierType_datachange_url, obj, {
            headers: {'Authorization': token}
        })
        .then(res => {
            console.log(res)
            close_pop()
            getHandler()
            deletSuccess()
        })
        .catch(error => {
            console.error(error.response); 
            if (error.response.data.data === '400.2') {
                close_pop()
                getHandler()
                can_not_delet_palletType()
            }
        })
    }
}