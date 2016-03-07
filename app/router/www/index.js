import Router from 'koa-router'

let router= Router({
  prefix: 'www/'
})


router.get('index.do',function(next){
  this.body = 'www Hello World!';
});

router.allowedMethods();

export default router
