import jwt from "jsonwebtoken";
import {ctrlWrapper} from "../decorators/index.js";
const {JWT_SECRET} = process.env;
import "dotenv/config";
import User from "../db/models/User.js"


const authenticate = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
       res.status(401).json({
  message: 'Not authorized',
});
return;
    }
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer" || !token) {
       res.status(401).json({
  message: 'Not authorized',
});
return;
}
try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
        res.status(401).json({
            message: "user not found",
          });
          return;
    }
    req.user = user;
    next();
} catch (error) {
   res.status(401).json({
  message: 'Not authorized',
});
return;
}
}

export default ctrlWrapper(authenticate) ;


