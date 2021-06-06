import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
    client: MongoClient,

    async connect (url: string): Promise<void> {
        this.client = await MongoClient.connect('mongodb+srv://klayton:leandro11@cluster0.kvtap.mongodb.net/test', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    },

    async disconnect (): Promise<void>{
        await this.client.close()
    },

    getColletion (name: string): Collection{
        return this.client.db().collection(name)
    },

    map: (collection: any): any => {
        const { _id, ...collectionWithhoutId } = collection
        return Object.assign({}, collectionWithhoutId, { id: _id })
    }
}