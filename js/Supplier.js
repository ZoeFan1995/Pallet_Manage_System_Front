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
    header.addEventListener('click', (e) => {
        //home btn導回借出列表
        if (e.target.className === 'fa-home icon') {
            document.location.href = homePage
        }
    })
    bar.addEventListener('click', (e) => {
        //新增表單
        if (e.target.id === "add_btn" || e.target.className === "fa-add icon") {
            get_sup_type().then((res) => {
                const data = res.data
                add_supplier_pop(data)
            })
        };
    })
    bar.addEventListener('keyup', (e) => {
        //搜尋BAR
        if (e.key === 'Enter' && e.target.parentElement.id === 'search_bar') {
            const parameter = e.target.value
            index = 1
            if (parameter === '') {
                getHandler(parameter, index)
            } else {
                getHandler(parameter)
            }
        }
    })
    body.addEventListener('click', (e) => {
        //新增表單-關閉
        if (e.target.className === "fa-close icon" && e.target.parentElement.id === 'pop') {
            close_pop()
        };
        //新增表單-確定
        if (e.target.id === "check_btn" && e.target.parentNode.id === 'pop') {
            const div_Pop = e.target.offsetParent.children;
            if (div_Pop[2].value === "" || div_Pop[3].value === "" || div_Pop[6].value === "") {
                div_Pop[2].setAttribute('class', 'change')
                div_Pop[3].setAttribute('class', 'change')
                div_Pop[5].setAttribute('class', 'change')
            } else if (div_Pop[2].value.length !== 9) {
                div_Pop[6].innerText = '廠商代號需為九碼數字'
                setTimeout(function () {
                    div_Pop[6].innerText = ''
                }, 3000)
            } else {
                const sup_type_id = div_Pop[4].options[selectBox.selectedIndex].value;
                postHandler(div_Pop, sup_type_id)
            }
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
            const warehouse_id = e.target.offsetParent.classList[1]
            deleteHeadler(warehouse_id)
        }
    })
    body.addEventListener('keyup', (e) => {
        //新增表單-確定(enter)
        if (e.key === "Enter" && e.target.parentNode.id === 'pop') {
            const div_Pop = e.target.offsetParent.children;
            if (div_Pop[2].value === "" || div_Pop[3].value === "" || div_Pop[6].value === "") {
                div_Pop[2].setAttribute('class', 'change')
                div_Pop[3].setAttribute('class', 'change')
                div_Pop[5].setAttribute('class', 'change')
            } else if (div_Pop[2].value.length !== 9) {
                div_Pop[6].innerText = '廠商代號需為九碼數字'
                setTimeout(function () {
                    div_Pop[6].innerText = ''
                }, 3000)
            } else {
                const sup_type_id = div_Pop[4].options[selectBox.selectedIndex].value;
                postHandler(div_Pop, sup_type_id)
            }
        }
    })
    tBody.addEventListener('click', (e) => {
        const tr = e.target.parentNode;
        const editIconAll = document.querySelectorAll('.fa-edit');
        const closeIconAll = document.querySelectorAll('.fa-close');
        const canEditAll = document.querySelectorAll('.can_edit');
        //打開列表
        if (tr.nodeName === 'TR' && tr.classList[0] !== 'detail') {
            const detailTrDom = tr.nextElementSibling;
            const check_btn_dom = !!document.getElementById('check_btn')
            if (check_btn_dom === true) {
                let parameter = document.getElementById('search_bar').children[1].value
                getHandler(parameter)
            } else {
                if (tr.id !== 'list_tittle' && tr.hasAttribute('class')) {
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
        if (e.target.className === "fa-edit icon list") {
            const editIcon = e.target;
            const detailTrClassName = tr.parentNode.nextElementSibling.classList[1];
            const supTypeDom = document.getElementsByClassName(detailTrClassName)[0].children[2]
            close_openTrs()
            //編輯與刪除不可操作
            for (i = 0; i < closeIconAll.length; i++) {
                closeIconAll[i].classList.remove('icon')
            };
            for (i = 0; i < editIconAll.length; i++) {
                editIconAll[i].classList.remove('icon')
            };
            editIcon.classList.add('activ');
            tr.parentNode.setAttribute('class', 'bg_blue');
            document.getElementsByClassName(detailTrClassName)[0].style.display = 'inline-block';
            document.getElementsByClassName(detailTrClassName)[0].insertAdjacentHTML('beforeend', close_btn);
            document.getElementsByClassName(detailTrClassName)[0].insertAdjacentHTML('beforeend', check_btn);
            for (i = 0; i < canEditAll.length; i++) {
                canEditAll[i].removeAttribute('readonly', 'readonly')
            };
            get_sup_type().then(res => {
                const select = document.createElement('select')
                const input = supTypeDom.children[0]
                const data = res.data
                for (let i = 0; i < data.length; i++) {
                    if (data[i].sup_type_name === supTypeDom.children[0].value) {
                        let sec_type = `
                        <option value="${data[i].sup_type_id}" selected="selected" >${data[i].sup_type_name}</option>`
                        select.insertAdjacentHTML('beforeend', sec_type)
                    } else {
                        let type = `
                        <option value="${data[i].sup_type_id}">${data[i].sup_type_name}</option>`
                        select.insertAdjacentHTML('beforeend', type)
                    }
                }
                supTypeDom.removeChild(input)
                supTypeDom.appendChild(select)
            })
        }
        //確定編輯
        if (e.target.id === "check_btn" || e.target.className === "fa-checked icon") {
            const detailTrNodeList = e.target.offsetParent.parentElement.children;
            const select = document.querySelector('select');
            const sup_type_id = select.options[select.selectedIndex].value;
            patchHandler(detailTrNodeList, sup_type_id);
        }
        //取消編輯
        if (e.target.id === "close_btn" || e.target.className === "fa-close icon") {
            let parameter = document.getElementById('search_bar').children[1].value
            getHandler(parameter)
        }
        //刪除列表
        if (e.target.className === "fa-close icon list") {
            const closeIcon = e.target;
            const warehouse_id = tr.parentNode.id
            close_openTrs()
            closeIcon.classList.add('activ');
            tr.parentNode.setAttribute('class', 'bg_blue');
            document.getElementsByClassName(warehouse_id)[0].style.display = 'inline-block';
            delet_list_pop(warehouse_id)
        }
    })
    footer.addEventListener('click', (e) => {
        //下一頁
        if (e.target.classList[0] === 'fa-arrow-right' || e.target.id === 'next') {
            const parameter = bar.children[1].children[1].value
            getHandler(parameter, index++)
        }
        //上一頁
        if (e.target.classList[0] === 'fa-arrow-left' || e.target.id === 'previous') {
            const parameter = bar.children[1].children[1].value
            if (index === 1) {
                return
            } else {
                getHandler(parameter, index--)
            }
        }
    })

    //get廠商資料
    function getHandler(parameter) {
        tBody.innerHTML = ""
        tBody.innerHTML = `
        <tr id="list_tittle">
            <td></td>
            <td></td>
            <td>廠商代號:</td>
            <td>類型:</td>
            <td>廠商名稱:</td>
        </tr>`
        //firstPage disabled
        if (index === 1) {
            footer.childNodes[1].setAttribute('class', 'opacity')
        } else {
            footer.childNodes[1].removeAttribute('class', 'opacity')
        }
        if (parameter === undefined) {
            parameter = ""
        }

        const obj = {
            "program_id": program_id,
            "page": index,
            "search": parameter,
            "account_number": userId
        }
        axios.post(supplier_get_url, obj, {
                headers: {
                    'Authorization': token
                }
            })
            .then(res => {
                const data = res.data.data
                //lastPage disabled
                if (data.length === 0) {
                    if (index === 1) {
                        let tr = `
                    <tr id="not_found">
                    <td colspan="6">找不到資料餒( ; ω ; )</td>
                    </tr>`
                        tBody.insertAdjacentHTML('beforeend', tr)
                    } else {
                        getHandler(parameter, index--)
                    }
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
    BindValue(listArray, 'lists', (val) => {
        val.forEach(item => {
            let template = `
            <tr id="${item.warehouse_id}">
                <td><i class="fa-edit icon list"></i></td>
                <td><i class="fa-close icon list"></i></td>
                <td>${item.warehouse_id}</td>
                <td>${item.sup_type_name}</td>
                <td>${item.warehouse_name}</td>
            </tr>`
            tBody.insertAdjacentHTML('beforeend', template)

            let detailTemplate = `
            <tr class="detail ${item.warehouse_id}" >
                <td>廠商代號<input type="text" value="${item.warehouse_id}" name="warehouse_id" readonly="readonly"></td>
                <td>廠商名稱<input type="text" value="${item.warehouse_name}" name="warehouse_name" class="can_edit" readonly="readonly"></td>
                <td>廠商類型<input type="text" value="${item.sup_type_name}" name="sup_type_name" readonly="readonly"></td>
                <td>棧板基量<input type="text" value="${item.pallet_base}" name="pallet_base" class="can_edit" readonly="readonly"></td>
                <td>在庫棧板數量<div></div></td>
                <td>備註<input type="text" name="remark" value="${item.remark}" class="can_edit" readonly="readonly"></td>
            </tr>`
            tBody.insertAdjacentHTML('beforeend', detailTemplate)
            document.getElementsByClassName(item.warehouse_id)[0].style.display = 'none'

            palletTotal(item.warehouse_id, item.pallet)
        });

        function palletTotal(warehouse_id, pallet) {
            const inventoryPallet = document.getElementsByClassName(warehouse_id)[0].children[4].children[0]
            for (let i = 0; i < pallet.length; i++) {
                let span = `
                <span>${pallet[i].pallet_type_name} ${pallet[i].total}個</span>`
                inventoryPallet.insertAdjacentHTML('beforeend', span)
            }

        }
    })


    //刪除廠商
    function deleteHeadler(warehouse_id) {
        const obj = {
            "warehouse_id": warehouse_id,
            "program_id": program_id,
            "modifier_user": userId,
            "account_number": userId
        }
        axios.put(supplier_dataChange_url, obj, {
                headers: {
                    'Authorization': token
                }
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
                if (error.response.data.data === '400.2') {
                    close_pop()
                    getHandler()
                    can_not_delet_warehouse()
                }
            })
    }
    //新增廠商
    function postHandler(div_Pop, sup_type_id) {
        const obj = {
            "account_number": userId,
            "program_id": program_id,
            "create_data": {
                "warehouse_name": div_Pop[3].value,
                "warehouse_id": div_Pop[2].value,
                "sup_type_id": Number(sup_type_id),
                "telephone": "",
                "pallet_base": Number(div_Pop[5].value),
                "creator_user": userId
            }
        }
        axios.post(supplier_dataChange_url, obj, {
                headers: {
                    'Authorization': token
                }
            })
            .then(res => {
                console.log(res)
                document.getElementById('search_bar').children[1].value = ""
                close_pop()
                getHandler()
                addSuccess()
            })
            .catch(error => {
                console.log(error.response);
                if (error.response.data.data === '400.1') {
                    document.getElementById('pop').children[7].innerText = "此廠商代號已建立"
                }
            })
    }
    //修改廠商資料
    function patchHandler(detailTrNodeList, sup_type_id) {
        const obj = {
            "program_id": program_id,
            "account_number": userId,
            "warehouse_id": detailTrNodeList[0].children[0].value,
            "update_data": {
                "warehouse_name": detailTrNodeList[1].children[0].value,
                "sup_type_id": Number(sup_type_id),
                "telephone": "",
                "pallet_base": Number(detailTrNodeList[3].children[0].value),
                "remark": detailTrNodeList[5].children[0].value,
                "modifier_user": userId
            }
        }
        axios.patch(supplier_dataChange_url, obj, {
                headers: {
                    'Authorization': token
                }
            })
            .then(res => {
                let parameter = document.getElementById('search_bar').children[1].value
                getHandler(parameter)
                editSuccess()
                console.log(res)
            })
            .catch(error => {
                console.error(error.response);
            })
    }
    //廠商類型 Promise
    function get_sup_type() {
        const obj = {
            "program_id": program_id,
            "account_number": userId
        }
        const promise = axios.post(supplierType_get_url, obj, {
            headers: {
                'Authorization': token
            }
        })
        const dataPromise = promise.then((res) => res.data)
        return dataPromise
    }
}