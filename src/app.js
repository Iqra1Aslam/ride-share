import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
const app = express()

app.use(express.json())
// app.use(bodyParser.json())
app.use(cors(
    {origin: ['http://localhost:5173/', 'http://localhost:3000/']}
))

// app.use(cors())

import { userRouter } from './routes/user.routes.js'
import { authRouter } from './routes/auth.routes.js'
import { driverRouter } from './routes/driver.route.js'
import {vehicleRouter} from './routes/vehicle.route.js'
// import { rideRouter } from './routes/ride.route.js'

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/driver',driverRouter)
app.use('/api/v1/vehicle',vehicleRouter)
// app.use('api/v1/ride',rideRouter)
export { app }