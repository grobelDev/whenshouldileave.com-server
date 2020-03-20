const DirectionsService = {
  getAllDirections(knex) {
    return knex.select('*').from('directions');
  },
  insertDirections(knex, newDirections) {
    return knex
      .insert(newDirections)
      .into('directions')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  }
  // getById(knex, id) {
  //   return knex
  //     .from('directions')
  //     .select('*')
  //     .where('id', id)
  //     .first();
  // },
  // deleteDirections(knex, id) {
  //   return knex('directions')
  //     .where({ id })
  //     .delete();
  // },
  // updateDirections(knex, id, newDirectionsFields) {
  //   return knex('directions')
  //     .where({ id })
  //     .update(newDirectionsFields);
  // }
};

module.exports = DirectionsService;
