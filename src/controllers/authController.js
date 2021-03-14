const passport = require("passport");

exports.autenticarUsuario = passport.authenticate("local",{
    successRedirect:"/administracion",
    failureRedirect:"/iniciar-sesion",
    failureFlash:true,
    badRequestMessage: "Ambos campos son obligatorios"
})

exports.cerrarSesion = (req,res,next) => {
    req.logout();
    req.flash("correcto","Cerraste Sesion Correctamente");
    res.redirect("/iniciar-sesion");
    next();
}

exports.usuarioAutenticado = (req,res,next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect("/iniciar-sesion");
}