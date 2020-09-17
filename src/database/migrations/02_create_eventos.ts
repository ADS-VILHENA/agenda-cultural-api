import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('eventos', table => {
        table.increments('id').primary();
        table.string('titulo').notNullable();
        table.string('descricao').notNullable();
        table.string('endereco').notNullable();
        table.string('localizacao').notNullable();
        table.string('telefone').notNullable();
        table.date('data').notNullable();
        table.string('hora').notNullable();
        table.string('logo');
        table.string('status').defaultTo('A');
        
        table.integer('id_categoria')
            .notNullable()
            .references('id')
            .inTable('categorias');

        table.integer('id_organizador')
            .notNullable()
            .references('id')
            .inTable('organizador');
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('eventos');
}