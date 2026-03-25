const { Category } = require('../models');

const categoryController = {
  search: async (req, res) => {
    try {
      let { limit = 12, page = 1, fields, use_in_menu } = req.query;
      limit = parseInt(limit);
      page = parseInt(page);

      const queryOptions = {};

      if (limit !== -1) {
        queryOptions.limit = limit;
        queryOptions.offset = (page - 1) * limit;
      }

      if (fields) {
        queryOptions.attributes = fields.split(',').map(f => f.trim());
      } else {
        queryOptions.attributes = ['id', 'name', 'slug', 'use_in_menu'];
      }

      const whereClause = {};
      if (use_in_menu !== undefined) {
        whereClause.use_in_menu = use_in_menu === 'true' || use_in_menu === '1' || use_in_menu === true;
      }

      const { count, rows } = await Category.findAndCountAll({
        where: whereClause,
        ...queryOptions
      });

      return res.status(200).json({
        data: rows,
        total: count,
        limit,
        page
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: 'Erro ao buscar categorias', error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id, {
        attributes: ['id', 'name', 'slug', 'use_in_menu']
      });
      if (!category) {
        return res.status(404).json({ message: 'Categoria não encontrada' });
      }
      return res.status(200).json(category);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: 'Erro ao buscar categoria' });
    }
  },

  create: async (req, res) => {
    try {
      const { name, slug, use_in_menu } = req.body;
      if (!name || !slug) {
        return res.status(400).json({ message: 'Nome e slug são obrigatórios' });
      }

      await Category.create({ name, slug, use_in_menu });
      return res.status(201).send();
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: 'Erro ao criar categoria', error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, slug, use_in_menu } = req.body;

      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({ message: 'Categoria não encontrada' });
      }

      await category.update({ name, slug, use_in_menu });
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: 'Erro ao atualizar categoria' });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({ message: 'Categoria não encontrada' });
      }

      await category.destroy();
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: 'Erro ao deletar categoria' });
    }
  }
};

module.exports = categoryController;
