import Router from 'koa-router'

import mock from './mock'
import www from './www'
import user from './user'
import book from './book'
//TODO: 未实现
//import client from './client'

let router= Router({
  prefix: '/'
})


router.get('index.do',function(next){
  let User = this.models.user;
  let UserObj = User.find()
  this.body = 'Hello World!';
});

// use sub router
router.use(mock.routes())
router.use(user.routes())
router.use(book.routes())
router.use(www.routes())
//router.use(client.routes())
router.allowedMethods()

export default router
