import express from "express"
import type {Request, Response} from "express"
import pool from "./config/database"
import cors from "cors"
import { errorHandler, notFound } from "./middleware/errorHandler";

const app = express();
app.use(cors());
app.use(express.json());

/**
 * 
 * 
 */
app.get('/health', async function(req:Request, res:Response){
  try {
    const result = await pool.query('select now() as current_time');
    return res.status(200).json({
      message: "Server and database is running",
      // this is to report health check for database current up time
      database_time: result.rows[0].current_time 
    });
  }catch (err:unknown){
    return res.status(500).json({
      message: "database connection failed"
    });
  }
})

app.use(notFound)
app.use(errorHandler)

export default app;