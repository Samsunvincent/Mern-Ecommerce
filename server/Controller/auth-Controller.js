const users = require('../db/model/user-Model');
const admin_data = require('../db/model/admin');
const bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken');
const { success_function, error_function } = require('../utils/Response-Handler');
const dotenv = require('dotenv');
dotenv.config();
const resetpassword = require('../utils/email-templates/resetpassword').resetPassword
let sendEmail  = require('../utils/send-email').sendEmail




exports.login = async function (req, res) {
    try {
        let { email, password } = req.body;

        // Check for missing email
        if (!email) {
            let response = error_function({
                success: false,
                statusCode: 400,
                message: "Email is required",
            });
            res.status(response.statusCode).send(response);
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            let response = error_function({
                success: false,
                statusCode: 400,
                message: "Invalid email format",
            });
            res.status(response.statusCode).send(response);
            return;
        }

        if (!password) {
            let response = error_function({
                success: false,
                statusCode: 400,
                message: "Password is required",
            });
            res.status(response.statusCode).send(response);
            return;
        }

        // Find user in the users collection
        let check_user = await users.findOne({ email: email }).populate('userType')
        console.log("Checking email from users data:", check_user);

        if (check_user) {
            const isPasswordMatch = await bcrypt.compare(password, check_user.password);
            if (isPasswordMatch) {
                // Generate JWT token
                const token = jwt.sign({ id: check_user._id, role: 'user' }, process.env.PRIVATE_KEY, { expiresIn: '10d' });
                let response = success_function({
                    success: true,
                    statusCode: 200,
                    data: { user: check_user, token }
                });
                res.status(response.statusCode).send(response);
            } else {
                let response = error_function({
                    success: false,
                    statusCode: 401,
                    message: "Incorrect password",
                });
                res.status(response.statusCode).send(response);
            }
            return;
        }

        // If no user found, check in the admin collection
        let check_admin = await admin_data.findOne({ email: email }).populate('userType')
        console.log("Checking email from admin data:", check_admin);

        if (check_admin) {
            const isPasswordMatch = await bcrypt.compare(password, check_admin.password);
            if (isPasswordMatch) {
                // Generate JWT token for admin
                const token = jwt.sign({ id: check_admin._id, role: 'admin' }, process.env.PRIVATE_KEY, { expiresIn: '1h' });
                let response = success_function({
                    success: true,
                    statusCode: 200,
                    message: "Admin login successful",
                    data: { admin: check_admin, token }
                });
                res.status(response.statusCode).send(response);
            } else {
                let response = error_function({
                    success: false,
                    statusCode: 401,
                    message: "Incorrect password",
                });
                res.status(response.statusCode).send(response);
            }
            return;
        }

        // If neither user nor admin found, respond with user not found
        let response = error_function({
            success: false,
            statusCode: 404,
            message: "User not found",
        });
        res.status(response.statusCode).send(response);

    } catch (error) {
        console.error("Error during login:", error);
        let response = error_function({
            success: false,
            statusCode: 500,
            message: "An error occurred during login",
        });
        res.status(response.statusCode).send(response);
    }
};


exports.forgetpassword = async function (req, res) {
    try {
        let email = req.body.email;
        console.log("Email from user:", email);

        // Check if the user exists
        let check_user = await users.findOne({ email });
        console.log("User found:", check_user);

        if (!check_user) {
            let response = error_function({
                statusCode: 404,
                message: "User not found",
            });
            return res.status(response.statusCode).send(response);
        }

        // Generate password reset token
        let reset_token = jwt.sign({ user_id: check_user._id }, process.env.PRIVATE_KEY, { expiresIn: "10d" });
        console.log("Generated reset token:", reset_token);

        // Update user document with password reset token
        let data = await users.updateOne({ email: email }, { $set: { password_token: reset_token } });
        console.log("Update result:", data);

        if (data.matchedCount === 0) {
            // This case means no user matched the email in the database
            let response = error_function({
                statusCode: 404,
                message: "No user found to update with the provided email",
            });
            return res.status(response.statusCode).send(response);
        }

        if (data.modifiedCount === 0) {
            // If the matched count is greater than 0 but nothing was modified
            let response = error_function({
                statusCode: 400,
                message: "Failed to update password token",
            });
            return res.status(response.statusCode).send(response);
        }

        // Generate reset link with the token
        let reset_link = `${process.env.FRONTEND_URL}?token=${reset_token}`;

        // Generate email template for reset password
        let email_template = await resetpassword(check_user.name, reset_link);
    

        // Send email with reset link
        sendEmail(email, "Forgot password", email_template);

        // Send success response
        let response = success_function({
            statusCode: 200,
            message: "Email sent successfully",
            data: reset_token,
        });
        return res.status(response.statusCode).send(response);

    } catch (error) {
        console.log("Error:", error);

        // Handle error and respond with an appropriate message
        let response = error_function({
            statusCode: 500,
            message: "Password reset failed",
        });
        return res.status(response.statusCode).send(response);
    }
};


exports.passwordResetController = async function (req, res) {
    try {
        const authHeader = req.headers['authorization'];
        console.log("authHeader", authHeader)
        const token = authHeader.split(" ")[1];
        console.log("token", token);

        let newPassword = req.body.newPassword;
        console.log("newpassword", newPassword)
        let confirmPassword = req.body.confirmPassword

        decoded = jwt.decode(token);
        console.log('decoded', decoded)

        let user = await users.findOne({ $and: [{ _id: decoded.user_id }, { password_token: token }] });
        console.log("user", user)


        if (user) {


            let salt = bcrypt.genSaltSync(10);
            console.log("salt", salt);

            let hashed_password = bcrypt.hashSync(newPassword, salt);
            console.log("hashedPassword", hashed_password);

            let data = await users.updateOne(
                { _id: decoded.user_id },
                { $set: { password: hashed_password, password_token: null } }
            );
            console.log("data", data)
            if (data.matchedCount === 1 && data.modifiedCount == 1) {
                let response = success_function({
                    success: true,
                    statusCode: 200,
                    message: "password changed successgully",
                    data: data
                });
                res.status(response.statusCode).send(response);
                return;
            }
        }
    } catch (error) {
        console.log("Error", error);

        let response = error_function({
            success: false,
            statusCode: 400,
            message: "forbidden"
        });
        res.status(response.statusCode).send(response);
        return;
    }
}
