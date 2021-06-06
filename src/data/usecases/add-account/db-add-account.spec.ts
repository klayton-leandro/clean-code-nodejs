import { DbAddAccount } from './db-add-account'
import { Encrypter, AddAccountModel, AccountModel, AddAccountRepository } from './db-add-account-protocols'

const makeAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        async add (accountData: AddAccountModel): Promise<AccountModel> {
            const fakeAccount = {
                id: 'valid_id',
                name: 'valid_name',
                email: 'valid_email',
                password: 'hashed_password'
            }
            return new Promise((resolve) => resolve(fakeAccount))
        }
    }
    return new AddAccountRepositoryStub()
}
const makeEncrypter = (): Encrypter => {
    class EncrypteStub implements Encrypter {
        async encrypt (value: string): Promise<string> {
            return new Promise<string>((resolve) => resolve('hashed_password'))
        }
    }
    return new EncrypteStub()
}

interface SutTypes {
    sut: DbAddAccount
    encrypterStub: Encrypter
    AddAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypter()
    const AddAccountRepositoryStub = makeAddAccountRepository()
    const sut = new DbAddAccount(encrypterStub, AddAccountRepositoryStub)
    return {
        sut,
        encrypterStub,
        AddAccountRepositoryStub
    }
}

describe('DbAddAccount Usecase', () => {
    test('Should call Encrypter with correct password', async () => {
        const { sut, encrypterStub } = makeSut()
        const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt')
        const accountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password'
        }
        await sut.add(accountData)
        expect(encrypterSpy).toHaveBeenCalledWith('valid_password')
    })
    test('Should throw if Encrypter throws', async () => {
        const { sut, encrypterStub } = makeSut()
        jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(
                new Promise((resolve, reject) => reject(new Error())
            ))
        const accountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password'
        }
        const promise = sut.add(accountData)
        await expect(promise).rejects.toThrow()
    })

    test('Should call AddAccountRepository with correct values', async () => {
        const { sut, AddAccountRepositoryStub } = makeSut()
        const addSpy = jest.spyOn(AddAccountRepositoryStub, 'add')
        const accountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password'
        }
        await sut.add(accountData)
        expect(addSpy).toHaveBeenCalledWith({
            name: 'valid_name',
            email: 'valid_email',
            password: 'hashed_password'
        })
    })

    test('Should throw if Encrypter throws', async () => {
        const { sut, AddAccountRepositoryStub } = makeSut()
        jest.spyOn(AddAccountRepositoryStub, 'add').mockReturnValueOnce(
                new Promise((resolve, reject) => reject(new Error())
            ))
        const accountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password'
        }
        const promise = sut.add(accountData)
        await expect(promise).rejects.toThrow()
    })

    test('Should call return an account on sucess', async () => {
        const { sut } = makeSut()
        const accountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password'
        }
        const account = await sut.add(accountData)
        expect(account).toEqual({
            id: 'valid_id',
            name: 'valid_name',
            email: 'valid_email',
            password: 'hashed_password'
        })
    })
})