import * as express from "express";
import moment from 'moment';

import ReportCategoryController from '../controllers/ReportCategoryController';
import ReportProductController from '../controllers/ReportProductController';
import ReportUserController from '../controllers/ReportUserController';

const dashboard = express.Router();

dashboard.get('/users/quantity', async (req, res) => {

    const reportUserCtrl = new ReportUserController();
    const result = await reportUserCtrl.get(req.query);

    const data = result.map((r: any) => r.sum);
    let labels: any = result.map((r: any) => moment(r._id).format('DD/MM/YYYY'));

    res.statusCode = 200;
    res.json({
        labels,
        datasets: [
          {
            label: 'Usuários',
            data,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          }
        ]
    });
});

dashboard.get('/orders/by-product', async (req: any, res) => {
  const reportProductCtrl = new ReportProductController();
  const result = await reportProductCtrl.get(req.query);

  const data = result.map((r: any) => r.sum);
  const labels = result.map((r: any) => r._id);

    res.statusCode = 200;
    res.json({
        labels,
        datasets: [
            {
            label: '# of Votes',
            data,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
            },
        ],
    });
});

dashboard.get('/categories/best-sellers', async (req: any, res) => {
  const reportCategoryCtrl = new ReportCategoryController();
  const result = await reportCategoryCtrl.get(req.query);

  const data = result.map((r: any) => r.sum);
  const labels = result.map((r: any) => r._id);

  
    res.statusCode = 200;
    res.json({
        labels,
        datasets: [
          {
            label: 'Categorias mais vendidas',
            data,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
        ],
      })
})

export { dashboard };