import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'
export class AccountMongoRepository implements AddAccountRepository{
    async add (accountData: AddAccountModel): Promise<AccountModel> {
        const accountCollection = MongoHelper.getColletion('accounts')
        const result = await accountCollection.insertOne(accountData)
        const account = result.ops[0]
        const { _id, ...accountWithhoutId } = account
        return Object.assign({}, accountWithhoutId, { id: _id })
    }
}