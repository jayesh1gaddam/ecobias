# Perfume Ecommerce with Razorpay Integration

## Setup Instructions

### 1. Razorpay Account Setup

1. **Create Razorpay Account**: Go to [https://razorpay.com](https://razorpay.com) and create an account
2. **Get API Keys**: 
   - Go to Settings > API Keys
   - Generate Test/Live API Keys
   - Copy Key ID and Key Secret

### 2. Environment Variables

Create a `.env.local` file in your project root:

\`\`\`env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Public Keys (accessible in browser)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
\`\`\`

### 3. Webhook Configuration

1. **Go to Razorpay Dashboard** > Settings > Webhooks
2. **Add Webhook URL**: `https://yourdomain.com/api/razorpay/webhook`
3. **Select Events**:
   - payment.captured
   - payment.failed
   - order.paid
4. **Generate Webhook Secret** and add to `.env.local`

### 4. Install Dependencies

\`\`\`bash
npm install razorpay
\`\`\`

### 5. Test Payment Flow

#### Test Cards for Razorpay:
- **Success**: 4111 1111 1111 1111
- **Failure**: 4000 0000 0000 0002
- **CVV**: Any 3 digits
- **Expiry**: Any future date

## API Endpoints

### POST /api/razorpay/create-order
Creates a new Razorpay order

**Request Body:**
\`\`\`json
{
  "amount": 29900,
  "currency": "INR",
  "receipt": "receipt_123",
  "notes": {
    "description": "Premium Membership"
  }
}
\`\`\`

### POST /api/razorpay/verify-payment
Verifies payment signature and processes order

**Request Body:**
\`\`\`json
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx",
  "user_id": "user_123",
  "order_type": "membership",
  "order_details": {}
}
\`\`\`

### POST /api/razorpay/webhook
Handles Razorpay webhooks for payment events

## Features

- ✅ **Complete Payment Flow**: Order creation → Payment → Verification
- ✅ **Webhook Integration**: Real-time payment status updates
- ✅ **Security**: Payment signature verification
- ✅ **Error Handling**: Comprehensive error management
- ✅ **Order Processing**: Membership and product order handling
- ✅ **Test Mode**: Easy testing with Razorpay test cards

## Payment Flow

1. **User initiates payment** (membership/order)
2. **Frontend calls** `/api/razorpay/create-order`
3. **Razorpay order created** with amount and details
4. **Razorpay checkout opens** with order details
5. **User completes payment** on Razorpay
6. **Payment response** sent to frontend handler
7. **Frontend calls** `/api/razorpay/verify-payment`
8. **Server verifies** payment signature
9. **Order processed** and user updated
10. **Webhook confirms** payment status (optional)

## Security Features

- **Signature Verification**: All payments verified server-side
- **Environment Variables**: Sensitive keys stored securely
- **Webhook Validation**: Webhook signatures verified
- **Error Handling**: Graceful failure management
