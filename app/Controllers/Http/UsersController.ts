import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import User from 'App/Models/User'

export default class UsersController {
  public async createUser({ request, response }: HttpContextContract) {
    const userData = request.only(['username', 'password', 'email', 'avatar'])

    const existingEmail = await User.findBy('email', userData.email)
    if (existingEmail) {
      throw new BadRequestException('Email already in use. Please pick a different one.', 409)
    }

    const existingUsername = await User.findBy('username', userData.username)
    if (existingUsername) {
      throw new BadRequestException('Username already in use. Please pick a different one.', 409)
    }

    const newUser = await User.create(userData)
    const savedUser = await newUser.save()

    return response.created({ message: 'User created successfully!', user: savedUser })
  }
}
