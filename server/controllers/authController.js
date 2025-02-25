const authService = require('../services/authService');

const registerUser = async(req, res) => {
    const {email, fname, lname, pwd} = req.body;

    if (!email || !pwd) {
        return res.status(400).json({'message': 'Valid email and password are required'});
    }

    try {
        //Call the service function
        const user = await authService.registerUser({email, fname, lname, pwd})

        res.status(201).json({
            message: "Successfully registered user.",
            user: {email: user.email, id: user.id}
        });
    } catch (error) {
        res.status(500).json({message: "Error registering user", error})
    }
}

const createUser = async(req, res) => {
    const {email, fname, lname, pwd, affiliation, judge, coach, debater} = req.body;

    if (!email || !pwd) {
        return res.status(400).json({'message': 'Valid email and password are required'});
    }

    try {
        //Call the service function
        console.log("in controller")

        const user = await authService.createUser({email, fname, lname, pwd, affiliation, judge, coach, debater})
        res.status(201).json({
            message: "Successfully registered user.",
            user: {email: user.email, id: user.id}
        });
    } catch (error) {
        res.status(500).json({message: "Error registering user", error})
    }
}

const loginUser = async(req, res) => {
    //Verify Input
    const {email, pwd} = req.body;
    if (!email || !pwd) return res.status(400).json({'message': 'Email and password are required.'})

    try {
        const user = await authService.login({email, pwd})

        res.cookie('jwt', user.refreshToken, {httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000})
        return res.json({accessToken: user.accessToken, userId: user.userId, name: user.name, admin: user.admin})
    } catch (error) {
        res.status(500).json({message: "Error logging in", error})
    }
}

const refresh = async(req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401);

    const refreshToken = cookies.jwt;

    try {
        const accessToken = await authService.refreshAccessToken({refreshToken})
        return res.json({accessToken: accessToken.accessToken, admin: accessToken.admin})
    } catch (error) {
        res.status(500).json({message: "Error authenticating user", error})
    }

}
const logout = async(req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(204)
    
        const {u_id} = req.body
        const refreshToken = cookies.jwt

        // check to see if refreshToken is in database
        authService.verifyRefreshToken({refreshToken, id: u_id});
        
        //clear cookie
        res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true});

        // remove token from database
        authService.removeToken({id: u_id});

        res.sendStatus(204)
}

module.exports = {
    registerUser,
    createUser,
    loginUser,
    refresh,
    logout
};
