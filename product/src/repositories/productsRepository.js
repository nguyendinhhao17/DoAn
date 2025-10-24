const supabase = require('../config/supabase');

class ProductsRepository {
  async create(product, userId) {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: product.name,
        description: product.description || '',
        price: product.price,
        created_by: userId
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findById(productId) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async findAll() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findByIds(ids) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .in('id', ids);

    if (error) throw error;
    return data || [];
  }
}

module.exports = ProductsRepository;
