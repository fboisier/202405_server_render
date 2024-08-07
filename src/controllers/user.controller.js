import PerfilUsuario from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

const JWT_SECRET = process.env.JWT_SECRET || "secreto_por_defecto";

// Controlador de registro
const registrar = async (req, res) => {
    try {
        const usuario = await PerfilUsuario.create(req.body);


        const mailOptions = {
            from: 'no-responder@boisier.cl',
            to: usuario.email,
            subject: 'Correo de prueba',
            text: `El usuario ${usuario.usuario} ha sido creado.`,
            html: `
            <div style="
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background-color: #f8f9fa;
            ">
                <div style="
                    padding: 20px;
                    border-radius: 5px;
                    background-color: #fff;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                ">
                    <h1 style="color: #6c757d;">Usuario Creado</h1>
                    <p>El usuario ${usuario.nombre} ha sido creado.</p>
                </div>
            </div>
            `
        };

        transport.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Correo enviado: ' + info.response);
            }
        });

        res.json({ msg: "¡Usuario Creado con Éxito!", usuario });
    } catch (err) {
        res.json(err);
    }
};

const iniciarSesion = async (req, res) => {
    const { email, password } = req.body;

    try {
        const usuario = await PerfilUsuario.findOne({ email });

        if (!usuario) {
            return res.status(401).json({ msg: "Autenticación fallida: El email o clave incorrecto.E" });
        }

        // Verificar la clave secreta
        const esClaveValida = await bcrypt.compare(password, usuario.password);

        if (!esClaveValida) {
            return res.status(401).json({ msg: "Autenticación fallida: El email o clave incorrecto.P" });
        }

        // Generar el token de acceso
        const payload = { id: usuario._id, usuario: usuario.usuario, email: usuario.email, nombre: usuario.nombre }
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
        res.cookie('authToken', token, { httpOnly: true, secure: true }).json({
            msg: '¡Inicio de sesión exitoso, cookie configurada!',
            token,
            usuario: payload
        });

    } catch (err) {
        res.status(500).json({ msg: "Error en el servidor", err });
    }
};

const cerrarSesion = async (req, res) => {
    res.clearCookie('authToken').json({ msg: '¡Cierre de sesión exitoso!' });
};

export { registrar, iniciarSesion, cerrarSesion };