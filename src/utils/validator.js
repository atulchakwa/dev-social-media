const validator = require("validator");

const isValidateSignUpData = (req) => {
    // 1. First check if req.body exists
    if (!req.body) {
        throw new Error("Request body is missing");
    }

    const { firstName, lastName, email, password } = req.body;
    
    // 2. Check for required fields first
    if (!firstName) throw new Error("First name is required");
    if (!lastName) throw new Error("Last name is required");
    if (!email) throw new Error("Email is required");
    if (!password) throw new Error("Password is required");
    
    // 3. Then validate field formats
    if (!validator.isEmail(email)) {
        throw new Error("Please provide a valid email address");
    }
    
    if (!validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    })) {
        throw new Error("Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one symbol");
    }

    return true;
};

  const validateEditProfileData = (req) =>{
    const allowedEditField = [
        "firstName",
        "lastName",
        "email",
        "photoURL",
        "about",
        "gender",
        "age",
        "skills"
    ]

    const isEditAllowed = Object.keys(req.body).every((fields)=>
      allowedEditField.includes(fields)
    );
    return isEditAllowed
  };
module.exports = {
    isValidateSignUpData,validateEditProfileData
};