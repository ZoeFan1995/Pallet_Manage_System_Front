
const url = 'http://192.168.25.60:8100'

//登入
const login_url = url + '/login'


//使用者資訊
const users_url = url + '/users'

const users_getAll_url = url + '/admin/users/all'

const users_dataChange_url = url + '/admin/users/data-change'

const users_resign_url = url + '/admin/users/resign'


//使用者權限
const permission_get_url = url + '/users/permission'

const permission_dataChange_url = url + '/admin/users/data-change/permission'


//廠商資料
const supplier_get_url = url + '/api/supplier'

const supplier_dataChange_url = url + '/api/supplier/data-change'


//棧板資料
const pallet_get_url = url + '/api/pallet'

const pallet_dataChange_url = url + '/api/pallet/data-change'


//借出列表
const lend_get_url = url + '/api/pallet/lend'

const lend_dataChange_url = url + '/api/pallet/data-change/lend'


//歸還列表
const return_get_url = url + '/api/pallet/return'

const return_dataChange_url = url + '/api/pallet/data-change/return'


//棧板報廢
const discard_get_url = url + '/api/pallet/discard'

const discard_dataChange_url = url + '/api/pallet/data-change/discard'


//棧板類型
const palletType_get_url = url + '/api/pallet/type'

const palletType_datachange_url = url + '/api/pallet/data-change/type'


//廠商類型
const supplierType_get_url = url + '/api/supplier/type'

const supplierType_datachange_url = url + '/api/supplier/data-change/type'


//取得在庫棧板
const inventory_url = url + '/api/warehouse/inventory'


//棧板在庫狀態
const inventory_status_url = url + '/api/warehouse/inventory/status'


//廠別代碼搜尋
const IdName_url  = url + '/api/supplier/IdName'