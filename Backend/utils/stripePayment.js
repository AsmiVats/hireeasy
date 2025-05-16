import Stripe from "stripe";
const stripe = new Stripe(
  "sk_test_51QxBEBID3hMCnXD6BMp3Ds4svyE5lsegcOMMRoD9TUhICTVxUTdmLH9HtSnZOtTF8fy08rIf39OwmkFaFJFrzzOk00Pg2dtGpU"
);

const calculateOrderAmount = (items) => {
  // Calculate the order total on the server to prevent manipulation on the client
  return items.reduce((total, item) => total + item.amount, 0);
};

export const getPaymentIntent = async (req, res) => {
  const { items } = req.body;

  const paymentIntent = await stripe.paymentIntents
    .create({
      amount: calculateOrderAmount(items),
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    })
    .catch((err) => {
      console.log(err);
      return res.status(501).json({
        success: false,
        message: "Something went wrong",
      });
    });
  return res.status(200).json({
    success: true,
    message: "Successfully sent details",
    data: paymentIntent.client_secret,
  });
};
