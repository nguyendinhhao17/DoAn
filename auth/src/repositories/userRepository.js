const supabase = require('../config/supabase');

class UserRepository {
  async createUser(user) {
    const { data, error } = await supabase
      .from('users')
      .insert([{ username: user.username, password: user.password }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error('Username already taken');
      }
      throw error;
    }

    return data;
  }

  async getUserByUsername(username) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async deleteTestUsers() {
    const { error } = await supabase
      .from('users')
      .delete()
      .like('username', 'test%');

    if (error) throw error;
  }
}

module.exports = UserRepository;
