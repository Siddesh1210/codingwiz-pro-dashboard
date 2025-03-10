const authUser = (req, res, next) => {
    try {
        const user_id = req.cookies?.user_id;

        if (!user_id) {
            return res.status(401).json({ message: "Unauthorized, user_id missing" });
        }

        req.user_id = user_id;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default authUser;
