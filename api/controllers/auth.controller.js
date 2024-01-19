import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';



export const signup = async (req, res, next) => {
  const { username, email, password } = req.body; //Receives username, email, p/word from req.body.
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json("User created successfully");
  } catch (error) {
    next(error); //Handled by the error handling middleware in index.js.
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validEmail = await User.findOne({ email }); //Check if email exists in the db.
    if (!validEmail) return next(errorHandler(404, "Email/User not found!")); //Error if none existent
    const validPassword = bcryptjs.compareSync(password, validEmail.password); //Checks p/word
    if (!validPassword) return next(errorHandler(401, "Wrong credentials")); //Error if invalid

    //Authenticating the user:
    const token = jwt.sign({ id: validEmail._id }, process.env.JWT_SECRET);
    const { password: pasiwadi, ...restOfUserInfo } = validEmail._doc; //Donna wanna send p/word to user - rest of user info.
    //After creating the token, we want to save it as a cookie bbelow:
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(restOfUserInfo);
  } catch (error) {
    next(error);
  }
};
