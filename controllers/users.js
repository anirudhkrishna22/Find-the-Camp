const User = require('../models/user')

module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}

module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        console.log(registeredUser)
        // this will make user automatically logged in once he register
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err)
            }
            else {
                req.flash('success', 'successfully logged in')
                res.redirect('/campgrounds')
            }
        })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('register')
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login.ejs')
}

module.exports.login = (req, res)=> {
    req.flash('success', 'welcome back!')
    const redirectUrl=req.session.returnTo || '/campgrounds'
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res) => {
    // passport function to logout a user
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', 'logged out')
        res.redirect('/campgrounds')
      });
}