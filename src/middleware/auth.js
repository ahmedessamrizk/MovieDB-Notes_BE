import jwt from 'jsonwebtoken'
import { userModel } from './../../DB/models/user.model.js';



export const auth = () => {
    return async (req, res, next) => {
        try {
            const { authorization } = req.headers;
            if (!authorization?.startsWith(process.env.BEARERKEY)) {
                //res.status(400).json({ message: "Invalid bearer" });
                return next(Error('Invalid bearer', { cause: 400 }))
            } else {
                const token = authorization.split(process.env.BEARERKEY)[1];
                const decoded = jwt.verify(token, process.env.EMAILTOKEN);
                if (!decoded?.user._id) {
                    //res.status(400).json({ message: "Invalid payload data" });
                    return next(Error('Invalid payload data', { cause: 400 }))
                } else {
                    const user = await userModel.findById(decoded.user._id).select('userName');
                    if (!user) {
                        //res.status(404).json({ message: "Invalid id" });
                        return next(Error('Invalid id', { cause: 404 }))
                    } else {
                        req.user = user;
                        return next();
                    }
                }
            }
        } catch (error) {
            //res.status(400).json({ message: "Catch error", error })
            return next(Error('Catch error', { cause: 400 }))
        }
    }
}