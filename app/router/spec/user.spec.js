import supertest from 'supertest'
import {expect} from 'chai'

import app from '../../app'

let request = supertest(app.listen(1985,()=>console.log('testServer is start')));

describe('/user/', function () {
  // 我们的第一个测试用例，好好理解一下
  it('should return 55 when n is 10', function (done) {
			request.get('/user/').expect(200,done)
	})
})
