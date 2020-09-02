import Knex from 'knex';

export async function seed(knex: Knex) {
    knex('categorias').insert([
        {nome: 'Esportes', descricao: 'teste categorias', image: '-'},
        {nome: 'Teatral', descricao: 'teste categorias', image: '-'},
        {nome: 'Musical', descricao: 'teste categorias', image: '-'},
        {nome: 'Literatura', descricao: 'teste categorias', image: '-'},
        {nome: 'Artes Marciais', descricao: 'teste categorias', image: '-'},
        {nome: 'Gastronomia', descricao: 'teste categorias', image: '-'},
        {nome: 'Festas', descricao: 'teste categorias', image: '-'},
        {nome: 'Danças', descricao: 'teste categorias', image: '-'},
    ]);
}