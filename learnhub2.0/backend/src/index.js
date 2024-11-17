import dotenv from "dotenv"
import {amber ,connectDB} from "./db/index.js";
import {app} from './app.js'
dotenv.config({
    path: './.env'
})


connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on http://localhost:${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("Connection failed !!! ", err);
})

process.on('SIGINT', async () => {
    await amber.$disconnect();
    console.log('\n PostgreSQL connection closed.');
    process.exit(0);
  });