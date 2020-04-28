import logger from 'koa-logger'
import convert from 'koa-convert'
import responseTime from 'koa-response-time'
import cors from 'koa-cors'
import gzip from 'koa-gzip'
import body from 'koa-body'
import session from 'koa-session'
import Alien from 'koa'
//import Alien from './alien'
import router from './router'
import {initialize} from './models'
import bodyParser from 'koa-bodyparser'

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
app.use(convert(cors()))
//app.use(convert(body({ multipart: true })))
app.use(convert(bodyParser()))
const orm =initialize(function(err, ontology){
	// console.log("initial")
	if(err){throw err}
})
app.context.db = orm.collections
// console.log(app.context.db)
app.use(router.routes())
//app.mw(livereload())
app.use(convert(session(app)))
export default app
