import request from 'supertest';
import app from '../src/server';

describe('Testes funções das categorias', () => {

    it('deve visualizar todas as categorias', async (done) => {
        const response = await request(app).get('/')
        expect(response.status).toEqual(200)
        done();
    });

    it('deve visualizar os eventos de uma categoria', async (done) => {
        const response = await request(app).get(`/categoria/${1}/eventos`)
        expect(response.status).toEqual(200)
        done();
    });


    it('deve cadastrar uma categoria', async (done) => {
        const response = await request(app).post('/categoria')
        .set('Authorization', `Bearer ${process.env.TOKEN}`)
        .field({
            nome: 'Literatura',
            descricao: 'Categoria voltada para eventos relacionados a literatura'
        })
        .attach('imagem', 'teste.png');
        expect(response.status).toEqual(200)
        done();
    });


    it('deve alterar uma categoria', async (done) => {
        const response = await request(app).put(`/categoria/${1}`)
        .set('Authorization', `Bearer ${process.env.TOKEN}`)
        .send({
            nome: 'Culinária'
        })
        expect(response.status).toEqual(200)
        done();
    });


    it('deve deletar uma categoria', async (done) => {
        const response = await request(app).delete(`/categoria/${1}`)
        .set('Authorization', `Bearer ${process.env.TOKEN}`)
        expect(response.status).toEqual(200)
        done();
    });


});