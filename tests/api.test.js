const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Suite de Testes da API (Endpoints Básicos)', () => {
  let userToken = '';

  it('Deve criar um usuário com sucesso (POST /v1/user)', async () => {
    const res = await request(app)
      .post('/v1/user')
      .send({
        firstname: 'Moisés',
        surname: 'Lino',
        email: 'moises@test.com',
        password: 'password123',
        confirmPassword: 'password123'
      });
    expect(res.statusCode).toEqual(201);
  });

  it('Deve gerar o Token de Autenticação (POST /v1/user/token)', async () => {
    const res = await request(app)
      .post('/v1/user/token')
      .send({
        email: 'moises@test.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    userToken = res.body.token;
  });

  it('Deve ler o usuário pelo ID 1 (GET /v1/user/1)', async () => {
    const res = await request(app).get('/v1/user/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body.firstname).toEqual('Moisés');
    expect(res.body.email).toEqual('moises@test.com');
  });

  it('Deve criar uma Categoria exigindo Autenticação (POST /v1/category)', async () => {
    // Tenta criar sem token
    let res = await request(app)
      .post('/v1/category')
      .send({ name: 'Tênis', slug: 'tenis', use_in_menu: true });
    expect(res.statusCode).toEqual(401);

    // Cria com token
    res = await request(app)
      .post('/v1/category')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Tênis', slug: 'tenis', use_in_menu: true });
    expect(res.statusCode).toEqual(201);
  });

  it('Deve retornar erros 400 em formatação errada ou dados faltantes', async () => {
    const res = await request(app)
      .post('/v1/product')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Apenas Nome' });
    
    // Faltou price_with_discount e slug
    expect(res.statusCode).toEqual(400);
  });
});
