import { MongoHelper } from '../helpers/mongo-helper'
describe('Account Mongo Repository', () => {
    beforeAll(async () => {
        await MongoHelper.connect('mongodb+srv://klayton:leandro11@cluster0.kvtap.mongodb.net/test')
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })
    test('Should Return an account on success ', async () => {
        const sut = new AccountMongoRepository()
        const account = await sut.add({
            name: 'any_name',
            email: 'any_email@mail.com',
            password: 'any_password'
        })
        expect(account).toBeTruthy()
        expect(account.id).toBeTruthy()
        expect(account).toBe('any_name')
        expect(account).toBe('any_email@mail.com')
        expect(account).toBe('any_password')
    })
})