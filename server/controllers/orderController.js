const transporter = require("../config/email");
const Order = require("../models/Order");

// =====================================================
// SEND ORDER STATUS UPDATE EMAIL
// =====================================================
//
// This helper sends an email whenever the admin changes
// an order's status.
//
// =====================================================

const sendOrderStatusEmail = async (order, newStatus) => {
  const statusMessages = {
    Pending:
      "Your order is currently pending and will be processed shortly.",

    Processing:
      "Great news! Your order is now being processed.",

    Shipped:
      "Your order has been shipped and is now on its way to you.",

    Delivered:
      "Your order has been delivered successfully. We hope you enjoy your products! 💕",

    Cancelled:
      "Unfortunately, your order has been cancelled. Please contact us if you have any questions.",
  };

  const statusMessage =
    statusMessages[newStatus] ||
    "Your order status has been updated.";

  const mailOptions = {
    from: `"MakeupCity" <${process.env.EMAIL_USER}>`,

    to: order.email,

    subject: `MakeupCity - Order #${order._id} Status Updated to ${newStatus}`,

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
            Order Status Update
          </p>

        </div>

        <!-- BODY -->

        <div style="
          padding: 30px;
          border: 1px solid #eee;
          border-top: none;
        ">

          <h2 style="
            color: #d81b60;
            margin-top: 0;
          ">
            Hello ${order.fullName}! 💕
          </h2>

          <p>
            We wanted to let you know that the status of your
            MakeupCity order has been updated.
          </p>

          <!-- ORDER ID -->

          <div style="
            margin-top: 25px;
            padding: 15px;
            background-color: #fce4ec;
            border-radius: 8px;
          ">

            <p style="
              margin: 0 0 8px;
            ">
              <strong>Order ID:</strong>
              ${order._id}
            </p>

            <p style="
              margin: 0;
            ">
              <strong>New Status:</strong>
              <span style="
                color: #d81b60;
                font-weight: bold;
              ">
                ${newStatus}
              </span>
            </p>

          </div>

          <!-- STATUS MESSAGE -->

          <div style="
            margin-top: 25px;
            padding: 20px;
            border: 1px solid #f3d1df;
            border-radius: 8px;
            background-color: #fff8fa;
          ">

            <p style="
              margin: 0;
              font-size: 16px;
            ">
              ${statusMessage}
            </p>

          </div>

          <!-- ORDER INFORMATION -->

          <h3 style="
            color: #333;
            margin-top: 30px;
          ">
            Order Information
          </h3>

          <p>
            <strong>Total:</strong>
            Rs. ${order.totalPrice}
          </p>

          <p>
            <strong>Payment Method:</strong>
            ${order.paymentMethod}
          </p>

          <p>
            <strong>Delivery Address:</strong>
            ${order.address}, ${order.city}, ${order.province}
          </p>

          <!-- ORDER ITEMS -->

          <h3 style="
            color: #333;
            margin-top: 30px;
          ">
            Items in Your Order
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

              ${order.orderItems
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
                .join("")}

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
              Total: Rs. ${order.totalPrice}
            </strong>

          </div>

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
            We will keep you updated about your order. 💗
          </p>

        </div>

      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};


// =====================================================
// CREATE ORDER + SEND CONFIRMATION EMAIL
// =====================================================

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

    // =====================================================
    // VALIDATION
    // =====================================================

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
        message:
          "Please provide all required customer details.",
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

    // =====================================================
    // GET LOGGED-IN USER
    // =====================================================

    const userId = req.user
      ? req.user._id
      : null;

    // =====================================================
    // PREPARE ORDER ITEMS
    // =====================================================

    const orderItems = cart.map((item) => ({
      product: item._id || null,
      name: item.name,
      price: Number(item.price),
      qty: Number(item.qty),
      image: item.image || "",
    }));

    // =====================================================
    // CREATE ORDER IN MONGODB
    // =====================================================

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

      totalPrice: Number(totalPrice),

      status: "Pending",
    });

    // =====================================================
    // CREATE ORDER ITEMS HTML FOR CONFIRMATION EMAIL
    // =====================================================

    const orderItemsHTML = orderItems
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

    // =====================================================
    // CONFIRMATION EMAIL
    // =====================================================

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
              <strong>Order ID:</strong>
              ${order._id}
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
                    <strong>Postal Code:</strong>
                    ${postalCode}
                  </p>
                `
                : ""
            }

            <p>
              <strong>Payment Method:</strong>
              ${paymentMethod}
            </p>

            <p>
              <strong>Order Status:</strong>
              Pending
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

    // =====================================================
    // SEND CONFIRMATION EMAIL
    // =====================================================

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

    // =====================================================
    // SUCCESS RESPONSE
    // =====================================================

    return res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      orderId: order._id,
      order,
    });

  } catch (error) {
    console.error(
      "Error creating order:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create order.",
      error: error.message,
    });
  }
};


// =====================================================
// GET ALL ORDERS
// =====================================================

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate(
        "user",
        "name email role"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });

  } catch (error) {
    console.error(
      "Error fetching all orders:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders.",
      error: error.message,
    });
  }
};


// =====================================================
// GET SINGLE ORDER
// =====================================================

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(
      req.params.id
    ).populate(
      "user",
      "name email role"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {
    console.error(
      "Error fetching order:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch order.",
      error: error.message,
    });
  }
};


// =====================================================
// UPDATE ORDER STATUS + SEND EMAIL
// =====================================================
//
// Admin can change:
//
// Pending
// Processing
// Shipped
// Delivered
// Cancelled
//
// Whenever the status actually changes, the customer
// receives an email.
//
// =====================================================

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // =====================================================
    // VALID STATUS VALUES
    // =====================================================

    const allowedStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Order status is required.",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status.",
      });
    }

    // =====================================================
    // FIND ORDER
    // =====================================================

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // =====================================================
    // CHECK WHETHER STATUS ACTUALLY CHANGED
    // =====================================================

    const oldStatus = order.status;

    if (oldStatus === status) {
      return res.status(200).json({
        success: true,
        message:
          "Order status is already set to this value.",
        emailSent: false,
        order,
      });
    }

    // =====================================================
    // UPDATE STATUS
    // =====================================================

    order.status = status;

    const updatedOrder =
      await order.save();

    // =====================================================
    // SEND STATUS UPDATE EMAIL
    // =====================================================

    let emailSent = false;
    let emailErrorMessage = null;

    try {
      await sendOrderStatusEmail(
        updatedOrder,
        status
      );

      emailSent = true;

      console.log(
        `Order status email sent to ${updatedOrder.email}`
      );

    } catch (emailError) {

      emailErrorMessage =
        emailError.message;

      console.error(
        "Order status updated but status email failed:",
        emailError
      );
    }

    // =====================================================
    // RETURN UPDATED ORDER
    // =====================================================

    return res.status(200).json({
      success: true,

      message: emailSent
        ? "Order status updated and customer notified by email."
        : "Order status updated, but customer email could not be sent.",

      oldStatus,
      newStatus: status,

      emailSent,

      ...(emailErrorMessage && {
        emailError: emailErrorMessage,
      }),

      order: updatedOrder,
    });

  } catch (error) {
    console.error(
      "Error updating order status:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update order status.",
      error: error.message,
    });
  }
};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  sendOrderConfirmation,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};