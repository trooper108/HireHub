const checkLoggedin = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        res.redirect('/login');
    }
}

const checkAdmin = (req, res, next) => {
    if (req.user.isAdmin) {
        next();
    }
    else {
        res.send('not permited');
    }
}

const verifyUser = (req, res, next) => {
    if (req.user.isAdmin || req.user._id.equals(req.params.id)) {
        next();
    } else {
        res.send('You are not a verify User');
    }
}

module.exports = {
    checkAdmin,
    checkLoggedin,
    verifyUser
};