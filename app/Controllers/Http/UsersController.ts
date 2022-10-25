import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import User from 'App/Models/User'
import CreateUserValidator from 'App/Validators/CreateUserValidator'

export default class UsersController {
  public async createUser({ request, response }: HttpContextContract) {
    // const userData = request.only(['username', 'password', 'email', 'avatar'])
    const userData = await request.validate(CreateUserValidator)

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

  public async updateUser({ request, response }: HttpContextContract) {
    const { email, password, avatar } = request.only(['email', 'password', 'avatar'])
    const userId = request.param('id')

    // Throw an error if the user not exists
    const user = await User.findOrFail(userId)

    user.email = email
    user.password = password
    if (user.avatar) {
      user.avatar = avatar
    }

    await user.save()

    return response.ok({ message: 'The user has been successfully updated', user })
  }
}
