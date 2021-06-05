interface httpResponse {
    statusCode: number
    body: any
}

export const badRequest = (error: Error): httpResponse => ({
    statusCode: 400,
    body: error
})