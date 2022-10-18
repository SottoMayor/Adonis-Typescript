import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
  public async createUser({ request, response }: HttpContextContract) {
    const userData = request.only(['username', 'password', 'email', 'avatar'])

    const existingEmail = await User.findBy('email', userData.email)
    if (existingEmail) {
      return response.conflict({ message: 'Email already in use. Please pick a different one.' })
    }

    const existingUsername = await User.findBy('username', userData.username)
    if (existingUsername) {
      return response.conflict({ message: 'Username already in use. Please pick a different one.' })
    }

    const newUser = await User.create(userData)
    const savedUser = await newUser.save()

    return response.created({ message: 'User created successfully!', user: savedUser })
  }
}
