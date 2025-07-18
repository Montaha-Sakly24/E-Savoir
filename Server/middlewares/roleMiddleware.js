import {User, ROLES} from '../models/User.js';

export const requireAdmin = (req, res, next) => {
    if (req.user.role !== ROLES.ADMIN) {
        return res.status(403).json({ message: "Access reserved for administrators" });
    }
    next();
};

export const requireMember = (req, res, next) => {
    if (req.user.role !== ROLES.MEMBER) {
        return res.status(403).json({ message: "Access reserved for members" });
    }
    next();
};