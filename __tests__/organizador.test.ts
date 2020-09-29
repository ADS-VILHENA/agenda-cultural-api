import request from 'supertest';
import app from '../src/server';

// beforeEach(() => {
//     return login();
// });

describe('Login', () =>{
    it('deve logar na api', async (done) => {
       const response = await request(app).post('/organizador/login')
       .send({
           email: 'email@org.com',
           senha: 'senha123'
       });
       expect(response.status).toEqual(200)
       done();
    });

});

describe('Funçoes de organizador', () => {
    it('deve alterar usuário', async (done) => {
        const response = await request(app).put('/organizador')
        .send({
            nome: 'Teste alteração'
        });
        expect(response.status).toEqual(200)
        done();
    });
});