import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
const dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(dirname, './config/.env') })

import { findById, findOne, findOneAndUpdate, updateOne } from './../../../../DB/DBmethods.js';
import { userModel } from './../../../../DB/models/user.model.js';
import { asyncHandler } from '../../../middleware/asyncHandler.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { sendEmail } from './../../../services/email.js';
import { nanoid } from 'nanoid'

export const SignUp = asyncHandler(
    async (req, res, next) => {
        const { first_name, last_name, password, age } = req.body;
        let { email } = req.body;
        email = email.toLowerCase();
        const user = await findOne({ model: userModel, filter: { email }, select: 'email' });
        if (user) {
            return next(new Error('Email exists!', { cause: 409 }));
            //return res.status(200).json({ message: "Email exists!" });
        } else {
            const hash = bcrypt.hashSync(password, parseInt(process.env.SALTROUND));
            const newUser = new userModel({ first_name, last_name, email, password: hash, age });
            const token = jwt.sign({ id: newUser._id, site: req.headers.origin }, process.env.EMAILTOKEN, { expiresIn: 60 * 60 * 24 })
            const link = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}`
            const info = await sendEmail(email, 'Email Confirmation', `<a href = ${link}> Please follow me to confirm ur email </a>`);
            if (info?.accepted?.length) {
                const savedUser = await newUser.save();
                return res.status(200).json({ message: "Done" });
            }
            else {
                return next(Error('Email rejected', { cause: 500 }))
            }
        }
    })

export const confirmEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.EMAILTOKEN);
    if (!decoded?.id) {
        return next(Error('Invalid token', { cause: 400 }))
    }
    else {
        const user = await findOneAndUpdate({ model: userModel, filter: { _id: decoded.id, confirmEmail: false }, data: { confirmEmail: true } })
        // if (user.modifiedCount) {
        //     return res.status(200).json({ message: "Ur account is confirmed plz proceed to login page" }); //redirect
        // } else {
        //     return res.status(400).json({ message: "Already confirmed!" });
        // }
        res.redirect(decoded.site);
    }
})

export const SignIn = asyncHandler(
    async (req, res, next) => {
        const { password } = req.body;
        let { email } = req.body;
        email = email.toLowerCase();
        const user = await findOne({ model: userModel, filter: { email } });
        if (!user || user.isDeleted || user.blocked) {
            return next(new Error('Invalid Account or password', { cause: 401 }));
        } else {
            const compare = bcrypt.compareSync(password, user.password);
            if (!compare) {
                return next(new Error('Invalid Account or password', { cause: 401 }));
            } else {
                if (user.confirmEmail) {
                    const userData = { first_name: user.first_name, last_name: user.last_name, _id: user._id };
                    const token = jwt.sign({ user: userData, id: user._id }, process.env.EMAILTOKEN, { expiresIn: 60 * 60 * 24 })
                    return res.status(200).json({ message: "Done", token });
                } else {
                    return next(new Error('Account not confirmed', { cause: 400 }));
                }
            }
        }
    }
)

export const forgetPassword = asyncHandler(
    async (req, res, next) => {
        const { email } = req.body;
        const user = await findOne({ model: userModel, filter: { email }, select: 'email' });
        if (!user) {
            return next(Error('Invalid email', { cause: 404 }));
        } else {
            const code = nanoid();
            await sendEmail(email, 'Recovery Account', `<h2>Access code: ${code} </h2>`);
            await updateOne({ model: userModel, filter: { email }, data: { code } });
            return res.status(200).json({ message: "Done" });
        }
    }
)

export const recoverPassword = asyncHandler(
    async (req, res, next) => {
        const { email, newPassword, code } = req.body;
        const newHash = bcrypt.hashSync(newPassword, parseInt(process.env.SALTROUND));
        const user = await findOneAndUpdate({ model: userModel, filter: { email, code }, data: { password: newHash, code: null } });
        if (user) {
            return res.status(200).json({ message: "Done" })
        } else {
            return next(Error('Invalid access code or email', { cause: 404 }))
        }
    }
)




