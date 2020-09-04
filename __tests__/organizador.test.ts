import request from 'supertest';
import app from '../src/server';


describe("TDD deletar organizador", () => {
    it("Erro ao deletar uma conta de organizador inexistente", async () => {
        const res = await request(app)
            .delete('/organizador/8')
        expect(res.status).toEqual(404)
    })
})    

describe("TDD create admin", () => {
    it("Should create a new administrator", async () => {  
        const data = {
                nome: 'Organizador',
                telefone: '69984595945',
                endereco: 'rua das flores, jardim são joão',
                email: 'email@org.com',
                senha: 'senha123'
            };
    
        const res = await request(app)
            .post('/organizador')
            .send(data)
        expect(res.status).toEqual(201)
    })
})

    