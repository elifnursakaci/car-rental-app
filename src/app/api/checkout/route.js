import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_KEY);

const getActiveProducts = async () => {
  let stripeProducts = await stripe.products.list();

  return stripeProducts.data.filter((i) => i.active);
};

export const POST = async (req) => {
  try {
    const product = await req.json();

    const stripeProducts = await getActiveProducts();

    let foundProduct = stripeProducts.find(
      (i) => i.metadata.product_id === product._id
    );

    if (!foundProduct) {
      foundProduct = await stripe.products.create({
        name: product.make + " " + product.model,
        images: [product.imageUrl],
        default_price_data: {
          unit_amount: product.price * 100,
          currency: "USD",
        },
        metadata: {
          product_id: product._id,
        },
      });
    }

    const product_info = {
      price: foundProduct.default_price,
      quantity: 1,
    };

    const session = await stripe.checkout.sessions.create({
      line_items: [product_info],
      mode: "payment",
      success_url: "http://localhost:3000" + "/succes",
      cancel_url: "http://localhost:3000" + "/cancel",
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (err) {
    return NextResponse.json(
      {
        message: "Ödeme oturumu oluşturulurken bir hata meydana geldi",
      },
      { status: 500 }
    );
  }
};
