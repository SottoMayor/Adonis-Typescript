import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'

test.group('Users password', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return await Database.rollbackGlobalTransaction()
  })

  test('It should send an email with password reset instructions, when the password is forgotten', async ({
    client,
  }) => {
    const { email } = await UserFactory.create()

    const response = await client
      .post('/forgot-password')
      .json({ email, resetedPasswordUrl: 'url.com' })

    response.assertStatus(204)
  }).pin()
})
