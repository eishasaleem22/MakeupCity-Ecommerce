const User = require("../models/User");
const Order = require("../models/Order");

// =====================================================
// GET ALL USERS
// =====================================================
// Used by Admin Users page.
//
// Returns all users except passwords.
//
// Also calculates:
// - Total number of orders
// - Total amount spent
//
// Orders are matched in two ways:
// 1. By user ID
// 2. By email for older/guest orders where user is null
// =====================================================

const getAllUsers = async (req, res) => {
  try {
    // =====================================================
    // GET ALL USERS
    // =====================================================

    const users = await User.find({})
      .select("-password")
      .sort({
        createdAt: -1,
      });

    // =====================================================
    // ADD ORDER STATISTICS TO EVERY USER
    // =====================================================

    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        // =====================================================
        // FIND USER ORDERS
        // =====================================================
        //
        // We check:
        //
        // 1. Orders directly linked to this user's ID
        //
        // OR
        //
        // 2. Older/guest orders where:
        //    - user is null
        //    - email matches the user's email
        //
        // This allows existing orders to appear correctly.
        // =====================================================

        const orders = await Order.find({
          $or: [
            {
              user: user._id,
            },
            {
              user: null,
              email: user.email,
            },
          ],
        }).select(
          "_id totalPrice status createdAt email user"
        );

        // =====================================================
        // TOTAL ORDERS
        // =====================================================

        const totalOrders = orders.length;

        // =====================================================
        // TOTAL SPENT
        // =====================================================
        //
        // Cancelled orders are NOT included in total spent.
        // =====================================================

        const totalSpent = orders
          .filter(
            (order) =>
              order.status !== "Cancelled"
          )
          .reduce(
            (total, order) =>
              total +
              Number(order.totalPrice || 0),
            0
          );

        // =====================================================
        // RETURN USER + STATISTICS
        // =====================================================

        return {
          ...user.toObject(),

          totalOrders,
          totalSpent,
        };
      })
    );

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,
      count: usersWithStats.length,
      users: usersWithStats,
    });
  } catch (error) {
    console.error(
      "Error fetching all users:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users.",
      error: error.message,
    });
  }
};

// =====================================================
// GET SINGLE USER
// =====================================================
// Used when Admin clicks "View Details".
//
// Returns:
// - User information
// - Total orders
// - Total amount spent
// - Complete order history
//
// Orders are matched by:
// 1. User ID
// 2. Email for older/guest orders
// =====================================================

const getUserById = async (req, res) => {
  try {
    // =====================================================
    // FIND USER
    // =====================================================

    const user = await User.findById(
      req.params.id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // =====================================================
    // FIND USER ORDERS
    // =====================================================
    //
    // Match both:
    //
    // 1. Properly linked orders
    // 2. Older orders where user is null but email matches
    // =====================================================

    const orders = await Order.find({
      $or: [
        {
          user: user._id,
        },
        {
          user: null,
          email: user.email,
        },
      ],
    })
      .sort({
        createdAt: -1,
      })
      .select(
        "_id fullName email phone address city province postalCode orderItems paymentMethod totalPrice status createdAt user"
      );

    // =====================================================
    // CALCULATE ORDER STATISTICS
    // =====================================================

    const totalOrders = orders.length;

    const totalSpent = orders
      .filter(
        (order) =>
          order.status !== "Cancelled"
      )
      .reduce(
        (total, order) =>
          total +
          Number(order.totalPrice || 0),
        0
      );

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,

      user: {
        ...user.toObject(),

        totalOrders,
        totalSpent,

        orders,
      },
    });
  } catch (error) {
    console.error(
      "Error fetching user:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user.",
      error: error.message,
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getAllUsers,
  getUserById,
};