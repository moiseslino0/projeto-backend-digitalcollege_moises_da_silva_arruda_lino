const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userController = {
  create: async (req, res) => {
    try {
      const { firstname, surname, email, password, confirmPassword } = req.body;
      if (!firstname || !surname || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'Dados requiridos estão faltando' });
      }
      if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Senhas não conferem' });
      }

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email já cadastrado' });
      }

      await User.create({ firstname, surname, email, password });
      return res.status(201).send();
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: 'Erro ao cadastrar usuário' });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, {
        attributes: ['id', 'firstname', 'surname', 'email']
      });
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      return res.status(200).json(user);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: 'Erro ao buscar usuário' });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { firstname, surname, email } = req.body;
      
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      await user.update({ firstname, surname, email });
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: 'Erro ao atualizar usuário' });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      await user.destroy();
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: 'Erro ao deletar usuário' });
    }
  },

  generateToken: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios' });
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: 'Usuário/Senha incorretos' });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(400).json({ message: 'Usuário/Senha incorretos' });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'meu_incrivel_segredo_jwt_123', {
        expiresIn: '1d' // Token válido por um dia
      });

      return res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: 'Erro na geração de token' });
    }
  }
};

module.exports = userController;
