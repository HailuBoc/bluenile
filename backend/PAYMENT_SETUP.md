# Payment Integration Setup Guide

This guide will help you set up and test the payment integrations for Chapa, Telebirr, and M-Pesa.

## Environment Variables Setup

Create a `.env` file in the backend directory with the following variables:

```env
# Database
MONGO_URI=mongodb://localhost:27017/tutorapp

# Server Configuration
PORT=10000
SERVER_URL=http://localhost:10000
CLIENT_URL=http://localhost:3000

# Chapa Payment Gateway
CHAPA_SECRET_KEY=your_chapa_secret_key_here

# Telebirr Payment Gateway
TELEBIRR_MERCHANT_APP_ID=your_telebirr_merchant_app_id
TELEBIRR_FABRIC_APP_ID=your_telebirr_fabric_app_id
TELEBIRR_SHORT_CODE=your_telebirr_short_code
TELEBIRR_APP_SECRET=your_telebirr_app_secret
TELEBIRR_NOTIFY_URL=http://localhost:10000/bookings/pay/telebirr/verify
TELEBIRR_RETURN_URL=http://localhost:3000/bookings/success

# M-Pesa Payment Gateway
MPESA_CONSUMER_KEY=your_mpesa_consumer_key
MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
MPESA_PASSKEY=your_mpesa_passkey
MPESA_CALLBACK_URL=http://localhost:10000/bookings/pay/mpesa/verify

# JWT Secret
JWT_SECRET=your_jwt_secret_here
```

## Payment Gateway Setup

### 1. Chapa Setup
1. Register at [Chapa](https://chapa.co)
2. Get your secret key from the dashboard
3. Add it to `CHAPA_SECRET_KEY` in your `.env` file

### 2. Telebirr Setup
1. Register at [Telebirr Developer Portal](https://developer.telebirr.com)
2. Create an app and get your credentials:
   - Merchant App ID
   - App Secret
   - Short Code
3. Add them to your `.env` file

### 3. M-Pesa Setup
1. Register at [Safaricom Developer Portal](https://developer.safaricom.co.ke)
2. Create an app and get your credentials:
   - Consumer Key
   - Consumer Secret
   - Passkey
3. Add them to your `.env` file

## API Endpoints

### Initialize Payment
```
POST /bookings/pay/:method
```

**Parameters:**
- `method`: "chapa", "telebirr", or "mpesa"

**Body:**
```json
{
  "amount": 100,
  "email": "user@example.com",
  "fullName": "John Doe",
  "bookingId": "booking123",
  "phone": "254708374149" // Required for M-Pesa
}
```

**Response:**
```json
{
  "checkout_url": "https://checkout.url",
  "transaction_id": "TB-booking123-1234567890"
}
```

### Verify Payment
```
GET /bookings/pay/:method/verify/:bookingId?tx_ref=transaction_ref
POST /bookings/pay/:method/verify/:bookingId (for M-Pesa callbacks)
```

## Testing

### Test Chapa Payment
```bash
curl -X POST http://localhost:10000/bookings/pay/chapa \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "email": "test@example.com",
    "fullName": "Test User",
    "bookingId": "test123"
  }'
```

### Test Telebirr Payment
```bash
curl -X POST http://localhost:10000/bookings/pay/telebirr \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "fullName": "Test User",
    "bookingId": "test123"
  }'
```

### Test M-Pesa Payment
```bash
curl -X POST http://localhost:10000/bookings/pay/mpesa \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "fullName": "Test User",
    "bookingId": "test123",
    "phone": "254708374149"
  }'
```

## Important Notes

### M-Pesa Phone Number Format
- Use format: `254XXXXXXXXX` (e.g., `254708374149`)
- Remove the `+` sign
- Must be exactly 12 digits starting with `254`

### Telebirr
- The system tries both sandbox and production endpoints
- Check console logs for detailed error information
- Ensure all environment variables are properly set

### Chapa
- Uses ETB currency by default
- Requires email for payment processing
- Supports both sandbox and production environments

## Error Handling

The system includes comprehensive error handling:
- Environment variable validation
- Phone number format validation for M-Pesa
- API timeout handling (30 seconds)
- Detailed error logging
- Fallback mechanisms for Telebirr endpoints

## Callback URLs

Make sure your callback URLs are:
1. Publicly accessible (use ngrok for local testing)
2. Using HTTPS in production
3. Properly configured in your payment gateway dashboards

## Troubleshooting

### Common Issues:

1. **Telebirr not working:**
   - Check if all environment variables are set
   - Verify your credentials in the Telebirr dashboard
   - Check console logs for detailed error messages

2. **M-Pesa not working:**
   - Ensure phone number is in correct format (254XXXXXXXXX)
   - Verify your credentials are correct
   - Make sure callback URL is publicly accessible
   - Check if you're using sandbox credentials

3. **Chapa not working:**
   - Verify your secret key is correct
   - Check if email is provided
   - Ensure callback URLs are accessible

## Production Deployment

For production:
1. Use production credentials for all payment gateways
2. Ensure all URLs use HTTPS
3. Set up proper SSL certificates
4. Configure production callback URLs
5. Monitor logs for any issues

