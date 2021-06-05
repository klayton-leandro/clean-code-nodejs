import { HttpRequest } from '../protocols/http'
import { MissingParamError } from '../erros/missing-param-error'
import { InvalidParamError } from '../erros/invalid-param-error'
import { badRequest } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'
import { ServerError } from '../erros/server-error'
import { EmailValidator } from '../protocols/email-validate'

export class SignUpController implements Controller {
    private readonly emailValidator: EmailValidator

    constructor (emailValidator: EmailValidator){
        this.emailValidator = emailValidator
    }

    handle (httpRequest: HttpRequest): any{
        try{
        const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
        for (const field of requiredFields){
            if(!httpRequest.body[field]){
                return badRequest(new MissingParamError(field))
            }
        }
        const isValid = this.emailValidator.isValid(httpRequest.body.email)
        if(!isValid){
            return badRequest(new InvalidParamError('email'))
        }
        }catch(error){
            return {
                statusCode: 500,
                body: new ServerError()
            }
        }
    }
}