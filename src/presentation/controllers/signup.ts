import { HttpRequest } from '../protocols/http'
import { MissingParamError } from '../erros/missing-param-error'
import { badRequest } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'

export class SignUpController implements Controller {
    handle (httpRequest: HttpRequest): any{
        const requiredFields = ['name', 'email', 'password', 'password_confirmation']
        for (const field of requiredFields){
            if(!httpRequest.body[field]){
                return badRequest(new MissingParamError(field))
            }
        }
    }
}