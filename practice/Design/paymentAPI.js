// Design a payment transaction processing system
// Design a fleet card authorization system
// Design a fraud detection system for card transactions
// Design a ledger system for balances and settlements
// Design a reimbursement/expense management platform
// Design a recurring billing/invoicing system
// Design a real-time notifications system for payment events
// Design a reconciliation system between internal records and bank/partner files
// Design a merchant transaction reporting dashboard
// Design a rate-limiting and risk-control system for APIs

// POST /v1/payments/create-session

// import { timeStamp } from "node:console";

const merchantPayload = {
  merchantId: "merchant_001",
  merchantOrderId: "order_123",
  amount: 5000,
  currency: "USD",
  customerId: "cust_001",
  returnUrl: "https://merchant.com/payment/return",
  webhookUrl: "https://merchant.com/webhooks/payment",
};

//PSP reponse

const response = {
  sessionId: "234",
  publishable_key: "xhea90",
  expiresAt: "timeStamp",
  status: "CREATED",
  amount: 500,
};

// await stripe.load({ sessionId: response.sessionId, publishable_key });
// load and open the options of type of payments

// Card Payments

// POST /v1/payments/tokinize;
const cardPayload = {
  sessionId: "234",
  card: {
    number: "4111111111",
    expiry: "11/12",
    cvv: "123",
    name: "Ashish",
  },
};

const response = {
  sessionId: "234",
  payment_token: "pm_4920",
  last: "1111",
  status: "CONFIRMED",
};

// POST /v1/payments/authorise. --> user submits for final payment

const authPayload = {
  sessionId: "234",
  payment_token: "pm_4920",
};

const response = {
  sessionId: 234,
  paymentId: "568",
  status: "SUCCESS",
};

// POST /v1/payments/refund

const refund = {
  paymentId: 342,
  reason: "failed but not recovered",
};

const response = {
  paymentId: 342,
  refundId: 1234,
  status: "IN_PROGRESS",
  message: "getting confirmation from the bank",
};

// GET /v1/payments/refund/{refundId}

const response = {
  paymentId: 342,
  refundId: 1234,
  status: "IN_PROGRESS",
  message: "getting confirmation from the bank",
};
