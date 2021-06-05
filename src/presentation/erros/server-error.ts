export class ServerError extends Error {
    constructor (){
        super(`Internel server error`)
        this.name = 'ServerError'
    }
}