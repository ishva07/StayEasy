import express from "express"
import errorMiddleware from "./middleware/error.middleware";
import notFoundMiddleware from "./middleware/notFound.middleware";
import helmet from "helmet";
import env from "./config/env";
import cookieParser from "cookie-parser";
import route from "./routes";
import cors from "cors"
const app = express()

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}))

app.use(cookieParser(env.COOKIE_PARSER))

app.use("/api/v1",route);
app.use("/uploads", express.static("uploads"));
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;