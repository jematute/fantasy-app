import * as express from "express";
// tslint:disable-next-line: ordered-imports
import * as bodyParser from "body-parser";
import { Routes } from "./routes";
import { ClientSettings } from './client-settings';

class App {

    public app: express.Application;
    public routePrv: Routes = new Routes();
    public settings = ClientSettings.getInstance();
    constructor() {
        this.app = express();
        this.config();
        this.routePrv.routes(this.app);
    }

    private config(): void{
        // support application/json type post data
        this.app.use(bodyParser.json());
        // support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));

        this.app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
    }
}

export default new App().app;
