import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './database/db.js'
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import jazzcashRoutes from './routes/jazzcashRoutes.js'
import { sendOTPEmail } from './utils/emailService.js'

import { fileURLToPath } from 'url'
import path from 'path'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load env from backened/.env (safe default for local dev)
dotenv.config({ path: process.env.DOTENV_PATH || path.join(__dirname, '.env') })


// Log JazzCash config (debug)
console.log('JAZZCASH_MERCHANT_ID:', process.env.JAZZCASH_MERCHANT_ID || 'NOT SET')
console.log('MAIL_USER:', process.env.MAIL_USER || 'NOT SET')
console.log('MAIL_PASS:', process.env.MAIL_PASS ? 'SET' : 'NOT SET')

console.log('=== SERVER STARTING ===')
console.log('PORT:', process.env.PORT || 3000)

const app = express()
const port = process.env.PORT ? Number(process.env.PORT) : 3000

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cors())

// Test endpoint to send OTP email
app.get('/test-email', async (req, res) => {
    console.log('=== TEST EMAIL ENDPOINT CALLED ===')
    try {
        const testOTP = '12345'
        const testEmail = 'test@example.com'
        
        console.log('Sending test email to:', testEmail)
        console.log('OTP:', testOTP)
        
        await sendOTPEmail(testEmail, testOTP, 'verification')
        
        res.json({ success: true, message: 'Test email sent!' })
    } catch (error) {
        console.log('Test email error:', error.message)
        res.status(500).json({ success: false, error: error.message })
    }
})

// application routes
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/products', productRoutes)
app.use('/api/v1/admin', adminRoutes)
app.use('/api/v1/orders', orderRoutes)
app.use('/api/v1/orders/jazzcash', jazzcashRoutes)

// Debug: show mounted endpoints
console.log('[ROUTES] /api/v1/orders mounted from backened/routes/orderRoutes.js');
console.log('[ROUTES] /api/v1/orders/jazzcash mounted from backened/routes/jazzcashRoutes.js');
console.log('[ROUTES DEBUG] Expect:');
console.log('  POST /api/v1/orders/jazzcash/initiate-jazzcash');
console.log('  POST /api/v1/orders/jazzcash/callback');


app.get('/', (req, res) => {
  res.send('Hello World! Server is running!')
})

// Catch-all 404 handler to surface the exact path being requested
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Not Found',
    path: req.originalUrl,
    method: req.method
  });
});

connectDB()

  .then(() => {
    console.log('Database connected!')
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`)
      console.log(`Test at: http://localhost:${port}/test-email`)
    })
  })
  .catch(err => {
    console.error('Failed to start server:', err)
    app.listen(port, () => {
      console.log(`Server listening on port ${port} (without database)`)
    })
  })

