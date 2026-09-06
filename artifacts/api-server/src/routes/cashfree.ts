import { randomUUID } from "node:crypto";
import { Router, type IRouter } from "express";

const router: IRouter = Router();

const CASHFREE_API_URL = "https://api.cashfree.com/pg/orders";
const CASHFREE_API_VERSION = "2023-08-01";

const plans = {
  "01": { name: "Starter Lite", price: 20_000 },
  "02": { name: "Essential Web", price: 50_000 },
  "03": { name: "Professional Business", price: 80_000 },
  "04": { name: "Enterprise Standard", price: 110_000 },
  "05": { name: "Advanced Corporate", price: 140_000 },
  "06": { name: "AI Automated Portal", price: 170_000 },
  "07": { name: "E-Commerce Engine", price: 200_000 },
  "08": { name: "SaaS Platform Starter", price: 230_000 },
  "09": { name: "SaaS Platform Pro", price: 260_000 },
  "10": { name: "Global Enterprise Hub", price: 290_000 },
  "11": { name: "AI Voice & Agent Portal", price: 320_000 },
  "12": { name: "Omnichannel AI Suite", price: 350_000 },
  "13": { name: "Custom FinTech Engine", price: 380_000 },
  "14": { name: "Ultra Enterprise Ecosystem", price: 410_000 },
  "15": { name: "Bespoke Custom AI Empire", price: 600_000 },
} as const;

type Customer = {
  name: string;
  email: string;
  phone: string;
};

function isNonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function cleanCustomer(value: unknown): Customer | null {
  if (!value || typeof value !== "object") return null;
  const customer = value as Record<string, unknown>;
  const name = typeof customer.name === "string" ? customer.name.trim() : "";
  const email = typeof customer.email === "string" ? customer.email.trim().toLowerCase() : "";
  const phone = typeof customer.phone === "string" ? customer.phone.replace(/[^\d+]/g, "") : "";
  if (!name || !isValidEmail(email) || phone.replace(/\D/g, "").length < 8) return null;
  return { name, email, phone };
}

router.post("/payment/cashfree/order", async (req, res) => {
  const clientId = process.env.CASHFREE_CLIENT_ID;
  const clientSecret = process.env.CASHFREE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    res.status(503).json({ message: "Cashfree checkout is not configured yet." });
    return;
  }

  const planId = typeof req.body?.planId === "string" ? req.body.planId : "";
  const plan = plans[planId as keyof typeof plans];
  const customer = cleanCustomer(req.body?.customer);
  if (!plan || !customer) {
    res.status(400).json({ message: "Choose a valid plan and provide a name, email, and phone number." });
    return;
  }

  const advance = Math.round(plan.price / 2);
  const orderId = `arb_${planId.toLowerCase()}_${Date.now()}_${randomUUID().slice(0, 8)}`;
  const suppliedReturnUrl = typeof req.body?.returnUrl === "string" ? req.body.returnUrl : "";
  let returnUrl: string | undefined;
  if (suppliedReturnUrl.startsWith("http")) {
    try {
      const parsedReturnUrl = new URL(suppliedReturnUrl);
      parsedReturnUrl.searchParams.set("cashfree_order_id", orderId);
      returnUrl = parsedReturnUrl.toString();
    } catch {
      returnUrl = undefined;
    }
  }

  try {
    const response = await fetch(CASHFREE_API_URL, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "x-api-version": CASHFREE_API_VERSION,
        "x-client-id": clientId,
        "x-client-secret": clientSecret,
        "x-request-id": orderId,
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: advance,
        order_currency: "INR",
        customer_details: {
          customer_id: `arb_${customer.email.replace(/[^a-z0-9]/gi, "").slice(0, 24)}`,
          customer_name: customer.name,
          customer_email: customer.email,
          customer_phone: customer.phone,
        },
        order_note: `${plan.name} - 50% advance`,
        order_meta: returnUrl ? { return_url: returnUrl } : undefined,
      }),
    });
    const payload = (await response.json()) as {
      payment_session_id?: string;
      order_id?: string;
      message?: string;
      type?: string;
    };

    if (!response.ok || !payload.payment_session_id) {
      req.log?.error({ status: response.status, type: payload.type }, "Cashfree order creation failed");
      res.status(502).json({ message: payload.message || "Cashfree could not create the checkout session." });
      return;
    }

    res.json({
      orderId: payload.order_id ?? orderId,
      paymentSessionId: payload.payment_session_id,
      amount: advance,
      currency: "INR",
      plan: plan.name,
    });
  } catch (error) {
    req.log?.error({ err: error }, "Cashfree request failed");
    res.status(502).json({ message: "Cashfree is temporarily unavailable. Please retry or use ACH transfer." });
  }
});

router.get("/payment/cashfree/status/:orderId", async (req, res) => {
  const clientId = process.env.CASHFREE_CLIENT_ID;
  const clientSecret = process.env.CASHFREE_CLIENT_SECRET;
  const orderId = req.params.orderId;
  if (!clientId || !clientSecret || !/^arb_[a-z0-9]+_\d+_[a-f0-9]+$/.test(orderId)) {
    res.status(400).json({ message: "Invalid payment order." });
    return;
  }

  try {
    const response = await fetch(`${CASHFREE_API_URL}/${encodeURIComponent(orderId)}`, {
      headers: {
        accept: "application/json",
        "x-api-version": CASHFREE_API_VERSION,
        "x-client-id": clientId,
        "x-client-secret": clientSecret,
      },
    });
    const payload = (await response.json()) as { order_status?: string; order_id?: string };
    if (!response.ok) {
      res.status(502).json({ message: "Unable to verify the Cashfree payment right now." });
      return;
    }
    res.json({ orderId: payload.order_id ?? orderId, status: payload.order_status ?? "UNKNOWN" });
  } catch (error) {
    req.log?.error({ err: error }, "Cashfree status request failed");
    res.status(502).json({ message: "Unable to verify the Cashfree payment right now." });
  }
});

router.get("/payment/bank-details", (_req, res) => {
  const bankName = process.env.ACH_BANK_NAME;
  const accountName = process.env.ACH_ACCOUNT_NAME;
  const routingNumber = process.env.ACH_ROUTING_NUMBER;
  const accountNumber = process.env.ACH_ACCOUNT_NUMBER;
  const swiftCode = process.env.ACH_SWIFT_CODE;
  if (!bankName || !accountName || !routingNumber || !accountNumber || !swiftCode) {
    res.status(503).json({ message: "ACH transfer details are not configured yet." });
    return;
  }
  res.json({ bankName, accountName, routingNumber, accountNumber, swiftCode });
});

export default router;