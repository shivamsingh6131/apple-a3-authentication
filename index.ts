import { getAppleA3AuthToken } from "./apple-a3-auth";
import express from "express";

const app = express();

const APPLE_A3_REDIRECT_URI = "https://yourapp.com/auth/apple/callback";

// Example Express route for handling Apple A3 authentication
app.get("/auth/apple", async (req, res) => {
  const { code } = req.query;

  try {
    const token = await getAppleA3AuthToken(
      code,
      "your-client-id",
      "your-team-id",
      APPLE_A3_REDIRECT_URI,
      "your-private-key"
    );
  } catch (error) {
    console.log("error here", error);
  }
});
// Use the access token
