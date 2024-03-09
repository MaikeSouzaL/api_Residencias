import pool from '../../config/database';

class ClientController {
  async index(req, res) {
    try {
      const query = `
        SELECT 
          c.*, 
          co.*
        FROM 
          clientes c
        JOIN 
          coordenadas co ON c.id = co.cliente_id
      `;

      const result = await pool.query(query);

      return res.json(result.rows);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      return res.status(500).json({ error: 'Erro ao buscar clientes' });
    }
  }
  async store(req, res) {
    try {
      // Extrair dados do corpo da solicitação
      const { nome, email, coordenada_x, coordenada_y } = req.body;

      // Iniciar uma transação
      const client = await pool.connect();

      try {
        // Inserir um novo cliente
        const resultCliente = await client.query(
          'INSERT INTO clientes (nome, email) VALUES ($1, $2) RETURNING id',
          [nome, email],
        );
        const clienteId = resultCliente.rows[0].id;

        // Inserir uma nova coordenada associada ao cliente
        await client.query(
          'INSERT INTO coordenadas (cliente_id, coordenada_x, coordenada_y) VALUES ($1, $2, $3)',
          [clienteId, coordenada_x, coordenada_y],
        );

        // Commit na transação
        await client.query('COMMIT');

        // Retornar uma resposta de sucesso
        return res
          .status(201)
          .json({ message: 'Cliente cadastrado com sucesso' });
      } catch (error) {
        // Rollback na transação em caso de erro
        await client.query('ROLLBACK');
        throw error;
      } finally {
        // Liberar o cliente da pool de conexões
        client.release();
      }
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      return res.status(500).json({ error: 'Erro ao cadastrar cliente' });
    }
  }

  async update(req, res) {
    try {
      const clienteId = req.params.id;

      const { servico_realizado } = req.body;

      await pool.query(
        'UPDATE clientes SET servico_realizado = $1 WHERE id = $2',
        [servico_realizado, clienteId],
      );

      return res.json({ message: 'Serviço realizado atualizado com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar serviço realizado:', error);
      return res
        .status(500)
        .json({ error: 'Erro ao atualizar serviço realizado' });
    }
  }
}

export default new ClientController();
