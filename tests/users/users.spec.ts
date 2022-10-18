import { test } from '@japa/runner'

test.group('User Tests', () => {
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
    assert.equal(response.body().user.password, userData.password)
  }).pin()
})
