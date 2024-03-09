import { json } from 'express';

class ClientController {
  async store(req, res) {
    return res.json({ message: 'Hello World 🌍' });
  }
}
export default new ClientController();
