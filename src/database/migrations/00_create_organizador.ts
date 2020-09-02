import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('organizador', table => {
        table.increments('id').primary();
        table.string('nome').notNullable();
        table.string('telefone').notNullable();
        table.string('endereco').notNullable();
        table.string('email').notNullable();
        table.string('senha').notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('organizador');
}