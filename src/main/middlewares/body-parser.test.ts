import request from 'supertest'
import app from '../config/app'

describe('Body parser Middleware', () => {
    test('Should Parse body as JSON', async () => {
        const body = {
            name: 'klayton'
        }
        app.post('test_body_parser', (req, res, next) => {
            res.send(body)
            next()
        })
        await request(app)
            .post('/test_body_parser')
            .send(body)
            .expect(body)
    })
})
