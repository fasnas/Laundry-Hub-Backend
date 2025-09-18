import express from "express"
import dotenv from "dotenv";
import dbConnct from "./Src/config/dbConnect.js";
import authRouter from "./Src/routes/authroutes.js";
import serviceRouter from "./Src/routes/serviceroutes.js";
import cors from "cors"
import laundryRouter from "./Src/routes/laundryRoutes.js";
import userRouter from "./Src/routes/userRoutes.js";
import cartRouter from "./Src/routes/cartroute.js";
import addressRouter from "./Src/routes/adressRoute.js";
import PaymentRouter from "./Src/routes/paymentRouter.js";


const app = express();
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT;
dbConnct()
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));

app.use("/api",authRouter)
app.use("/api",serviceRouter)
app.use("/api",laundryRouter)
app.use("/api",userRouter)
app.use("/api",cartRouter)
app.use("/api",addressRouter)
app.use("/api",PaymentRouter)

app.listen(PORT, () => {
  console.log("server working succesfully");
});
