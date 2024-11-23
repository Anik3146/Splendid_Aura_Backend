const bcrypt = require("bcryptjs");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);
const jwt = require("jsonwebtoken");
const { tokenForVerify } = require("../config/auth");
const Admin = require("../model/Admin");
const { generateToken } = require("../utils/token");
const { sendEmail } = require("../config/email");
const { secret } = require("../config/secret");

// register
const registerAdmin = async (req, res, next) => {
  try {
    const isAdded = await Admin.findOne({ email: req.body.email });
    if (isAdded) {
      return res.status(403).send({
        message: "This Email already Added!",
      });
    } else {
      const newStaff = new Admin({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        password: bcrypt.hashSync(req.body.password),
      });
      const staff = await newStaff.save();

      // Generate verification token
      const token = jwt.sign({ id: staff._id }, secret.jwt_secret_for_verify, {
        expiresIn: "1d",
      });

      // Prepare email content
      const body = {
        from: secret.email_user,
        to: secret.super_admin_email,
        subject: "Admin Panel Registration Verification",
        html: `<h2>Admin Panel User : ${staff.name}</h2>
        <p>Please verify the user according to the role : ${staff.role}</p>
        <a href="http://localhost:3000/verify-email/${token}" style="background:#0989FF;color:white;border:1px solid #0989FF; padding: 10px 15px; border-radius: 4px; text-decoration:none;">Verify Email</a>
        <p>If you did not register for this account, please ignore this email.</p>
        <strong>Splendid Aura Team</strong>`,
      };

      // Send the email
      sendEmail(body, res, "Please check your email to verify your account!");

      res.status(200).send({
        message:
          "Registration successful! Please check your email to verify your account.",
      });
    }
  } catch (err) {
    next(err);
  }
};

// login admin
const loginAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });

    // Check if the admin exists and the password is correct
    if (admin && bcrypt.compareSync(req.body.password, admin.password)) {
      // Check if the admin is verified
      if (!admin.verified) {
        return res.status(403).send({
          message: "Admin account is not verified!",
        });
      }

      const token = generateToken(admin);
      res.send({
        token,
        _id: admin._id,
        name: admin.name,
        phone: admin.phone,
        email: admin.email,
        image: admin.image,
        role: admin.role,
        verified: admin.verified,
      });
    } else {
      res.status(401).send({
        message: "Invalid Email or password!",
      });
    }
  } catch (err) {
    next(err);
  }
};

// forget password
const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    // console.log('email--->',email)
    const admin = await Admin.findOne({ email: email });
    if (!admin) {
      return res.status(404).send({
        message: "Admin Not found with this email!",
      });
    } else {
      const token = tokenForVerify(admin);
      const body = {
        from: secret.email_user,
        to: email,
        subject: "Password Reset",
        html: `<h2>Hello ${email}</h2>
        <p>A request has been received to change the password for your <strong>Shofy</strong> account </p>

        <p>This link will expire in <strong> 10 minute</strong>.</p>

        <p style="margin-bottom:20px;">Click this link for reset your password</p>

        <a href= "http://localhost:3000/reset-password/${token}" style="background:#0989FF;color:white;border:1px solid #0989FF; padding: 10px 15px; border-radius: 4px; text-decoration:none;">Reset Password</a>

        <p style="margin-top: 35px;">If you did not initiate this request, please contact us immediately at support@shofy.com</p>

        <p style="margin-bottom:0px;">Thank you</p>
        <strong>Shofy Team</strong>
        `,
      };
      admin.confirmationToken = token;
      const date = new Date();
      date.setDate(date.getDate() + 1);
      admin.confirmationTokenExpires = date;
      await admin.save({ validateBeforeSave: false });
      const message = "Please check your email to reset password!";
      sendEmail(body, res, message);
    }
  } catch (error) {
    next(error);
  }
};
// confirm-forget-password
const confirmAdminForgetPass = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    // Ensure the token is a string
    if (typeof token !== "string") {
      return res.status(400).json({
        status: "fail",
        message: "Invalid token format",
      });
    }

    // Find the admin by confirmationToken
    const admin = await Admin.findOne({ confirmationToken: token });

    if (!admin) {
      return res.status(403).json({
        status: "fail",
        message: "Invalid token",
      });
    }

    // Check if the token has expired
    const expired = new Date() > new Date(admin.confirmationTokenExpires);

    if (expired) {
      return res.status(401).json({
        status: "fail",
        message: "Token expired",
      });
    } else {
      // Hash the new password
      const newPassword = bcrypt.hashSync(password);

      // Update the admin's password
      await Admin.updateOne(
        { confirmationToken: token },
        { $set: { password: newPassword } }
      );

      // Clear the confirmationToken and expiration date after reset
      admin.confirmationToken = undefined;
      admin.confirmationTokenExpires = undefined;

      // Save the admin with the updated password
      await admin.save({ validateBeforeSave: false });

      res.status(200).json({
        message: "Password reset successfully",
      });
    }
  } catch (error) {
    next(error);
  }
};

