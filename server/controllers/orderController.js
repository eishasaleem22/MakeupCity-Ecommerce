const transporter = require("../config/email");
const Order = require("../models/Order");

// ==========================================
// CREATE ORDER + SEND CONFIRMATION EMAIL
// ==========================================

const sendOrderConfirmation = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      address,
      city,
      province,
      postalCode,
      paymentMethod,
      cart,
      totalPrice,
    } = req.body;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (
      !fullName ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !province
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required customer details.",
      });
    }

    if (!cart || cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty.",
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Payment method is required.",
      });
    }

    // ==========================================
    // GET LOGGED-IN USER
    // ==========================================

    // If the customer is logged in, authMiddleware
    // can attach the user to req.user.
    //
    // We keep this optional so your existing
    // checkout doesn't break for guest orders.

    const userId = req.user ? req.user._id : null;

    // ==========================================
    // PREPARE ORDER ITEMS
    // ==========================================

    const orderItems = cart.map((item) => ({
      product: item._id || null,
      name: item.name,
      price: item.price,
      qty: item.qty,
      image: item.image || "",
    }));

    // ==========================================
    // CREATE ORDER IN MONGODB
    // ==========================================

    const order = await Order.create({
      user: userId,

      fullName,
      email,
      phone,
      address,
      city,
      province,
      postalCode: postalCode || "",

      orderItems,

      paymentMethod,

      totalPrice,

      status: "Pending",
    });

    // ==========================================
    // CREATE ORDER ITEMS HTML
    // ==========================================

    const orderItemsHTML = cart
      .map(
        (item) => `
          <tr>
            <td style="
              padding: 10px;
              border-bottom: 1px solid #eee;
            ">
              ${item.name}
            </td>

            <td style="
              padding: 10px;
              border-bottom: 1px solid #eee;
              text-align: center;
            ">
              ${item.qty}
            </td>

            <td style="
              padding: 10px;
              border-bottom: 1px solid #eee;
              text-align: right;
            ">
              Rs. ${item.price * item.qty}
            </td>
          </tr>
        `
      )
      .join("");

    // ==========================================
    // EMAIL CONTENT
    // ==========================================

    const mailOptions = {
      from: `"MakeupCity" <${process.env.EMAIL_USER}>`,

      to: email,

      subject: `MakeupCity - Order Confirmation #${order._id}`,

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 650px;
          margin: 0 auto;
          color: #333;
          line-height: 1.6;
        ">

          <!-- HEADER -->

          <div style="
            background-color: #d81b60;
            color: white;
            padding: 25px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          ">

            <h1 style="
              margin: 0;
              font-size: 28px;
            ">
              MakeupCity
            </h1>

            <p style="
              margin: 8px 0 0;
              font-size: 15px;
            ">
              Order Confirmation
            </p>

          </div>

          <!-- EMAIL BODY -->

          <div style="
            padding: 30px;
            border: 1px solid #eee;
            border-top: none;
          ">

            <h2 style="
              color: #d81b60;
              margin-top: 0;
            ">
              Thank you for your order, ${fullName}! 💕
            </h2>

            <p>
              Your order has been successfully placed.
              We have received your order details and will
              process your order shortly.
            </p>

            <p>
              <strong>Order ID:</strong> ${order._id}
            </p>

            <!-- ORDER SUMMARY -->

            <h3 style="
              color: #333;
              margin-top: 30px;
            ">
              Order Summary
            </h3>

            <table style="
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
            ">

              <thead>

                <tr style="
                  background-color: #fce4ec;
                ">

                  <th style="
                    padding: 10px;
                    text-align: left;
                  ">
                    Product
                  </th>

                  <th style="
                    padding: 10px;
                    text-align: center;
                  ">
                    Quantity
                  </th>

                  <th style="
                    padding: 10px;
                    text-align: right;
                  ">
                    Price
                  </th>

                </tr>

              </thead>

              <tbody>
                ${orderItemsHTML}
              </tbody>

            </table>

            <!-- TOTAL -->

            <div style="
              margin-top: 20px;
              padding: 15px;
              background-color: #fce4ec;
              border-radius: 6px;
            ">

              <strong style="
                font-size: 18px;
              ">
                Total: Rs. ${totalPrice}
              </strong>

            </div>

            <!-- DELIVERY INFORMATION -->

            <h3 style="
              color: #333;
              margin-top: 30px;
            ">
              Delivery Information
            </h3>

            <p>
              <strong>Name:</strong> ${fullName}
            </p>

            <p>
              <strong>Email:</strong> ${email}
            </p>

            <p>
              <strong>Phone:</strong> ${phone}
            </p>

            <p>
              <strong>Address:</strong> ${address}
            </p>

            <p>
              <strong>City:</strong> ${city}
            </p>

            <p>
              <strong>Province:</strong> ${province}
            </p>

            ${
              postalCode
                ? `
                  <p>
                    <strong>Postal Code:</strong> ${postalCode}
                  </p>
                `
                : ""
            }

            <p>
              <strong>Payment Method:</strong> ${paymentMethod}
            </p>

            <p>
              <strong>Order Status:</strong> Pending
            </p>

            <hr style="
              border: none;
              border-top: 1px solid #eee;
              margin: 30px 0;
            " />

            <p style="
              color: #777;
              font-size: 14px;
            ">
              Thank you for shopping with MakeupCity.
              We hope you enjoy your products! 💗
            </p>

          </div>

        </div>
      `,
    };

    // ==========================================
    // SEND EMAIL
    // ==========================================

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error(
        "Order saved but confirmation email failed:",
        emailError
      );

      return res.status(201).json({
        success: true,
        message:
          "Order placed successfully, but confirmation email could not be sent.",
        orderId: order._id,
        order,
      });
    }

    // ==========================================
    // SUCCESS RESPONSE
    // ==========================================

    return res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      orderId: order._id,
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create order.",
      error: error.message,
    });
  }
};

module.exports = {
  sendOrderConfirmation,
};