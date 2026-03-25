const { Product, ProductImage, ProductOption, Category, ProductCategory } = require('../models');
const { Op } = require('sequelize');

const productController = {
  search: async (req, res) => {
    try {
      let { limit = 12, page = 1, fields, match, category_ids, 'price-range': priceRange } = req.query;
      limit = parseInt(limit);
      page = parseInt(page);

      const whereClause = {};

      if (match) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${match}%` } },
          { description: { [Op.like]: `%${match}%` } }
        ];
      }

      if (priceRange) {
        const [min, max] = priceRange.split('-').map(Number);
        whereClause.price = { [Op.between]: [min, max] };
      }

      const includeClause = [
        { model: ProductImage, as: 'images', attributes: ['id', 'path'] },
        { model: ProductOption, as: 'options', attributes: ['id', 'title', 'shape', 'radius', 'type', 'values'] },
        { model: Category, as: 'categories', attributes: ['id'] }
      ];

      if (category_ids) {
        const catIds = category_ids.split(',').map(Number);
        includeClause[2].where = { id: { [Op.in]: catIds } };
      }

      const queryOptions = {
        where: whereClause,
        include: includeClause,
        distinct: true
      };

      if (limit !== -1) {
        queryOptions.limit = limit;
        queryOptions.offset = (page - 1) * limit;
      }

      if (fields) {
        queryOptions.attributes = fields.split(',').map(f => f.trim());
      }

      const { count, rows } = await Product.findAndCountAll(queryOptions);

      // Mapear os dados para retornar no formato da doc
      const data = rows.map(prod => {
        const p = prod.toJSON();
        return {
          ...p,
          options: p.options.map(opt => ({
            ...opt,
            values: opt.values ? opt.values.split(',') : [] // converte pra array
          })),
          category_ids: p.categories ? p.categories.map(c => c.id) : []
        };
      });

      return res.status(200).json({
        data,
        total: count,
        limit,
        page
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: 'Erro ao buscar produtos' });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id, {
        include: [
          { model: ProductImage, as: 'images', attributes: ['id', 'path'] },
          { model: ProductOption, as: 'options', attributes: ['id', 'title', 'shape', 'radius', 'type', 'values'] },
          { model: Category, as: 'categories', attributes: ['id'] }
        ]
      });

      if (!product) return res.status(404).json({ message: 'Produto não encontrado' });

      const p = product.toJSON();
      const response = {
        ...p,
        options: p.options.map(opt => ({
          ...opt,
          values: opt.values ? opt.values.split(',') : []
        })),
        category_ids: p.categories ? p.categories.map(c => c.id) : []
      };
      delete response.categories;

      return res.status(200).json(response);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: 'Erro ao buscar produto' });
    }
  },

  create: async (req, res) => {
    try {
      const { enabled, name, slug, stock, description, price, price_with_discount, category_ids, images, options } = req.body;
      if (!name || !slug || !price || price_with_discount === undefined) {
        return res.status(400).json({ message: 'Campos obrigatórios faltando na criação do produto' });
      }

      const product = await Product.create({
        enabled, name, slug, stock, description, price, price_with_discount
      });

      if (category_ids && category_ids.length > 0) {
        await product.addCategories(category_ids);
      }

      if (images && images.length > 0) {
        for (const img of images) {
          await ProductImage.create({ product_id: product.id, enabled: true, path: img.content }); // base64 simulado em path apenas para fins do projeto
        }
      }

      if (options && options.length > 0) {
        for (const opt of options) {
          await ProductOption.create({
            product_id: product.id,
            title: opt.title,
            shape: opt.shape || 'square',
            radius: opt.radius ? parseInt(opt.radius) : 0,
            type: opt.type || 'text',
            values: Array.isArray(opt.values) ? opt.values.join(',') : ''
          });
        }
      }

      return res.status(201).send();
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: 'Erro ao criar produto' });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { enabled, name, slug, stock, description, price, price_with_discount, category_ids, images, options } = req.body;

      const product = await Product.findByPk(id);
      if (!product) return res.status(404).json({ message: 'Produto não encontrado' });

      await product.update({ enabled, name, slug, stock, description, price, price_with_discount });

      if (category_ids) {
        await product.setCategories(category_ids);
      }

      if (images) {
        for (const img of images) {
          if (img.deleted && img.id) {
            await ProductImage.destroy({ where: { id: img.id } });
          } else if (img.id && img.content) {
            await ProductImage.update({ path: img.content }, { where: { id: img.id } });
          } else if (img.content) {
            await ProductImage.create({ product_id: id, path: img.content });
          }
        }
      }

      if (options) {
        for (const opt of options) {
          if (opt.deleted && opt.id) {
            await ProductOption.destroy({ where: { id: opt.id } });
          } else if (opt.id) {
            // update
            await ProductOption.update({
              title: opt.title,
              shape: opt.shape,
              radius: opt.radius ? parseInt(opt.radius) : undefined,
              type: opt.type,
              values: Array.isArray(opt.values) ? opt.values.join(',') : undefined
            }, { where: { id: opt.id } });
          } else {
            // create
            await ProductOption.create({
              product_id: id,
              title: opt.title,
              shape: opt.shape || 'square',
              radius: opt.radius ? parseInt(opt.radius) : 0,
              type: opt.type || 'text',
              values: Array.isArray(opt.values) ? opt.values.join(',') : ''
            });
          }
        }
      }

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: 'Erro ao atualizar produto' });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);
      if (!product) return res.status(404).json({ message: 'Produto não encontrado' });

      await product.destroy();
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: 'Erro ao deletar produto' });
    }
  }
};

module.exports = productController;
