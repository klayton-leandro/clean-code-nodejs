import request from 'supertest'
import app from '../config/app'

describe('Content Type Middleware', () => {
    test('Should return default content type as JSON ', async () => {
        app.get('test_content_type', (req, res) => {
            res.type('js')
            res.send('')
        })
        await request(app)
            .get('/test_content_type')
            .expect('content-type', /json/)
    })
    test('Should return xml content type when forced ', async () => {
        app.get('test_content_type_xml', (req, res) => {
            res.type('xml')
            res.send('')
        })
        await request(app)
            .get('/test_content_type')
            .expect('content-type', /xml/)
    })
})
