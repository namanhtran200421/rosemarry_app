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
        issueBaseUrl: getEnvironmentVariable('AUTH0_ISSUE_BASE_URL'),
    audience: getEnvironmentVariable('AUTH0_AUDIENCE')
},
}