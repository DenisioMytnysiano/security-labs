const {userService} = require("../services/user.service");

const me = async (req, res) => {
    const accessToken = req.headers.authorization.split(" ")[1];
    return res.json({me: await userService.me(accessToken)});
}

module.exports = {
    me
}