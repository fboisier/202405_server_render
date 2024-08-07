import { model, Schema } from 'mongoose';
import uniqueValidator  from 'mongoose-unique-validator';

const ProyectoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "¡El nombre es obligatorio!"],
        unique: true,
    },
    fecha_vencimiento: {
        type: Date,
        required: [true, "¡La fecha de vencimiento es obligatoria!"]
    },
    estado: {
        type: String,
        enum: ['BACK', 'PROG','COMP'],
        default: 'BACK',
    }
}, { timestamps: true });

ProyectoSchema.plugin(uniqueValidator);
const Proyecto = model("Proyecto", ProyectoSchema);

export default Proyecto;
