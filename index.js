import express from 'express';
import { engine } from 'express-handlebars';
import bodyParser from 'body-parser';
import session from 'express-session';
import flash from 'express-flash';
import SpazaSuggest from './spaza-suggest.js';
import Routes from './routes/routes.js'
import pgp from 'pg-promise';

const app = express();

//DB connection 
const connectionString = process.env.DATABASE_URL || 'postgres://jhccjlrp:RbqnVuT7nsr3rFlU21wqtty2UeJWhRGf@flora.db.elephantsql.com/jhccjlrp';
const postgresP = pgp();
const db = postgresP(connectionString);

const spazaSuggest = SpazaSuggest(db);
const routes = Routes(spazaSuggest);

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }));
  
  app.use(flash());

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', 'views');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', function(req, res){
    res.render('register');
});

app.post('/client/register', routes.registerSpazaClient);
app.post('/client/login', routes.spazaClientLogin);
app.post('/client/suggest', routes.clientSuggest);
app.get('/client/suggestions', routes.clientSuggestions);



const PORT = 8080;

app.listen(PORT, function(){
    console.log(`Server running at port ${PORT}`)
});