import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {
  public async createUser({ response }: HttpContextContract) {
    return response.created()
  }
}
