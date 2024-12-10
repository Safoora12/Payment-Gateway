// src/app/api/payment/route.js
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request) {
  const payload = await request.json();

  try {
    const response = await axios.post(
      "https://bankalfalah.gateway.mastercard.com/api/rest/version/84/merchant/ARTEMAMEDICA/session",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `merchant.ARTEMAMEDICA:5d245bae704ba8a34ee40ad35beac255`
          ).toString("base64")}`, // Basic Auth
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}
