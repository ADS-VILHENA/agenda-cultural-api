import request from 'supertest';
import app from '../src/server';


describe('Testes funções de organizador', () =>{

    it('deve criar usuário', async (done) => {
        const response = await request(app).post('/organizador')
        .send({
            nome: 'Organizador criado',
            telefone: '4833225678',
            endereco: 'Rua 678, 892, Jardim América',
            email: 'cadastro@hotmail.com',
            senha: 'senha123'
        });
        expect(response.status).toEqual(200)
        done();
    });

    
    it('deve logar na api', async (done) => {
       const response = await request(app).post('/organizador/login')
       .send({
           email: 'email@org.com',
           senha: 'senha123'
       });
       expect(response.status).toEqual(200)
       done();
    });


    it('deve alterar usuário', async (done) => {
        const response = await request(app).put('/organizador')
        .set('Authorization', `Bearer ${process.env.TOKEN}`)
        .send({
            nome: 'Teste alteração'
        });
        expect(response.status).toEqual(200)
        done();
    });


    it('deve deletar conta de usuário', async (done) => {
        const response = await request(app).delete('/organizador')
        .set('Authorization', `Bearer ${process.env.TOKEN}`)
        .send();
        expect(response.status).toEqual(200)
        done();
    });
});
