import { test } from '@japa/runner'

test.group('User Tests', () => {
  test('It should create an user', async ({ client }) => {
    const userData = { name: 'John Doe', email: 'john_doe@test.com', password: 'test123' }

    const response = await client.post('/users').json(userData)

    response.assertStatus(201)
  })
})
