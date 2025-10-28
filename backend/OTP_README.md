OTP system setup and testing

1) Install dependencies

Open PowerShell in backend folder and run:

npm install

(this will install nodemailer and twilio which were added to package.json)

2) Environment variables (.env)

Copy `.env.example` to `.env` and fill in values. At minimum, set:

- MONGO_URI
- JWT_SECRET
- SMTP_USER and SMTP_PASS (if you want email delivery)

For phone SMS, configure Twilio credentials: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM.

3) Start backend

npm run dev

4) Test endpoints

Request OTP (email):
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/request-otp" -Method POST -Body '{"identifier":"user@example.com"}' -ContentType "application/json"

Request OTP (phone +91):
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/request-otp" -Method POST -Body '{"identifier":"+919876543210"}' -ContentType "application/json"

Verify OTP:
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/verify-otp" -Method POST -Body '{"identifier":"user@example.com","code":"123456"}' -ContentType "application/json"

Notes:
- If SMTP/Twilio are not configured the OTP will still be created, but will be logged to the server console for development testing.
- Rate limiting is applied to the request-otp endpoint (5 requests per 15 minutes per IP).

