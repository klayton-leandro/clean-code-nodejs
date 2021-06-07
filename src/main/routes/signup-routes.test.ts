import request from 'supertest'
import app from '../config/app'

describe('SignUp Routes', () => {
    test('Should return an account success ', async () => {
        await request(app)
            .post('/api/signup')
            .send({
                name: 'klayton',
                email: 'klayton@mail.com.br',
                password: '12345678',
                passwordConfirmation: '12345678'
            })
            .expect(200)
    })
})
