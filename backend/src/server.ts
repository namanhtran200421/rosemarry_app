import dotenv from 'dotenv'
import app from "./app.js"

dotenv.config();

const PORT = process.env.PORT;

app.listen(PORT, function(err:unknown){
  if(!err){
    console.log(`Server on ${PORT}`)
  } else {
    console.log("error", err)
  }
})

