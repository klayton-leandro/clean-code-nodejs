import { SignUpController } from './signup'
import { MissingParamError, InvalidParamError, ServerError } from '../../erros'
import { EmailValidator, AccountModel, AddAccount, AddAccountModel } from './signup-protocols'
const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator{
        isValid (email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub()
}

interface SutTypes {
    sut: SignUpController
    emailValidatorStub: EmailValidator
    addAccount: AddAccount
}

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator()
    const addAccount = makAddAccount()
    const sut = new SignUpController(emailValidatorStub, addAccount)
    return {
        sut,
        emailValidatorStub,
        addAccount
    }
}

const makAddAccount = (): AddAccount => {
    class AddAccountStub implements AddAccount{
        add (account: AddAccountModel): AccountModel {
            const fakeAccount = {
                id: "valid_id",
                name: "valid_name",
                email: "valid_email@mail.com",
                password: "valid_password"
            }
            return fakeAccount
        }
    }
    return new AddAccountStub()
}

describe('SingUp Controller', () => {
    test('Should return 400 if no name is provided', () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                email: "any_email@email.com",
                password: "any_password",
                passwordConfirmation: "any_password"
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('name'))
    })

    test('Should return 400 if no email is provided', () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: "any_name",
                password: "any_password",
                passwordConfirmation: "any_password"
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('email'))
    })

    test('Should return 400 if no password is provided', () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: "any_name",
                email: "any_email@email.com",
                passwordConfirmation: "any_password"
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('password'))
    })

    test('Should return 400 if no passwordConfirmation is provided', () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: "any_name",
                email: "any_email@email.com",
                password: "any_password"
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
    })

    test('Should return 400 if passwordConfirmation fails', () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: "any_name",
                email: "any_email@email.com",
                password: "any_password",
                passwordConfirmation: 'invalid_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
    })

    test('Should return 400 if an invalid is email provided', () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const httpRequest = {
            body: {
                name: "any_name",
                email: "invalid_email@mail.com",
                password: "any_password",
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('email'))
    })

    test('Should call EmailValidation with correct', () => {
        const { sut, emailValidatorStub } = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
        const httpRequest = {
            body: {
                name: "any_name",
                email: "invalid_email@mail.com",
                password: "any_password",
                passwordConfirmation: 'any_password'
            }
        }
        sut.handle(httpRequest)
        expect(isValidSpy).toHaveBeenCalledWith('invalid_email@mail.com')
    })

    test('Should return 500 if email validate throws', () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error()
        })
        const httpRequest = {
            body: {
                name: "any_name",
                email: "any_email@mail.com",
                password: "any_password",
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })

    test('Should call AddAccount with correct  values', () => {
        const { sut, addAccount} = makeSut()
        const addSpy = jest.spyOn(addAccount, 'add')
        const httpRequest = {
            body: {
                name: "any_name",
                email: "any_email@mail.com",
                password: "any_password",
                passwordConfirmation: 'any_password'
            }
        }
        sut.handle(httpRequest)
        expect(addSpy).toHaveBeenCalledWith({
            name: "any_name",
            email: "any_email@mail.com",
            password: "any_password"
        })
    })

    test('Should return 500 if AddAccount throws', () => {
        const { sut, addAccount} = makeSut()
        jest.spyOn(addAccount, 'add').mockImplementationOnce(() => {
            throw new Error()
        })
        const httpRequest = {
            body: {
                name: "any_name",
                email: "any_email@mail.com",
                password: "any_password",
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })

    test('Should return 200 if  valid data is provided', () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: "valid_name",
                email: "valid@mail.com",
                password: "valid_password",
                passwordConfirmation: 'valid_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(200)
        expect(httpResponse.body).toEqual({
            id: 'valid_id',
            name: "valid_name",
            email: "valid_email@mail.com",
            password: "valid_password"
        })
    })
})