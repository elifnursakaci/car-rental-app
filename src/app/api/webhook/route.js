import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Order from "../(models)/Order";

const stripe = require("stripe")(process.env.STRIPE_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  const body = await req.text();

  const signature = headers().get("stripe-signature");
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.WEBHOOK_KEY
    );
  } catch (err) {
    return NextResponse.json({ message: "Webhook başarısız" }, { status: 500 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const line_items = await stripe.checkout.sessions.listLineItems(session.id);

    const item = await stripe.products.retrieve(
      line_items.data[0].price.product
    );

    const orderItem = {
      product: item.metadata.product_id,
      money_spend: line_items.data[0].amount_total,
      currency: line_items.data[0].price.currency,
      type: line_items.data[0].price.type,
    };
    await Order.create(orderItem);
    return NextResponse.json(
      {
        status: "succes",
      },
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      status: "fail",
    },
    { status: 500 }
  );
}
