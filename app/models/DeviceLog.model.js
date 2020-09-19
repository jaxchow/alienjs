import Waterline from 'waterline'
//我的数据表
var DeviceLog = Waterline.Collection.extend({
    identity: 'deviceLog',
    connection: 'mongo',
    attributes: {
        id: {
            type: 'objectid',
            unique: true,
            primaryKey: true,
        },
        // 设备id
        deviceId: {
            type: 'string',
        },
        // 用户id
        userId: {
            type: 'string'
        },
        //  "0" : 解绑， "1" 绑定
        type:{
            type:'string'
        }

    },
});


module.exports = DeviceLog;
