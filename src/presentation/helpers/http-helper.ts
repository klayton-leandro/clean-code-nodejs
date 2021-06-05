
import { ServerError } from '../erros'

interface httpResponse {
    statusCode: number
    body: any
}

export const ok = (data: any): httpResponse => ({
    statusCode: 200,
    body: data
})


export const badRequest = (error: Error): httpResponse => ({
    statusCode: 400,
    body: error
})

export const serverError = (): httpResponse => ({
    statusCode: 500,
    body: new ServerError()
})