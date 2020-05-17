import Loader from '../engine/loader.ts'
import Cache from '../library/cache.ts'
import Config from '../library/config.ts'
import Error from '../library/error.ts'
import Language from '../library/language.ts'
import Log from '../library/log.ts'
import Request from '../library/request.ts'
import Response from '../library/response.ts'
import Pagination from '../library/pagination.ts'
import Crypto from '../library/crypto.ts'
import Mail from '../library/mail.ts'

export declare class Registry {
  constructor(data?: any)
  get(name: string): any
  getAll(): any
  set(name: string, value: any): void
  has(name: string): boolean
}

export declare interface Context {
  // axios: AxiosInstance
  /**
   * For work with styles, links and scripts
   */
  // document: Document
  /**
   * For load controllers, models, views. configs and languages
   */
  load: Loader
  /**
   * Class to work with cache
   */
  cache: Cache
  /**
   * Class for getting and setting configs
   */
  config: Config
  /**
   * Class for provides cryptographic functionality
   */
  crypto: Crypto
  /**
   * Class for working with errors
   */
  error: Error
  /**
   * Class for processing received files
   */
  // file: File
  /**
   * Class for working with images
   */
  // image: Image
  /**
   * Class for receiving translations
   */
  language: Language
  /**
   * Class to work with logs
   */
  log: Log
  /**
   * Class for sending mail through the package "nodemailer"
   */
  mail: Mail
  /**
   * Class for creating pagination from the list of item
   */
  pagination: Pagination<any>
  /**
   * Class for retrieving request data
   */
  request: Request
  /**
   * Class for setting data for response
   */
  response: Response
  /**
   * Class to work with styles
   */
  // style: Style
  [x: string]: any
}