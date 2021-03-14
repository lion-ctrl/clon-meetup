const nodemailer = require("nodemailer");
const emailConfig = require("../config/email")
const fs = require("fs");
const util = require("util");
const path = require("path");
const ejs = require("ejs");

let transport = nodemailer.createTransport({
    host:emailConfig.host,
    port:emailConfig.port,
    auth:emailConfig.auth
})

exports.enviarEmail = async (opciones) => {
    // * leer el archivo para el email
    const archivo = path.join(__dirname,`/../views/emails/${opciones.archivo}.ejs`);

    // * compilarlo
    const compilado = ejs.compile(fs.readFileSync(archivo,"utf-8"));

    // * crear html
    const html = compilado({url: opciones.url});

    // * configurar las opciones del email
    const opcionesEmail = {
        from: "Meeti <noreply@meeti.com>",
        to: opciones.usuario.email,
        subject: opciones.subject,
        html
    }

    // * enviar emai
    const sendEmail = util.promisify(transport.sendMail,transport);
    return sendEmail.call(transport,opcionesEmail);
}