import dotenv from 'dotenv'

dotenv.config()
const envVars = process.env

export const port = process.env.PORT || 4000

export const environment = envVars.NODE_ENV || 'development'
export const isDev = environment === 'development'
