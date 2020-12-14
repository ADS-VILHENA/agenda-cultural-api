/*
Nessa função é utilizado o pacote npm Cron

Com ele é possível programar um tempo de execução para uma função ser executada;

nesse caso é utilizado para verificar se um evento já ocorreu ou se ele ocorre hoje.

@MatheusAnciloto
*/
import knex from '../src/database/connection';
import {isToday, isPast, parseISO} from 'date-fns';
const CronJob = require('cron').CronJob;

const job = new CronJob('* * 0 * * *', async () => {

const eventos = await knex('eventos')
    .select('data', 'id')
    .whereNot('status', 'X')



let i = 0;

console.log('Cron Job executado');

//Percorre todas datas dos eventos para alterar o status de acordo com o que deve ser
while(eventos[i] != null){
    const data = eventos[i].data;

    console.log('Percorrendo o while para o evento ' + eventos[i].id);

    if(isToday(data)){
        await knex('eventos')
        .update('status', 'H')
        .where('id', eventos[i].id);
    } 
    
    else if (isPast(data)){
        await knex('eventos')
        .update('status', 'X')
        .where('id', eventos[i].id);
    }

    i++;
}

}, null, true, 'America/La_Paz')

export default job;



