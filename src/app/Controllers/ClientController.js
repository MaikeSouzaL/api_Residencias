import pool from '../../config/database';

class ClientController {
  async show(req, res) {
    try {
      const query = `SELECT c.*, co.* FROM clientes c JOIN coordenadas co ON c.id = co.cliente_id`;

      const result = await pool.query(query);
      const clientes = result.rows;
      return res.json(clientes);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar clientes' });
    }
  }
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
        ORDER BY 
          SQRT(POWER(co.coordenada_x - 0, 2) + POWER(co.coordenada_y - 0, 2))
      `;

      const result = await pool.query(query);
      const clientes = result.rows;

      return res.json(clientes);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      return res.status(500).json({ error: 'Erro ao buscar clientes' });
    }
  }

  async store(req, res) {
    try {
      // Extrair dados do corpo da solicitação
      const { nome, email, telefone, coordenada_x, coordenada_y } = req.body;
      console.log(nome, email, coordenada_x, coordenada_y);

      // Iniciar uma transação
      const client = await pool.connect();

      try {
        // Inserir um novo cliente
        const resultCliente = await client.query(
          'INSERT INTO clientes (nome, email, telefone) VALUES ($1, $2, $3) RETURNING id',
          [nome, email, telefone],
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
      console.log(clienteId);

      await pool.query(
        'UPDATE clientes SET servico_realizado = $1 WHERE id = $2',
        [servico_realizado, clienteId],
      );

      return res.json({ message: 'Serviço realizado atualizado com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar serviço realizado:', error);
      return ress
        .status(500)
        .json({ error: 'Erro ao atualizar serviço realizado' });
    }
  }
  async updateclient(req, res) {
    try {
      const { id } = req.params;
      const { nome, coordenada_x, coordenada_y, servico_realizado } = req.body;
      const clienteQuery = 'SELECT * FROM clientes WHERE id = $1';
      const clienteResult = await pool.query(clienteQuery, [id]);
      const cliente = clienteResult.rows[0];

      if (!cliente) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }
      const client = await pool.connect();
      try {
        await client.query(
          'UPDATE clientes SET nome = $1, servico_realizado = $2 WHERE id = $3',
          [nome, servico_realizado, id],
        );
        await client.query(
          'UPDATE coordenadas SET coordenada_x = $1, coordenada_y = $2 WHERE cliente_id = $3',
          [coordenada_x, coordenada_y, id],
        );
        await client.query('COMMIT');
        return res.json({ message: 'Cliente atualizado com sucesso' });
      } catch (error) {
        // Rollback na transação em caso de erro
        await client.query('ROLLBACK');
        return res.status(500).json({ error: 'Erro ao atualizar cliente' });
      } finally {
        client.release();
      }
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar cliente' });
    }
  }
  async destroy(req, res) {
    try {
      const { id } = req.params;
      console.log(id);
      const client = await pool.connect();

      try {
        // Exclua as coordenadas associadas ao cliente
        await client.query('DELETE FROM coordenadas WHERE cliente_id = $1', [
          id,
        ]);

        // Em seguida, exclua o cliente
        await client.query('DELETE FROM clientes WHERE id = $1', [id]);

        // Commit da transação
        await client.query('COMMIT');

        return res.json({ message: 'Cliente excluído com sucesso' });
      } catch (error) {
        // Em caso de erro, reverta a transação
        await client.query('ROLLBACK');
        return res.status(500).json({ error: 'Erro ao excluir cliente' });
      } finally {
        client.release();
      }
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao excluir cliente' });
    }
  }
  async updateServicoRealizado(req, res) {
    try {
      const { id } = req.params;
      const { servico_realizado } = req.body;

      await pool.query(
        'UPDATE clientes SET servico_realizado = $1 WHERE id = $2',
        [servico_realizado, id],
      );

      return res.json({ message: 'Serviço realizado atualizado com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar serviço realizado:', error);
      return res.status(500).json({ error: 'Erro ao atualizar serviço realizado' });
    }
  }
}

export default new ClientController();
