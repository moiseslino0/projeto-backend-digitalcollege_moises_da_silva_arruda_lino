const { Router } = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = Router();

// Endpoint de login (Geração de Token)
router.post('/token', userController.generateToken);

// Endpoints de Usuário
router.post('/', userController.create);
router.get('/:id', userController.getById);

// Rotas protegidas (Auth Middleware)
router.put('/:id', authMiddleware, userController.update);
router.delete('/:id', authMiddleware, userController.delete);

module.exports = router;
