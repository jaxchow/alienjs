import convert from 'koa-convert'
import logger from 'koa-logger'
import responseTime from 'koa-response-time'
import gzip from 'koa-gzip'
import slow from 'koa-slow'
import session from 'koa-session'

import Alien from './alien'
import router from './router'
import models from './models'

let	app =new Alien()

app.keys=['alienjs']
// logger
// app.mw(app.APPLICATION,middleware)
// app.mw(app.SESSION,middleware)
// app.mw(app.SESSION,middleware)
// app.mw(app.ROUTER,middleware)
// app.mw(app.VIEW,middleware)
app.use(convert(logger()))
app.use(convert(responseTime()))
//app.use(rewrite('/cebbank/*','/$1'))
app.use(convert(gzip()))
models.initialize(function(err, ontology){
	if(err){throw err}
	app.models=ontology.collections
	app.context.models=ontology.collections
	console.log('database adapter initialized connection')
})

/*
app.mw(slow({
    url: /\.do$/i,
    delay: 5000
}))
*/
app.use(router.routes())
//app.mw(livereload())
app.mw(convert(session(app)))
app.listen(4000,(err)=>{
	if(err) throw err;
	console.log("alien app is running!")
});
