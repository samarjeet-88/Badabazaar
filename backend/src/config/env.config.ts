import "dotenv/config";

const envConfig = {
    port: process.env.PORT,
    db: {
        name: process.env.DATABASE_NAME,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        port: process.env.DATABASE_PORT,
        host: process.env.DATABASE_HOST,
        connectionString: process.env.DATABASE_CONNECTION_STRING
    },
    email: {
        username: process.env.EMAIL_USERNAME,
        password: process.env.EMAIL_PASSWORD
    },
    twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        phoneNumber: process.env.TWILIO_PHONE_NUMBER
    },
    redis: {
        redisUrl: process.env.REDIS_URL
    },
    url: {
        baseUrl: process.env.BASE_URL
    },
    jwt:{
        accessSecretKey:process.env.ACCESS_JWT_SECRET,
        refreshSecretKey:process.env.REFRESH_JWT_SECRET
    }
}
export default envConfig