// change password
const changePassword = async (req, res, next) => {
  try {
    const { email, oldPass, newPass } = req.body || {};
    const admin = await Admin.findOne({ email: email });
    // Check if the admin exists
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    if (!bcrypt.compareSync(oldPass, admin.password)) {
      return res.status(401).json({ message: "Incorrect current password" });
    } else {
      const hashedPassword = bcrypt.hashSync(newPass);
      await Admin.updateOne({ email: email }, { password: hashedPassword });
      res.status(200).json({ message: "Password changed successfully" });
    }
  } catch (error) {
    next(error);
  }
};
// reset Password
const resetPassword = async (req, res) => {
  const token = req.body.token;
  const { email } = jwt.decode(token);
  const staff = await Admin.findOne({ email: email });

  if (token) {
    jwt.verify(token, secret.jwt_secret_for_verify, (err, decoded) => {
      if (err) {
        return res.status(500).send({
          message: "Token expired, please try again!",
        });
      } else {
        staff.password = bcrypt.hashSync(req.body.newPassword);
        staff.save();
        res.send({
          message: "Your password change successful, you can login now!",
        });
      }
    });
  }
};
// add staff
const addStaff = async (req, res, next) => {
  try {
    const isAdded = await Admin.findOne({ email: req.body.email });
    if (isAdded) {
      return res.status(500).send({
        message: "This Email already Added!",
      });
    } else {
      const newStaff = new Admin({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
        phone: req.body.phone,
        joiningDate: req.body.joiningDate,
        role: req.body.role,
        image: req.body.image,
      });
      await newStaff.save();
      res.status(200).send({
        message: "Staff Added Successfully!",
      });
    }
  } catch (err) {
    next(err);
  }
};
// get all staff
const getAllStaff = async (req, res, next) => {
  try {
    const admins = await Admin.find({}).sort({ _id: -1 });
    res.status(200).json({
      status: true,
      message: "Staff get successfully",
      data: admins,
    });
  } catch (err) {
    next(err);
  }
};
// getStaffById
const getStaffById = async (req, res, next) => {
  // console.log('getStaffById',req.params.id)
  try {
    const admin = await Admin.findById(req.params.id);
    res.send(admin);
  } catch (err) {
    next(err);
  }
};
// updateStaff
const updateStaff = async (req, res) => {
  try {
    const admin = await Admin.findOne({ _id: req.params.id });
    if (admin) {
      admin.name = req.body.name;
      admin.email = req.body.email;
      admin.phone = req.body.phone;
      admin.role = req.body.role;
      admin.joiningData = req.body.joiningDate;
      admin.image = req.body.image;
      admin.password =
        req.body.password !== undefined
          ? bcrypt.hashSync(req.body.password)
          : admin.password;
      const updatedAdmin = await admin.save();
      const token = generateToken(updatedAdmin);
      res.send({
        token,
        _id: updatedAdmin._id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        role: updatedAdmin.role,
        image: updatedAdmin.image,
        phone: updatedAdmin.phone,
      });
    } else {
      res.status(404).send({
        message: "This Staff not found!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
// deleteStaff
const deleteStaff = async (req, res, next) => {
  try {
    await Admin.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Admin Deleted Successfully",
    });
  } catch (err) {
    next(err);
  }
};

const updatedStatus = async (req, res) => {
  try {
    const newStatus = req.body.status;

    await Admin.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: newStatus,
        },
      }
    );
    res.send({
      message: `Store ${newStatus} Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

//verification of admins
const verifyAdminEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    // Verify the token
    jwt.verify(token, secret.jwt_secret_for_verify, async (err, decoded) => {
      if (err) {
        return res.status(400).send({
          message: "Invalid or expired verification link.",
        });
      }

      // Find the admin based on the decoded ID
      const admin = await Admin.findById(decoded.id);
      if (!admin) {
        return res.status(404).send({
          message: "Admin not found.",
        });
      }

      // Update the admin's verified status
      admin.verified = true;
      await admin.save();

      res.status(200).send({
        message: "Your account has been successfully verified!",
      });
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  forgetPassword,
  resetPassword,
  addStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  updatedStatus,
  changePassword,
  confirmAdminForgetPass,
  verifyAdminEmail,
};
