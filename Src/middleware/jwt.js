import jwt from "jsonwebtoken";

export const generatetoken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// export const verifytoken = (token) => {
//   return jwt.verify(token, process.env.JWT_SECRET);
// };
