import User from "../models/user.model.js";

export const getUserForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    //find every user in the database without the logged in user
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error on getUserForSidebar", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default getUserForSidebar;
