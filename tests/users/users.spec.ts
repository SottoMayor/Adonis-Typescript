import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'

test.group('User Tests', (group) => {

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return await Database.rollbackGlobalTransaction()
  })

  test('It should create an user', async ({ client, assert }) => {
    const userData = {
      username: 'John Doe',
      email: 'john_doe@test.com',
      password: 'test123',
      avatar: 'https://test.com/images/1',
    }

    const response = await client.post('/users').json(userData)

    response.assertStatus(201)

    assert.exists(response.body().user, 'User undefined')
    assert.exists(response.body().user.id, 'User ID undefined')
    assert.equal(response.body().user.email, userData.email)
    assert.equal(response.body().user.username, userData.username)
    assert.equal(response.body().user.avatar, userData.avatar)
    assert.notExists(response.body().user.password, 'User PASSWORD defined')
  })

  test('It throws an error when the email is already in use', async ({ client }) => {
    const { email } = await UserFactory.create()

    const userData = {
      username: 'John Doe',
      email: email,
      password: 'test123',
      avatar: 'https://test.com/images/1',
    }

    const response = await client.post('/users').json(userData)

    response.assertStatus(409)
  }).pin()
})
