import { Router } from 'express';
import { getProyectos, crearProyecto, actualizarProyecto, eliminarProyecto } from '../controllers/proyecto.controller.js';
import autenticarJWT from '../../config/jwt.config.js'

const router = Router();

// TODAS ESTAS RUTAS PARTEN DESDE 
///api/v1/proyectos
router.get("/", autenticarJWT, getProyectos);
router.post("/", autenticarJWT, crearProyecto);
router.put("/:id", autenticarJWT, actualizarProyecto);
router.delete("/:id", autenticarJWT, eliminarProyecto);

export default router
