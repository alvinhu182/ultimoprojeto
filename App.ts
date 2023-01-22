import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import session from 'express-session';
import express from 'express';
import { sequelize, mongooseDb } from './db';
import * as AdminJSSequelize from '@adminjs/sequelize';
import * as AdminJSMongoose from '@adminjs/mongoose'

import { Category } from './model/category.entity';
import { Product } from './model/product.entity';
import { User } from './model/user.entity';
import bcrypt from "bcrypt";

import { auth } from './routes/auth';
import { dashboard } from './routes/dashboard';

import hbs from 'hbs';
import UserController from './controllers/UserController';
import { ReportProduct } from './model/report_product.entity';
import { ReportUser } from './model/report_user.entity';
import { ReportCategory } from './model/report_category.entity';

const path = require('node:path');
const mysqlStore = require('express-mysql-session')(session);

require('dotenv').config()
const bodyParser = require('body-parser');
const PORT = process.env.PORT_HOST;

AdminJS.registerAdapter({
  Resource: AdminJSSequelize.Resource,
  Database: AdminJSSequelize.Database
})

AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database
})

const ROOT_DIR = __dirname;

const generateResource = (model: object, hideElements: any = null, actions: any = null) => {
  return {
    resource: model,
    options: {
      properties: {
        ...hideElements,
        createdAt: {
          isVisible: {
            list: true, edit: false, create: false, show: true
          }
        },
        updatedAt: {
          isVisible: {
            list: true, edit: false, create: false, show: true
          }
        }
      },
      actions: actions
    }
  }
}

const userCtrl = new UserController(ROOT_DIR);

const start = async () => {
  const adminOptions = {
    resources: [
      generateResource(Product),
      generateResource(Category),
      generateResource(ReportCategory),
      generateResource(ReportProduct),
      generateResource(ReportUser),
      generateResource(
        User, 
        {
            password: {
                type: 'password',
                isVisible: {
                    list: false, edit: true, create: true, show: false
                }
            },
            active: {
                isVisible: {
                    list: true, edit: false, create: false, show: true
                }
            },
            pin: {
                isVisible: {
                    list: false, edit: false, create: false, show: false
                }
            }
        },
        {
            new: {
                before: async function(request: any){
                    if(request.payload.password){
                        request.payload.password = await bcrypt.hash(request.payload.password, 10)
                    }
                    request.payload.pin = (Math.floor(100000 + Math.random() * 900000)).toString();
                    
                    userCtrl.sendToken(request.payload.pin, request.payload.email, request.payload.name)
                    
                    return request;
                }
            },
            edit: {
                before: async function(request: any){
                    if(request.payload.password){
                        if(request.payload.password.indexOf('$2b$10') === -1 && request.payload.password.length < 40){
                            request.payload.password = await bcrypt.hash(request.payload.password, 10)
                        }
                    }
                    return request;
                }
            }
        }
    ),
    ],
    rootPath: '/admin',
    dashboard: {
      handle: async () => { },
      component: AdminJS.bundle('./components/dashboard')
    },
    branding: {
      favicon: 'https://artpoin.com/wp-content/uploads/2020/02/Sem-t%C3%ADtulo-2.png',
      logo: 'https://artpoin.com/wp-content/uploads/2020/02/Sem-t%C3%ADtulo-2.png',
      companyName: 'Candy Shop '
    }
  };

  const app = express();
  sequelize.sync()
    .then((result) => console.log(''))
    .catch((err) => console.log(err))

  mongooseDb.once("open", () => {
    console.log("Conexão ao aberta com sucesso");
  })

  const admin = new AdminJS(adminOptions);

  const sessionStore = new mysqlStore({
    connectionLimit: 10,
    password: process.env.DB_PASS,
    user: process.env.DB_USER,
    database: process.env.MYSQL_DB,
    host: process.env.URL_HOST,
    port: process.env.DB_PORT,
    createDatabaseTable: true
  });

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
        authenticate: async function(email, password){
            const user = await User.findOne({
                where: {
                    email: email
                }
            });
            return user;
           
            
        },
        cookieName: 'adminjs',
        cookiePassword: 'MfiklRA66ur7CHl0ESM8768JtdFUBkGR'
    },
    null,
    {
        store: sessionStore,
        resave: true,
        saveUninitialized: true,
        secret: 'MfiklRA66ur7CHl0ESM8768JtdFUBkGR',
        cookie: {
            httpOnly: process.env.NODE_ENV === 'production',
            secure: process.env.NODE_ENV === 'production'
        },
        name: 'adminjs', 
    }
  );
  
    app.use(express.json())
    hbs.registerPartials(path.join(__dirname, 'views'))

    app.set('view engine', '.hbs');

    app.use(admin.options.rootPath, adminRouter)
    
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use("/auth", auth);
    app.use("/dashboard", dashboard);
  
    app.listen(PORT, () => {
        console.log("Projeto rodando");
    })
}

start();