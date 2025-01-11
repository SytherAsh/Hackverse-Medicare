const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        console.log("Expected role:", allowedRoles);
        console.log("User role from request:", req.user.role);
        if (!req?.user?.role) return res.sendStatus(403);
        if (!allowedRoles.includes(req.user.role)) return res.sendStatus(403);
        next();
    };
};
module.exports = verifyRoles;
