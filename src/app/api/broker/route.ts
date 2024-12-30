export async function GET(request: Request) {
  const url = new URL("https://exodus.stockbit.com/order-trade/broker/top");
  const searchParams = new URLSearchParams({
    sort: "TB_SORT_BY_TOTAL_VALUE",
    order: "ORDER_BY_DESC",
    period: "TB_PERIOD_LAST_1_DAY",
    market_type: "MARKET_TYPE_ALL",
  });

  url.search = searchParams.toString();
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjU3MDc0NjI3LTg4MWItNDQzZC04OTcyLTdmMmMzOTNlMzYyOSIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZSI6ImhhbmRpa2FoYXJpYW50byIsImVtYSI6ImhhbmRpa2FoYXJpYW50bzAxQGdtYWlsLmNvbSIsImZ1bCI6IkhhbmRpa2EgSGFyaWFudG8iLCJzZXMiOiJjR3JrMURWYVNSajg1c21mIiwiZHZjIjoiIiwidWlkIjoyNjY5NDk4LCJjb3UiOiJDQSJ9LCJleHAiOjE3MzU2NjM4MzAsImlhdCI6MTczNTU3NzQzMCwiaXNzIjoiU1RPQ0tCSVQiLCJqdGkiOiJmNTI5Nzg0MC1jNTYzLTQxYjgtYTFiYi00NTg0NjA1NWFjNjgiLCJuYmYiOjE3MzU1Nzc0MzAsInZlciI6InYxIn0.R5lN7v_hCvJrxQRP_CRSveUiI7-LcnY2ppKw_4i4m4bjCCGznPW_XBFp5kZtwiB9zR4H51f9mB15hLafIgU606uBKHIfgUYJY2LLk51fkJ2Yv_9Ye2f36zuv2UP1EzfHJRdovFOFI0jLij5ES4_TNecg-MymC0LRvHX3T9S7fTHM58Yf9hRkvQcK8qa3c-jMSjlvW4yBq8ZFDlvrgC6ywV14Uw3Pq0NjtoP9UQNeCmzwwURaSHEheGXtLoLvlwuE18TuooJLvZhtlBVDSIQovaovZ83GtGxds7AFHmf86Ix-GGcpElyI9mgxA3CHH-0CyNFbr8Ijg38BUhL3zBP4ew",
    },
  });
  console.log(response.ok);
  console.log(response);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return Response.json(data.data.list);
}
