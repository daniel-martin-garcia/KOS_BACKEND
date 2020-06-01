var express = require('express');
var router = express.Router();
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const cors=require('cors');

// To support URL-encoded bodies
router.use(bodyParser.urlencoded({ extended: true }));

// To parse cookies from the HTTP Request
router.use(cookieParser());

router.use(cors({origin:true,credentials: true}));

router.use((req, res, next) => {
  // Get auth token from the cookies
  const authToken = req.cookies['AuthToken'];

  // Inject the user to the request
  req.user = authTokens[authToken];

  next();
});


//AUX
const getHashedPassword = (password) => {
  const sha256 = crypto.createHash('sha256');
  const hash = sha256.update(password).digest('base64');
  return hash;
}
const authTokens = {};

const generateAuthToken = () => {
  return crypto.randomBytes(30).toString('hex');
}
const users = [
  // This user is added to the array to avoid creating a new user on each restart
  {
    firstName: 'Kos',
    lastName: 'Advice',
    email: 'kos@kosadvice.es',
    // This is the SHA256 hash for value of `password`
    password: 'YNac2h83JtQBHZUmay9eXgW8TNucRPXCGjX/MWb6zD8='
  }
];


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



/* GET login page. */
router.get('/login', (req, res) => {
  res.render('login');
});

/* POST login form. */
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = getHashedPassword(password);

  const user = users.find(u => {
    return u.email === email && hashedPassword === u.password
  });

  if (user) {
    const authToken = generateAuthToken();

    // Store authentication token
    authTokens[authToken] = user;

    // Setting the auth token in cookies
    res.cookie('AuthToken', authToken);

    // Redirect user to the protected page
    res.redirect('/protected');
  } else {
    res.render('login', {
      message: 'Invalid username or password',
      messageClass: 'alert-danger'
    });
  }
});

router.get('/protected', (req, res) => {
  if (req.user) {
    res.render('protected');
  } else {
    res.render('login', {
      message: 'Please login to continue',
      messageClass: 'alert-danger'
    });
  }
});



router.get('/test', (req, res) => {
  const hashedPassword = getHashedPassword("kos");
  console.log(hashedPassword);
});

module.exports = router;
