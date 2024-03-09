import { Router } from 'express';

const routes = new Router();
routes.get('/cliente', (req, res) => {
  return res.json({ ok: true });
});

export default routes;
