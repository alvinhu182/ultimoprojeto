import * as express from "express";
const auth = express.Router();
import UserController from '../controllers/UserController';

const userCtrl = new UserController(null);

auth.get('/confirm-email', (req, res) => {
    res.render('confirm-email')
});

auth.post('/confirm-email', async (req, res) => {
    // TODO: Adicionar confirmação de e-mail
    const result: any = await userCtrl.confirmEmail(req.body.pin)
    res.statusCode = result.statusCode;
    res.send({msg: result.msg})
});

export { auth };