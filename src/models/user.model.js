import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import uniqueValidator  from 'mongoose-unique-validator';

// Definir el esquema del perfil de usuario
const EsquemaPerfilUsuario = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es obligatorio"]
    },
    usuario: {
        type: String,
        required: [true, "El usuario es necesario"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "El correo es obligatorio"],
        unique: true,
        validate: {
            validator: correo => /^([a-z0-9_.-]+)@([da-z.-]+).([a-z.]{2,6})$/.test(correo),
            message: props => `${props.value} no es un correo electrónico válido`
        }
    },
    password: {
        type: String,
        required: [true, "La clave es obligatoria"],
        minlength: [6, "La clave debe tener al menos 6 caracteres"]
    }
}, { timestamps: true });

EsquemaPerfilUsuario.plugin(uniqueValidator);

// Agregar campo virtual para confirmación de clave secreta
EsquemaPerfilUsuario.virtual('confirmPassword')
    .get(function () { return this._confirmacionClaveSecreta; })
    .set(function (value) { this._confirmacionClaveSecreta = value; });

// Gancho de pre-validación para verificar si las claves secretas coinciden
EsquemaPerfilUsuario.pre('validate', function (next) {
    if (this.password !== this.confirmPassword) {
        this.invalidate('confirmPassword', 'Las claves deben coincidir');
    }
    next();
});

// Gancho de pre-guardado para hashear la clave secreta
EsquemaPerfilUsuario.pre('save', async function (next) {
    if (this.isModified('password')) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

// Exportar el esquema
export default mongoose.model('PerfilUsuario', EsquemaPerfilUsuario);
