import Router from 'koa-router'
import  Redis from 'redis'
import Request from 'request'
import WXBizDataCrypt from './crypto'
import {successResData,failedRes} from '../../Utils/RouterResultUtils'


//const RedisClient = Redis.createClient()
let router= Router({
  prefix: 'weapp'
})

// 小程序参数
const APP_ID = 'wx9b131ef491a04d81'
const APP_SECRET = 'b960b3273c51bfdbf3b65555882aa1f7'

/********** 业务处理开始 **********/

// 获取解密SessionKey
const getSessionKey = (code) => {
	const url = 'https://api.weixin.qq.com/sns/jscode2session?appid='
		+ APP_ID + '&secret=' + APP_SECRET + '&js_code=' + code
		+ '&grant_type=authorization_code'
	return new Promise(function(reslove,reject){

		Request(url, (error, response, body) => {
			if (!error && response.statusCode == 200) {
				console.log("remote error",error)
				console.log('getSessionKey:', body, typeof (body))

//				console.log("replace:",body.replace(/\//g,"\\\/"))
				const data = JSON.parse(body)
				console.log("remote data",data)
				if (!data.session_key) {
					reject({
						code: 1,
						message: data.errmsg
					})
				}else{
					reslove(data)
				}
			} else {
				reject({
					code: 1,
					message: error
				})
			}
		})
	})
}

// 解密
const decrypt = (sessionKey, encryptedData, iv, callback) => {
	return new Promise(function(reslove,reject){
		try {
			const pc = new WXBizDataCrypt(APP_ID, sessionKey)
			const data = pc.decryptData(encryptedData, iv)
			console.log('decrypted:', data)
			reslove(data)
		} catch (e) {
			console.log("decrypt",e)
			reject({
				code: 1,
				message: e
			})
		}
	})
}

// 存储登录状态
const saveAuth = (peopleId, callback) => {
	const token = uuid.v1()
/*
	RedisClient.set('WEAPP_AUTH:' + token, peopleId, (err, ret) => {
		console.log(err, ret)
		callback(err, token)
	})
*/
}

// 获取登录状态
const checkAuth = (token, callback) => {
/*
	RedisClient.get('WEAPP_AUTH:' + token, (err, ret) => {
		callback(err, ret)
	})
*/
}

// 清除登录状态
const clearAuth = (token, callback) => {
/*
	RedisClient.del('WEAPP_AUTH:' + token, (err, ret) => {
		callback(err, ret)
	})
*/
}

// 小程序登录
router.post('/decrypt', async(ctx) => {
        const data = ctx.request.body
        let User = ctx.app.context.db.user
        let Plant = ctx.app.context.db.plant

        console.log('POST：/decrpt, 参数：', data)

        if (!data.code) {
								ctx.body=failedRes('缺少参数：code')
                return
        } else if (!data.encryptedData) {
                ctx.body=failedRes('缺少参数：encryptedData')
                return
        } else if (!data.iv) {
                ctx.body=failedRes('缺少参数：iv')
                return
        }

        // 获取sessionkey
        const rethh = await getSessionKey(data.code)
        const ret= await decrypt(rethh.session_key, data.encryptedData, data.iv)
	console.log("ret",ret)
	ctx.body = successResData(ret) 
})

// 小程序登录
router.post('/login', async(ctx) => {
	const data = ctx.request.body
	let User = ctx.app.context.db.user

	if (!data.phoneNumber) {
		ctx.body = failedRes('缺少参数：phoneNumber')
		return
	} else if (!data.loginType) {
		ctx.body = failedRes('缺少参数：loginType')
		return
	}
	
	const user = await User.find({phoneNumber:data.phoneNumber})
	if(user.length>0){
	 let us	=await User.update({id:user[0].id},{unionId:"jwtid"})
	}else{
		u =await User.create(data)
		// await Plant.create({id:u.id})
	}
	ctx.body=successResData(u)
})

// 退出登录
router.post('/logout', (req, res) => {
	const data = req.body
	console.log('POST：/signOut, 参数：', data)
	if (!data.token) {
		res.send({
			code: 1,
			message: '缺少参数：token'
		})
		return
	}
	clearAuth(data.token, (err, ret) => {
		if (err) {
			res.send({
				code: 1,
				message: '退出出错'
			})
			return
		}
		res.send({
			code: 0,
			data: {}
		})
	})
})

// 发送消息
router.post('/messages', (req, res) => {
	const data = req.body
	console.log('POST: /messages，参数：', data)
	if (!data.token) {
		res.send({
			code: 1,
			message: '缺少参数：token'
		})
		return
	}

	checkAuth(data.token, (err, ret) => {
		console.log('checkAuth', err, ret)
		if (err) {
			res.send({
				code: 1,
				message: '服务器故障'
			})
			return
		} else if (!ret) {
			res.send({
				code: 1,
				message: '授权失败，请重新登录'
			})
			return
		}

		// 这里实现发送逻辑，这里用获取个人信息说明token -> people
		Peoples.findOne({ peopleId: ret }, (err, ret) => {
			console.log('people:', err, ret)
			res.send({
				code: 0,
				data: {
					name: ret.name
				}
			})
		})
	})
})

router.allowedMethods();

export default router
