import jwt from 'jsonwebtoken';
import {User} from '../models/User.js';

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token){
            return res.status(401).json({ success: false, message: "Unauthorized access" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded) {
            return res.status(401).json({ success: false, message: "wrong token" });
        }

        const user = await User.findById(decoded.id);

          if(!user) {
            return res.status(404).json({ success: false, message: "no user" });
        }

        req.user = {id: user._id, firstname: user.firstname, role: user.role }; 
        next();

    } catch (error) {
         return res.status(500).json({ success: false, message: "please login" });

    }
}

export default authenticate;