import Alien from '../alien'
import favicon from './favicon'
import staticDir from './static'


function middleware(httpServer){
	httpServer.use(favicon);
	httpServer.use(staticDir);
}


export default middleware
