import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('categorias', table => {
        table.increments('id').primary();
        table.string('nome').notNullable();
        table.string('descricao').notNullable();
        table.string('image').notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('categorias');
}