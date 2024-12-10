"use client";

import { useState } from "react";
import axios from "axios"; // Import Axios

export default function Home() {
  const [currency, setCurrency] = useState("USD");
  const [amount, setAmount] = useState(10);
  const [description, setDescription] = useState("");
  const [paymentLink, setPaymentLink] = useState("");
  const [loading, setLoading] = useState(false);

  // Generate random order ID function
  const generateOrderId = () => {
    return "ORD" + Math.floor(Math.random() * 1000000);
  };

  // Handle form submission

  const handleGenerateLink = async () => {
    setLoading(true);

    // Calculate expiry date (7 days from now)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7); // Add 7 days
    const expiryDateTime = expiryDate.toISOString(); // Convert to ISO string

    const order = {
      currency,
      amount,
      id: generateOrderId(),
      description,
    };

    const payload = {
      apiOperation: "INITIATE_CHECKOUT",
      checkoutMode: "PAYMENT_LINK",
      interaction: {
        operation: "PURCHASE",
        merchant: {
          name: "ARTEMAMEDICA",
          url: "https://artemamed.com/",
        },
      },
      order,
      paymentLink: {
        expiryDateTime, // Use dynamically calculated expiry time
        numberOfAllowedAttempts: "7",
      },
    };

    try {
      const response = await axios.post("/api/payment", payload);
      console.log("Response:", response.data);

      if (response.data.paymentLink && response.data.paymentLink.url) {
        setPaymentLink(response.data.paymentLink.url);
      }
    } catch (error) {
      console.error("Error:", error);
    }

    setLoading(false);
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100"

    >
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4">
          Payment Link Generator
        </h1>

        {/* Form */}
        <div className="space-y-4"
        >
          <div>
            <label className="block text-gray-700">Currency</label>
            <input
              type="text"
              value="USD" // Hardcoded to USD
              readOnly // Makes the input field read-only
              className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed" // Styling for read-only look
              placeholder="Currency"
            />
          </div>


          <div>
            <label className="block text-gray-700">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Amount"
            />
          </div>

          <div>
            <label className="block text-gray-700">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Order description"
            />
          </div>

          {/* Button */}
          <button
            onClick={handleGenerateLink}
            className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-500"
          >
            {loading ? "Generating..." : "Generate Link"}
          </button>
        </div>

        {/* Display the Payment Link */}
        {paymentLink && (
          <div className="mt-4 p-4 bg-green-100 rounded overflow-hidden">
            <h2 className="font-bold">Payment Link</h2><br />
            <p className="text-sm text-gray-700">
              <a
                href={paymentLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ wordBreak: 'break-all' }} // or use `wordWrap: 'break-word'`
              >
                {paymentLink}
              </a>
            </p>
            <button
              onClick={() => navigator.clipboard.writeText(paymentLink)}
              className="mt-2 bg-green-600 text-white py-1 px-2 rounded hover:bg-green-500"
            >
              Copy Link
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
