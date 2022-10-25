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
  })

  test('It throws an error when the username is already in use', async ({ client }) => {
    const { username } = await UserFactory.create()

    const userData = {
      username: username,
      email: 'test@test.com',
      password: 'test123',
      avatar: 'https://test.com/images/1',
    }

    const response = await client.post('/users').json(userData)

    response.assertStatus(409)
  })

  test('It throws an error 422 if the username, email or password in not provided', async ({
    client,
  }) => {
    const response = await client.post('/users').json({})

    response.assertStatus(422)
  })

  test('It throws an error 422 if the email is invalid', async ({ client }) => {
    const userData = await UserFactory.create()
    const response = await client.post('/users').json({ ...userData, email: 'test' })

    response.assertStatus(422)
  })

  test('It throws an error 422 if the password is less then 5', async ({ client }) => {
    const userData = await UserFactory.create()
    const response = await client.post('/users').json({ ...userData, password: '1234' })

    response.assertStatus(422)
  })

  test('It throws an error 422 if the password is greater then 100', async ({ client }) => {
    const userData = await UserFactory.create()
    const response = await client.post('/users').json({
      ...userData,
      password:
        '12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901',
    })

    response.assertStatus(422)
  })

  test('It updates an user', async ({ client, assert }) => {
    const user = await UserFactory.create()

    const updatedUser = {
      ...user,
      email: 'test@example.com',
      avatar: 'https://test.com/1',
    }

    const response = await client.patch('/users/' + user.id).json(updatedUser)

    response.assertStatus(200)

    assert.equal(response.body().user.email, updatedUser.email)
    assert.equal(response.body().user.avatar, updatedUser.avatar)
  }).pin()
})
