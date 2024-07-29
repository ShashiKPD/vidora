import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js"

dotenv.config({
  path: "./.env"
})

connectDB()
  .then(() => {
    app.on("error", (err) => {
      console.log("Error: ", err);
      throw err;
    })

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Server is listening on PORT: `, PORT)
    })
  })
  .catch((err) => {
    console.log(`MongoDB Connection Failed !!!`, err);
  })
