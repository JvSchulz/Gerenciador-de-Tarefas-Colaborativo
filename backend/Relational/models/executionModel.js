import { db } from '../../config/db.js';

const Execution = {
  async create(data) {
    return db('executions')
      .insert(data)
      .returning('*');
  },

   async findExecutionHistory(userId) {
    return db('executions as e')
      .join('registers as r', 'e.register_id', 'r.id')
      .join('users as u', 'e.user_id', 'u.id')
      .where(function () {
        this.where('r.creator_id', userId)
            .orWhereIn('r.id', function () {
              this.select('register_id')
                  .from('sharing')
                  .where('user_id', userId);
            });
      })
      .select(
        'r.title as register',
        'u.name as user',
        'e.action_type',
        'r.id',
        'r.title',
        'e.executed_at'
      )
      .orderBy('e.executed_at', 'desc');
  }
};

export default Execution;