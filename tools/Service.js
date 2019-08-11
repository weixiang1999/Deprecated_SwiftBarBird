
const host = false ? 'http://47.110.55.142:7001' : 'http://47.106.153.116:7001';
const apiV1 = '/api/v1';
export default Service = {
    test:'http://47.106.153.116:3000/client/login',
    host:host,
    login: host+'/login',
    loginByJWT: host + '/loginbyjwt',
    register: host + '/register',
    changePassword: host + '/changepassword',
    getTodayData: host + apiV1 + '/gettodaydata',
    user: host + apiV1 +'/user',
    bar: host + apiV1 + '/bar',
    img: host + apiV1 + '/image',
    package: host + apiV1 + '/package',
    order: host + apiV1 + '/order',
    announcement: host + apiV1 + '/announcement',
    account: host + apiV1 + '/account',

}

