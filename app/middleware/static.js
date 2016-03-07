import {static as staticDir} from 'express'

let staticPath=process.env.npm_package_config_middleware_static_path
export default staticDir(staticPath)
