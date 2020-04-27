import Router from 'koa-router'
import  Redis from 'redis'
import Request from 'request'

//const RedisClient = Redis.createClient()
let router= Router({
  prefix: 'weapp'
})

// 小程序参数
const APP_ID = 'wx8b2741c6d5d7fece'
const APP_SECRET = 'd7b2db4a511e46eec9701dffbce98cb3'

/********** 业务处理开始 **********/

// 获取解密SessionKey
const getSessionKey = (code, callback) => {
	const url = 'https://api.weixin.qq.com/sns/jscode2session?appid='
		+ APP_ID + '&secret=' + APP_SECRET + '&js_code=' + code
		+ '&grant_type=authorization_code'
	Request(url, (error, response, body) => {
		if (!error && response.statusCode == 200) {
			console.log('getSessionKey:', body, typeof (body))

			const data = JSON.parse(body)
			if (!data.session_key) {
				callback({
					code: 1,
					message: data.errmsg
				})
				return
			}
			callback(null, data)
		} else {
			callback({
				code: 1,
				message: error
			})
		}
	})
}

// 解密
const decrypt = (sessionKey, encryptedData, iv, callback) => {
	try {
		const pc = new WXBizDataCrypt(APP_ID, sessionKey)
		const data = pc.decryptData(encryptedData, iv)
		console.log('decrypted:', data)
		callback(null, data)
	} catch (e) {
		console.log(e)
		callback({
			code: 1,
			message: e
		})
	}
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
router.post('/login', (ctx) => {
	const data = ctx.request.body
	console.log('POST：/signIn, 参数：', data)

	if (!data.code) {
		ctx.body={
			code: 1,
			message: '缺少参数：code'
		}
		return
	} else if (!data.encryptedData) {
		ctx.body={
			code: 1,
			message: '缺少参数：encryptedData'
		}
		return
	} else if (!data.iv) {
		ctx.body={
			code: 1,
			message: '缺少参数：iv'
		}
		return
	}

	// 获取sessionkey
	getSessionKey(data.code, (err, ret) => {
		if (err) {
			ctx.body=err
			return
		}
		console.log(ret)
		// 解密
/*
		decrypt(ret.session_key, data.encryptedData, data.iv, (err, ret) => {
			if (err) {
				res.end(err)
				return
			}

			console.log(ret)
			// 保存用户信息
			const people = {
				peopleId: uuid.v1(),
				channel: 'wechat',
				unionId: (ret.unionId) ? ret.unionId : ret.openId,
				name: ret.nickName,
				avatar: ret.avatarUrl,
				created: new Date().getTime(),
				updated: new Date().getTime()
			}
			Peoples.findAndModify({
				query: {
					channel: 'wechat',
					unionId: (ret.unionId) ? ret.unionId : ret.openId
				},
				update: {
					"$set": {
						name: ret.nickName,
						avatar: ret.avatarUrl,
						updated: new Date().getTime()
					}
				}
			}, (err, exist) => {
				if (!exist) { // 不存在帐户，创建新帐户
					Peoples.save(people, (err, ret) => {
						// 保存登录状态
						saveAuth(people.peopleId, (err, ret) => {
							res.send({
								code: 0,
								data: {
									token: ret,
									people: people
								}
							})
						})
					})
					return
				} else { // 存在帐户
					// 保存登录状态
					saveAuth(exist.peopleId, (err, ret) => {
						console.log('token:', ret)
						res.send({
							code: 0,
							data: {
								token: ret,
								people: exist
							}
						})
					})
				}
			})
		})
	*/
	})

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
