import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import compression from 'compression'
import httpStatus from 'http-status'
import router from './router.js'
import { isDev } from './config.js'
import ApiError from './utils/ApiError.js'

import { errorHandler, errorConverter } from './middlewares/error.js'

const app = express()

app.set('trust proxy', 1)

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
    ],
    credentials: true
  })
)

// limit amount of requests per minute to avoid DDoS
app.use(
  rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: isDev ? 99999 : 150, // Limit each IP to 100 requests per `window` (here, per 10 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false // Disable the `X-RateLimit-*` headers
  })
)

app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api', router)

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'))
})

app.use(errorConverter)
app.use(errorHandler)

export default app