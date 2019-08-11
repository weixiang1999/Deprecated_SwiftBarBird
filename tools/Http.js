import {Platform,AsyncStorage,NetInfo,Alert} from 'react-native';
import {Tips} from '../tools/Normal';
import RNFetchBlob from 'rn-fetch-blob';
export default Http={
    get:async (url, params = {}, timeOut = 0) => {
        const NetStatus = await NetInfo.getConnectionInfo();
        if(NetStatus.type==='none'||NetStatus.type==='unknown')
        {
            Tips('联网状态异常，请检查应用网络权限或者重启应用再试');
        }
        else
        {
            if(params)
            {
                let paramsArray = [];
                Object.keys(params).forEach(key =>{
                    if (Array.isArray(params[key])) {
                        params[key].forEach(i=>{
                            paramsArray.push(key + "=" + i);
                        })
                    } else {
                        paramsArray.push(key + "=" + params[key]);
                    }
                });
                if (url.search(/\?/) === -1) 
                {
                    url = url + "?" + paramsArray.join("&");
                } 
                else 
                {
                    url = url + "&" + paramsArray.join("&");
                }
                console.log(url);
            }            
            return new Promise((resolve, reject) => {
                AsyncStorage.getItem('token',(err,result)=>{
                    const req = {
                        method: 'GET',
                        headers: {
                            Authorization: result,
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    }
                    fetch(url, req)
                    .then(response => {
                        //console.log(response);
                        return response.json();
                    })
                    .then(result => {
                        //console.log(result);
                        console.log(timeOut)
                        setTimeout(() => { resolve(result) }, timeOut);
                    })
                    .catch(error => {
                        Tips('请求出错，请检查网络或联系管理员');
                    }); 
                })
                
            });
        }     
        
    },
    getFromAPI:async (url, params, timeOut = 0) => {
        const NetStatus = await NetInfo.getConnectionInfo();
        if(NetStatus.type==='none'||NetStatus.type==='unknown')
        {
            Tips('联网状态异常，请检查应用网络权限或者重启应用再试');
        }
        else
        {
            if(params.filter)
            {
                let paramsArray = [];
                const { filter } = params;
                Object.keys(filter).forEach(key => {
                    if (Array.isArray(filter[key])) {
                        filter[key].forEach(i => {
                            paramsArray.push(key + "=" + i);
                        })
                    } else {
                        paramsArray.push(key + "=" + filter[key]);
                    }
                });
                if (url.search(/\?/) === -1) 
                {
                    url = url + "?" + paramsArray.join("&");
                } 
                else 
                {
                    url = url + "&" + paramsArray.join("&");
                }
                console.log(url);
            }
            if(params.attributes)
            {
                let paramsArray = [];
                params.attributes.forEach(key =>{
                    paramsArray.push('attributes=' + key);
                });
                if (url.search(/\?/) === -1) 
                {
                    url = url + "?" + paramsArray.join("&");
                } 
                else 
                {
                    url = url + "&" + paramsArray.join("&");
                }
                console.log(url);
            }       
            return new Promise((resolve, reject) => {
                AsyncStorage.getItem('token',(err,result)=>{
                    const req = {
                        method: 'GET',
                        headers: {
                            Authorization: result,
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    }
                    fetch(url, req)
                    .then(response => {
                        //console.log(response);
                        return response.json();
                    })
                    .then(result => {
                        //console.log(result);
                        console.log(timeOut)
                        setTimeout(() => { resolve(result) }, timeOut);
                    })
                    .catch(error => {
                        Tips('请求出错，请检查网络或联系管理员');
                    }); 
                })
                
            });
        }     
        
    },
    //已经封装了data:body请求
    post:async (url,body,params)=>
    {
        const NetStatus = await NetInfo.getConnectionInfo();
        if(NetStatus.type==='none'||NetStatus.type==='unknown')
        {
            Tips('联网状态异常，请检查应用网络权限或者重启应用再试');
        }
        else
        {
            if(params)
            {
                let paramsArray = [];
                Object.keys(params).forEach(key =>
                    paramsArray.push(key + "=" + params[key])
                );
                if (url.search(/\?/) === -1) 
                {
                    url = url + "?" + paramsArray.join("&");
                } 
                else 
                {
                    url = url + "&" + paramsArray.join("&");
                }
                //console.log(url);
            }
            const token = await AsyncStorage.getItem('token');
            return new Promise((resolve, reject) => {
                const fetchOptions = {
                    method: 'POST',
                    body: JSON.stringify({data:body}) ,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: token,
                      },
                };
                fetch(url, fetchOptions)
                .then(response => response.json())
                .then(result => {
                    setTimeout(()=>resolve(result),0);
                    
                })
                .catch(error => {
                    Tips('请求出错，请检查网络或联系管理员');
                }); 
            });
        }     
    },
    put:async (url,body,params)=>
    {
        const NetStatus = await NetInfo.getConnectionInfo();
        if(NetStatus.type==='none'||NetStatus.type==='unknown')
        {
            Tips('联网状态异常，请检查应用网络权限或者重启应用再试');
        }
        else
        {
            if(params)
            {
                let paramsArray = [];
                Object.keys(params).forEach(key =>
                    paramsArray.push(key + "=" + params[key])
                );
                if (url.search(/\?/) === -1) 
                {
                    url = url + "?" + paramsArray.join("&");
                } 
                else 
                {
                    url = url + "&" + paramsArray.join("&");
                }
                //console.log(url);
            }
            const token = await AsyncStorage.getItem('token');
            return new Promise((resolve, reject) => {
                const fetchOptions = {
                    method: 'PUT',
                    body: JSON.stringify({data:body}) ,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: token,
                      },
                };
                fetch(url, fetchOptions)
                .then(response => response.json())
                .then(result => {
                    setTimeout(()=>resolve(result),0);
                    //console.log(result);
                })
                .catch(error => {
                    Tips('请求出错，请检查网络或联系管理员');
                }); 
            });
        }     
    },
    delete:async (url,body,params)=>
    {
        const NetStatus = await NetInfo.getConnectionInfo();
        if(NetStatus.type==='none'||NetStatus.type==='unknown')
        {
            Tips('联网状态异常，请检查应用网络权限或者重启应用再试');
        }
        else
        {
            if(params)
            {
                let paramsArray = [];
                Object.keys(params).forEach(key =>
                    paramsArray.push(key + "=" + params[key])
                );
                if (url.search(/\?/) === -1) 
                {
                    url = url + "?" + paramsArray.join("&");
                } 
                else 
                {
                    url = url + "&" + paramsArray.join("&");
                }
                //console.log(url);
            }
            const token = await AsyncStorage.getItem('token');
            return new Promise((resolve, reject) => {
                const fetchOptions = {
                    method: 'DELETE',
                    body: JSON.stringify({data:body}) ,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: token,
                      },
                };
                fetch(url, fetchOptions)
                .then(response => response.json())
                .then(result => {
                    setTimeout(()=>resolve(result),0);
                    //console.log(result);
                })
                .catch(error => {
                    Tips('请求出错，请检查网络或联系管理员');
                }); 
            });
        }     
    },
    imageUpload:(url,imgObj,body)=>
    {
        return new Promise(async (resolve,reject)=>
        {
            const jwt = await AsyncStorage.getItem('jwt');
            RNFetchBlob.fetch('POST', url, {
                Authorization : jwt,
                'Content-Type' : 'multipart/form-data',
            }, [
                // element with property `filename` will be transformed into `file` in form data
                // { name : 'avatar', filename : 'avatar.png', data: binaryDataInBase64},
                // { name : 'avatar-png', filename : 'avatar-png.png', type:'image/png', data: binaryDataInBase64},
                // part file from storage
                { name : 'file', filename :imgObj.name, type:'image/jpg', data: RNFetchBlob.wrap(Platform.OS==='ios'?imgObj.path:imgObj.path)},
                // elements without property `filename` will be sent as plain text
                //{ name : 'name', data : 'user'},
                ...Object.keys(body).map(key => ({name:key,data:body[key]})),
            ]).then((resp) => {
                resolve(JSON.parse(resp.data));
                // console.log(resp);
            }).catch((err) => {
                resolve(err);
                // console.log(err);
            })
        })
        
    },
}