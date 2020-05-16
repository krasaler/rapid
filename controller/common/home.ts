import {GET, Controller, POST} from '../../core/index.ts'
export class ControllerCommonHome extends Controller{
  @GET('/test')
  public async home() {
    this.$context.cache.set('test', {'1':'2'})
    this.$context.cache.get('test')
    await this.$context.load.model('common/home')
    const test = await this.$context.model_common_home.test()
    this.$context.response.setOutput({'test': test})
  }

  @GET('/test/:id')
  public home2() {
    this.$context.response.setOutput({'test': this.$context.request.params.id})
  }

  @POST('/test')
  public homePost() {
    console.log(this.$context.request.get)
    this.$context.response.setOutput(this.$context.request.post)
  }
}