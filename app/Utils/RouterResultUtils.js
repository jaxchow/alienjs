export function successResData(data){
    return {
        data:data,
        message:'',
        status:200
    }
}

export function failedRes(message){
    return {
        data:{},
        message:message||'未查询到数据',
        status:500
    }
}

export function failedLoginRes(){
    return {
        status:401,
        data:{},
        message:'登录失败'
    }
}