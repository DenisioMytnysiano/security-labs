const me = async (req, res) => {
    if(req.session.login){
        return res.json({me: req.session.login});
    }
    return res.status(401);
}

module.exports = {
    me
}