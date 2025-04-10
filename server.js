import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieSession from "cookie-session";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import { invoicesRoutes } from "./routes/invoicesRoutes.js";
import { invoiceItemsRoutes } from "./routes/invoiceItemsRoutes.js";
import { lessonsRoutes } from "./routes/lessonsRoutes.js";
import { usersRoutes } from "./routes/usersRoutes.js";
import { authsRoutes } from "./routes/authsRoutes.js";
import { coursesRoutes } from "./routes/coursesRoutes.js";
import { cartsRoutes } from "./routes/cartsRouter.js";
import { commentsRoutes } from "./routes/commentsRoutes.js";
import { reviewsRoutes } from "./routes/reviewsRoutes.js";
import { documentsRoutes } from "./routes/documentsRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//intialize express app.
const app = express();

// This configures the session middleware.
// Sessions are stored in cookies with a session name (session), a secret key (key1),
// and an expiration time of 24 hours.
app.use(
  cookieSession({
    name: "session",
    keys: ["key1"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

// The CORS middleware is set up here. It allows requests from
//  process.env.CLIENT_URL (client-side URL defined in environment variables), 
// enables specific HTTP methods, and allows sending credentials (such as cookies).
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    method: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// This middleware allows the server to parse incoming JSON request bodies, with a size limit of 200MB.
app.use(express.json({ limit: "200mb" }));

// These lines define API endpoints.
//  When a request is made to /api/users, /api/courses, or /api/carts, 
//  the corresponding route handler (usersRoutes, coursesRoutes, or cartsRoutes) handles it.
app.use("/api/users", usersRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/carts", cartsRoutes);
app.use("/api/lessons", lessonsRoutes);
app.use("/api/documents", documentsRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/invoices", invoicesRoutes);
app.use("/api/invoiceItems", invoiceItemsRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/auth", authsRoutes);

app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/client/dist/index.html"))
);

// Enter DB URL
mongoose
  .connect('')
  .then(() => {
    console.log("Connected to the database");

app.listen(process.env.PORT, () => {
      console.log("Listening on port 5000");
  });
})
.catch((error) => {
    console.log("Error connecting to the database: ", error);
});
