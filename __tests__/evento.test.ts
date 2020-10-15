import request from 'supertest';
import app from '../src/server';

describe('Testes funções dos eventos', () => {

    it('deve visualizar os eventos de uma categoria', async (done) => {
        const response = await request(app).get('/categoria/1/eventos');
        expect(response.status).toEqual(200)
        done();
    });


    it('deve visualizar os detalhes de um evento', async (done) => {
        const response = await request(app).get('/detalhes/1');
        expect(response.status).toEqual(200)
        done();
    });
    
    
    it('deve visualizar os eventos do organizador', async (done) => {
        const response = await request(app).get('/organizador/eventos');
        expect(response.status).toEqual(200)
        done();
    });

    it('deve cadastrar um evento', async (done) => {
        const response = await request(app).post('/evento')
        .field({
            titulo: 'evento',
            descricao: 'desc',
            endereco: 'endereco teste',
            localizacao: 'bar monaco',
            telefone: '4333225678',
            data: '2020-10-30',
            hora: '19:30',
            id_categoria: 1
        })
        .attach('logo', 'teste.png');
        expect(response.status).toEqual(201)
        done();
    })
})