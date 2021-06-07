import request from 'supertest'
import app from '../config/app'

describe('Body parser Middleware', () => {
    test('Should Parse body as JSON', async () => {
        app.post('test_body_parser', (req, res) => {
            res.json({
                name: 'klayton'
            })
        })
        await request(app)
            .post('/test_body_parser')
            .send({ name: 'klayton' })
            .expect({ name: 'klayton' })
    })
})
