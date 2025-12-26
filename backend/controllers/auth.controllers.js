import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { fullName,username,password,confirmPassword,gender } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password does not match" });
    }

    const user = await User.findOne({username});

    if (user) {
      return res.status(400).json({error:"Username already exists"})
    }

    // HASH PASSWORD HERE
    const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

    // Available profile pics (only existing images in public folder)
    const imageNumbers = ["(i)", "(iv)", "(vi)", "(x)"];
    const imageType = gender === "male" ? "boy" : "girl";
    const allImages = imageNumbers.map(num => `/${num} ${imageType}.jpg`);

    // Get already used profile pics for this gender
    const usedPics = await User.find({ gender }).select("profilePic").lean();
    const usedPicSet = new Set(usedPics.map(u => u.profilePic));

    // Find available images
    const availableImages = allImages.filter(img => !usedPicSet.has(img));

    let profilePic;
    if (availableImages.length > 0) {
      // Randomly pick from available images
      profilePic = availableImages[Math.floor(Math.random() * availableImages.length)];
    } else {
      // Fallback: use initials (store as special format)
      const firstInitial = fullName.trim().charAt(0).toUpperCase();
      profilePic = `initials:${firstInitial}`;
    }

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePic
    })
    if (newUser) {
    // Generate JWT token here.
    generateTokenAndSetCookie(newUser._id, res);  
    await newUser.save();

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      username: newUser.username,
      profilePic: newUser.profilePic
    })
  } else {
    res.status(400).json({error: "Invalid user data"});
  }

  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({error:"Internal server error"});
  }
};

export const login =  async (req, res) => {
  try {
    const {username,password} =req.body;
    const user = await User.findOne({username});
    const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({error: "Invalid username or password"});
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
    }); 
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({error:"Internal server error"});
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt","", {maxAge:0});
    res.status(200).json({message:"Logged out successfully"});
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({error:"Internal server error"});
  }
};