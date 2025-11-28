const { default: mongoose } = require("mongoose")


const connectionMongoDB = async (app) => {

    try {
        await mongoose.connect(process.env.MONGODB_URL)
            .then((res) => {

                console.log("connecation has been successfully!")
                app.listen(process.env.PORT, () => console.log(`Dolphin app listening on port ${process.env.PORT}!`))
            })
            .catch((err) => {
                console.log(err)
                process.exit(1);
            })
    }
    catch (error) {
        console.log(error)
        process.exit(1);
    }
}

module.exports = connectionMongoDB