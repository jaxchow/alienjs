import supertest from 'supertest'
import app from '../../app'
let request = supertest(app.listen());

describe('/user/', function () {
  // 我们的第一个测试用例，好好理解一下
  it.skip('should return 55 when n is 10', function (done) {
		request.get('/user/').expect(200,done)
  })
  
  it('user/:userId/device',function(done){
    request.get('user/1/device').expect(200,done)
  })
})
