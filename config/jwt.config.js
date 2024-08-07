
import jwt from 'jsonwebtoken';

const LLAVE_SECRETA = process.env.JWT_SECRET || 'secreto_por_defecto';

// Middleware de autenticación
const autenticarJWT = (req, res, next) => {
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(403).json({ mensaje: 'Acceso denegado: No se proporcionó un token' });
    }

    jwt.verify(token, LLAVE_SECRETA, (err, usuario) => {
        if (err) {
            return res.status(403).json({ mensaje: 'Acceso denegado: Token inválido' });
        }

        req.usuario = usuario; // Agregar la información del usuario a la solicitud
        next(); // Continuar al siguiente middleware o ruta
    });
};

export default autenticarJWT;
