import USER from "../model/userModel.js";
import { hashpassword, comparepassword } from "../utils/bcypt.js";
import { generatetoken } from "../middleware/jwt.js";
import { OAuth2Client } from "google-auth-library";
import Laundry from "../model/laundrySchema.js";



// export const register = async (req, res) => {
//   try {
//     const { name, email, password, authType, role, googleId } = req.body;
//     console.log(password);
//     const existUser = await USER.findOne({ email });

//     if (existUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const hashedpassword = await hashpassword(password);
//     const newUser = new USER({
//       name,
//       email,
//       role,
//       authType,
//       googleId: authType === "google" ? googleId : null,
//       password: authType === "google" ? "" : hashedpassword,
//     });

//     await newUser.save();
//     const token = generatetoken(newUser);
//     res
//       .status(201)
//       .json({ message: "User registered successfully", user: newUser ,token});
//   } catch (error) {
//     console.error("Registration error:", error);
//     res.status(500).json({ message: "Server error during registration" });
//   }
// };
//////////////////////////////////////////////////////////////////////////////////////////////
import OTP from "../model/otpSchema.js";
import { sendOTPEmail } from "../utils/sendOtp.js";
// import { LaundryItem } from "../model/cartSchema.js";

export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(otp)

    // Delete existing OTPs for that email
    await OTP.deleteMany({ email });

    // Save new OTP to DB
    const otpEntry = new OTP({ email, otp });
    await otpEntry.save();

    // Send OTP email
    await sendOTPEmail(email, otp);

    res.status(200).json({ message: "OTP sent to email",otp });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Error sending OTP" });
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////



// export const verifyOTP = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     if (!email || !otp) {
//       return res.status(400).json({ message: "Email and OTP are required" });
//     }

//     // Find OTP entry
//     const otpRecord = await OTP.findOne({ email });

//     if (!otpRecord) {
//       return res.status(400).json({ message: "OTP expired or not found" });
//     }

//     if (otpRecord.otp !== parseInt(otp)) {
//       return res.status(400).json({ message: "Invalid OTP" });
//     }

//     // OTP is valid
//     await OTP.deleteMany({ email }); // Optional: cleanup

//     res.status(200).json({ message: "OTP verified successfully" });
//   } catch (error) {
//     console.error("OTP verification error:", error);
//     res.status(500).json({ message: "Server error during OTP verification" });
//   }
// };


////////////////////////////////////////////////////////////////////////////////////////////////

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide both email and password." });
    }

    let user = await USER.findOne({ email });
    let role = "user";

    if (!user) {
      user = await Laundry.findOne({ email });
      role = "laundry";
    }

    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found. Please register first." });
    }

    const passwordverify = await comparepassword(password, user.password);
    if (!passwordverify) {
      return res.status(400).json({ message: "Incorrect password." });
    }
    const token = generatetoken(user);

    res.status(200).json({ message: "Login successful", user, token });
  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res, next) => {
  try {
    const { credential } = req.body;

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId, picture } = payload;

    // Check if user exists
    let user = await USER.findOne({ email });

    if (!user) {
      // Create new user if doesn't exist
      user = await USER.create({
        name,
        email,
        googleId,
        authType: "google",
        profileimage: picture,
        isVerified: true, // Google verified emails
      });
    } else if (!user.googleId) {
      // Update existing user with Google ID if logging in for first time
      user.googleId = googleId;
      user.profilePic = picture;
      await user.save();
    }

    // Generate JWT token
    const token = generatetoken(user);
    res.status(200).json({
      message: "Google login successful",
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};




export const register = async (req, res) => {
  try {
    const { name, email, password, authType, role, googleId, otp } = req.body;

    // Check for existing user
    const existUser = await USER.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    const existlaundry = await Laundry.findOne({ email });
    if (existlaundry) {
      return res.status(400).json({ message: " already exists" });
    }
    
    // OTP Verification step
    const otpRecord = await OTP.findOne({otp});
    console.log(otpRecord)
    if (!otpRecord) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }

    if (otpRecord.otp !== parseInt(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Clean up OTP after verification
    await OTP.deleteMany({ email });

    // Hash password if not Google
    const hashedpassword = await hashpassword(password);

    // Create new user
    const newUser = new USER({
      name,
      email,
      role,
      authType,
      googleId: authType === "google" ? googleId : null,
      password: authType === "google" ? "" : hashedpassword,
    });

    await newUser.save();

    const token = generatetoken(newUser);

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};


export const updateUserLocation = async (req, res) => {
  try {
    const userId = req.user.id; 
    console.log(req.user)
    console.log(userId)
    const { latitude, longitude, locationName } = req.body;

    if (!latitude || !longitude ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updatedUser = await USER.findByIdAndUpdate(
      userId,
      {
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
          name: locationName,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Location updated successfully",
      location: updatedUser.location,
    });
  } catch (error) {
    console.error("Error updating user location:", error);
    res.status(500).json({ message: "Server error" });
  }
};


