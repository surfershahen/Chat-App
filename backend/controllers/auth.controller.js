import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    //get this inputs from user
    const { fullName, username, password, confirmPassword, gender } = req.body;
    // check if password do not  match
    if (password !== confirmPassword) {
      //return this error with status 400
      return res.status(400).json({ error: "Password don't match" });
    }

    //check if user exists already in DB depending on username
    const user = await User.findOne({ username });
    if (user) {
      // return this error with status 400
      return res.status(400).json({ error: "Username already exists" });
    }

    //else we create hashpassword
    // HASH PASSWORD HERE

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // HERE WE DETERMINED THE USER PROFILE PIC
    //TODO: PROFILE AVATAR BOY,GIRL
    // const boyProfilePic = ``
    // const girlProfilePic = ``
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
    // CREATE THE NEW USER
    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });
    // SAVE IT TO THE DB
    if (newUser) {
      //Generate JWT token
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
      //SEND IT AS RESPONSE
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: "Invalid yser data" });
    }
  } catch (error) {
    console.error("Error in signup controller ", error.message);
    res.status(500).json({ error: "Internal Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );
    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller ", error.message);
    res.status(500).json({ error: "Internal Server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully " });
  } catch (error) {
    console.log("Error in logout controller ", error.message);
    res.status(500).json({ error: "Internal Server error" });
  }
};
