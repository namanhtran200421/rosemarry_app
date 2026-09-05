import 'dotenv/config'

function getEnvironmentVariable (name:string): string {
    const value = process.env[name];

    if(!value){
        throw new Error("Missing required env")
    }
    return value;
}

export const env = {
    port: Number(process.env.PORT),
    auth0: {
        issuerBaseUrl: getEnvironmentVariable('AUTH0_ISSUER_BASE_URL'),
    audience: getEnvironmentVariable('AUTH0_AUDIENCE')
},
}