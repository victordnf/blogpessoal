import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('Testes dos Módulos Usuário e Auth (e2e)', () => {

  let token: any;
  let usuarioId: any;
  let app: INestApplication;
 

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: 'root',
          database: 'db_blogpessoal_teste',
          autoLoadEntities: true,
          synchronize: true,
          logging: false,
          dropSchema: true
        }),
        AppModule
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    });

    afterAll(async () =>{
      await app.close();
  });

  it('01 - Deve cadastrar usuário.', async () => {
    const resposta = await request (app.getHttpServer()).post('/usuarios/cadastrar').send({
      nome: 'Root',
      usuario: 'teste@teste.com',
      senha: '12345678',
      foto: ' '
    });
    expect(201)

    usuarioId = resposta.body.id;
  })

  it('02 - Deve autentica o usuário(Login)', async () => {
    const resposta = await request (app.getHttpServer()).post('/auth/logar').send({
      usuario: 'teste@teste.com',
      senha: '12345678'
    })
    expect(200)
  })

  it('03 - Não deve duplicar o usuário', async () => {
    return request(app.getHttpServer()).post('/usuarios/cadastrar').send({
      nome: 'Root',
      usuario: 'teste@teste.com',
      senha: '12345678',
      foto: ' '
    })
    expect(400)
  })
  
  it('04 - Deve lsitar todos os usuários', async () => {
     request (app.getHttpServer()).get('/usuario/all').set('Authorization', `${token}`).send({})
    expect (200)
  })

  it('05 - Deve atualizar um usuário', async () => {
     request (app.getHttpServer())
    .put('/usuarios/atualizar').set('Authorization', `${token}`).send({
      id: usuarioId,
      nome: 'Victor',
      usuario: 'teste@teste.com',
      senha: '12345678',
      foto: ' '
    })
    .expect(200)
    .then(resposta => {
      expect('Root Atualizado').toEqual(resposta.body.name);
    });
  });

});