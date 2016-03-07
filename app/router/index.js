import Router from 'koa-router'

import www from './www'
import user from './user'

let router= Router({
  prefix: '/'
})


router.get('index.do',function(next){
  let User = this.models.user;
  let UserObj = User.find()
  this.body = 'Hello World!';
});

// use sub router
router.use(user.routes())
router.use(www.routes())
router.allowedMethods()

export default router
