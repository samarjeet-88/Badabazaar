const envConfig={
    port:process.env.PORT,
    db:{
        name:process.env.DATABASE_NAME,
        username:process.env.DATABASE_USERNAME,
        password:process.env.DATABASE_PASSWORD,
        port:process.env.DATABASE_PORT,
        host:process.env.DATABASE_HOST,
        connectionString:process.env.DATABASE_CONNECTION_STRING
    }
}

export default envConfig