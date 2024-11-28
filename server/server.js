const env = process.env.NODE_ENV || 'development';
require('dotenv').config({
  path: `.env.${env}`
});

const express = require('express')
const mysql = require('mysql')
const cors = require('cors');
const e = require('express');
const multer = require('multer');
const path = require('path');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const app = express()

const PORT = process.env.PORT || 8081;

const allowedOrigins = [
  'http://localhost:5173',
  'https://last-ereport3.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    console.log('Request origin:', origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
}));

app.options('*', (req, res) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.sendStatus(200);
});

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.use(express.json());

const db = mysql.createPool({
  host: env === 'production' 
    ? process.env.MYSQL_ADDON_HOST 
    : process.env.DB_HOST,
  user: env === 'production' 
    ? process.env.MYSQL_ADDON_USER 
    : process.env.DB_USER,
  password: env === 'production' 
    ? process.env.MYSQL_ADDON_PASSWORD 
    : process.env.DB_PASSWORD,
  database: env === 'production' 
    ? process.env.MYSQL_ADDON_DB 
    : process.env.DB_DATABASE,
  port: env === 'production' 
    ? process.env.MYSQL_ADDON_PORT 
    : process.env.DB_PORT,
  connectionLimit: 10,
  queueLimit: 0,
  waitForConnections: true
});

const sessionStore = new MySQLStore({
  clearExpired: true,
  checkExpirationInterval: 900000,
  expiration: 86400000,
  createDatabaseTable: true,
}, db);

app.use(session({
  key: 'session_cookie_name',
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: true,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined
  }
}));

app.use((req, res, next) => {
  console.log('Session data:', req.session);
  next();
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'upload/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

app.post('/register', (req, res) => {
  const { firstname, lastname, username, email, password, cpnumber } = req.body;
  
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ message: 'Database connection error' });
    }

    const sql = "INSERT INTO user_details (`firstname`, `lastname`, `username`, `email`, `password`, `cpnumber`) VALUES (?)";
    const values = [firstname, lastname, username, email, password, cpnumber];

    connection.query(sql, [values], (error, results) => {
      connection.release();
      
      if (error) {
        return res.status(500).json({ message: 'Query error' });
      }
      
      res.json({ message: 'User registered successfully' });
    });
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.end(err => {
    if (err) {
      console.error('Error closing pool:', err);
    } else {
      console.log('Pool connections closed.');
    }
    process.exit(0);
  });
});

app.post('/checkAllTables', (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt for:', username);

  const tables = ['user_details', 'admin_details', 'police_details', 'responder_details', 'unit_details', 'barangay_details'];
  let currentTableIndex = 0;

  function checkNextTable() {
    if (currentTableIndex >= tables.length) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const currentTable = tables[currentTableIndex];
    const sql = `SELECT * FROM ${currentTable} WHERE username = ? AND password = ?`;

    db.query(sql, [username, password], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: "Error checking credentials" });
      }

      if (results.length > 0) {
        // Set session data
        req.session.user = {
          id: results[0].id,
          username: username,
          table: currentTable
        };

        // Save session explicitly
        req.session.save((err) => {
          if (err) {
            console.error('Session save error:', err);
            return res.status(500).json({ message: "Session error" });
          }

          console.log('Session saved successfully:', req.session);
          return res.json({
            message: "Login Successful",
            table: currentTable,
            sessionId: req.sessionID
          });
        });
      } else {
        currentTableIndex++;
        checkNextTable();
      }
    });
  }

  checkNextTable();
});

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.send({ message: 'Logged out' });
  });
});


app.post('/a-add-unit', (req, res) => {
  const { firstname, lastname, unit, username, email, password, cpnumber } = req.body;
  const tables = ['admin_details', 'user_details', 'police_details', 'responder_details', 'unit_details', 'barangay_details'];
  let found = false;

  const checkUsername = (table, callback) => {
    db.getConnection((err, connection) => {
      if (err) return callback(err);

      const query = `SELECT * FROM ${table} WHERE username = ?`;
      connection.query(query, [username], (error, results) => {
        connection.release(); // Release connection

        if (error) return callback(error);
        if (results.length > 0) {
          found = true;
          return callback(null, true);
        }
        callback(null, false);
      });
    });
  };

  const checkAllTables = (index) => {
    if (index >= tables.length) {
      if (!found) {
        db.getConnection((err, connection) => {
          if (err) return res.status(500).json({ message: 'Database connection error' });

          const sql = "INSERT INTO unit_details (`firstname`, `lastname`, `unit`, `username`, `email`, `password`, `cpnumber`) VALUES (?)";
          const values = [firstname, lastname, unit, username, email, password, cpnumber];
          
          connection.query(sql, [values], (error, data) => {
            connection.release(); // Release connection

            if (error) return res.status(500).json(error);
            return res.json({ message: 'Unit added successfully' });
          });
        });
      } else {
        return res.status(400).json({ message: 'Username already exists' });
      }
      return;
    }

    checkUsername(tables[index], (err, exists) => {
      if (err) return res.status(500).json(err);
      if (exists) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      checkAllTables(index + 1);
    });
  };

  checkAllTables(0);
});

app.post('/u-add-police', (req, res) => {
  const { firstname, lastname, unit, rank, email, username, password, cpnumber } = req.body; // Add cpnumber here
  const tables = ['admin_details', 'user_details', 'police_details', 'responder_details', 'unit_details', 'barangay_details'];

  let found = false;

  const checkUsername = (table, callback) => {
    db.getConnection((err, connection) => {
      if (err) return callback(err);

      const query = `SELECT * FROM ${table} WHERE username = ?`;
      connection.query(query, [username], (error, results) => {
        connection.release(); // Always release the connection

        if (error) return callback(error);

        if (results.length > 0) {
          found = true;
          return callback(null, true);
        }

        callback(null, false);
      });
    });
  };

  const checkAllTables = (index) => {
    if (index >= tables.length) {
      if (!found) {
        // Insert new police officer into the police_details table
        const sql = "INSERT INTO police_details (`firstname`, `lastname`, `unit`, `rank`, `email`, `username`, `password`, `cpnumber`) VALUES (?)"; // Add cpnumber here
        const values = [firstname, lastname, unit, rank, email, username, password, cpnumber]; // Add cpnumber here
        db.getConnection((err, connection) => {
          if (err) return res.status(500).json({ message: 'Database connection error' });
          
          connection.query(sql, [values], (err, data) => {
            connection.release();
            if (err) return res.status(500).json(err);
            return res.json({ message: 'Police officer added successfully' });
          });
        });
      } else {
        return res.status(400).json({ message: 'Username already exists' });
      }
      return;
    }

    checkUsername(tables[index], (err, exists) => {
      if (err) return res.status(500).json(err);
      if (exists) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      checkAllTables(index + 1);
    });
  };

  checkAllTables(0);
});

app.post('/a-add-barangay', (req, res) => {
  const { firstname, lastname, barangay, username, email, password, cpnumber } = req.body; // Add cpnumber here
  const tables = ['admin_details', 'user_details', 'police_details', 'responder_details', 'unit_details', 'barangay_details'];

  let found = false;

  const checkUsername = (table, callback) => {
    db.getConnection((err, connection) => {
      if (err) return callback(err);

      const query = `SELECT * FROM ${table} WHERE username = ?`;
      connection.query(query, [username], (error, results) => {
        connection.release(); // Always release the connection

        if (error) return callback(error);

        if (results.length > 0) {
          found = true;
          return callback(null, true);
        }

        callback(null, false);
      });
    });
  };

  const checkAllTables = (index) => {
    if (index >= tables.length) {
      if (!found) {
        // Insert new barangay into the barangay_details table
        const sql = "INSERT INTO barangay_details (`firstname`, `lastname`, `barangay`, `username`, `email`, `password`, `cpnumber`) VALUES (?)"; // Add cpnumber here
        const values = [firstname, lastname, barangay, username, email, password, cpnumber]; // Add cpnumber here
        db.getConnection((err, connection) => {
          if (err) return res.status(500).json({ message: 'Database connection error' });
          
          connection.query(sql, [values], (err, data) => {
            connection.release();
            if (err) return res.status(500).json(err);
            return res.json({ message: 'Barangay added successfully' });
          });
        });
      } else {
        return res.status(400).json({ message: 'Username already exists' });
      }
      return;
    }

    checkUsername(tables[index], (err, exists) => {
      if (err) return res.status(500).json(err);
      if (exists) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      checkAllTables(index + 1);
    });
  };

  checkAllTables(0);
});

app.post('/u-add-responder', (req, res) => {
  const { firstname, lastname, respondertype, vehicle, email, username, password, cpnumber } = req.body; // Add cpnumber here
  const tables = ['admin_details', 'user_details', 'police_details', 'responder_details', 'unit_details', 'barangay_details'];

  let found = false;

  const checkUsername = (table, callback) => {
    db.getConnection((err, connection) => {
      if (err) return callback(err);

      const query = `SELECT * FROM ${table} WHERE username = ?`;
      connection.query(query, [username], (error, results) => {
        connection.release(); // Always release the connection

        if (error) return callback(error);

        if (results.length > 0) {
          found = true;
          return callback(null, true);
        }

        callback(null, false);
      });
    });
  };

  const checkAllTables = (index) => {
    if (index >= tables.length) {
      if (!found) {
        // Insert new responder into the responder_details table
        const sql = "INSERT INTO responder_details (`firstname`, `lastname`, `respondertype`, `vehicle`, `email`, `username`, `password`, `cpnumber`) VALUES (?)"; // Add cpnumber here
        const values = [firstname, lastname, respondertype, vehicle, email, username, password, cpnumber]; // Add cpnumber here
        db.getConnection((err, connection) => {
          if (err) return res.status(500).json({ message: 'Database connection error' });
          
          connection.query(sql, [values], (err, data) => {
            connection.release();
            if (err) return res.status(500).json(err);
            return res.json({ message: 'Responder added successfully' });
          });
        });
      } else {
        return res.status(400).json({ message: 'Username already exists' });
      }
      return;
    }

    checkUsername(tables[index], (err, exists) => {
      if (err) return res.status(500).json(err);
      if (exists) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      checkAllTables(index + 1);
    });
  };

  checkAllTables(0);
});

app.post('/login', (req, res) => {
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection:', err);
      return res.status(500).json({ message: 'Database connection error' });
    }

    const sql = "SELECT * FROM user_details WHERE username = ? AND password = ?";
    connection.query(sql, [req.body.username, req.body.password], (error, data) => {
      connection.release(); // Always release the connection

      if (error) {
        return res.status(500).json({ message: 'Error logging in' });
      }
      if (data.length > 0) {
        req.session.user = data[0];
        return res.status(200).json({ message: 'Login successful' });
      } else {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    });
  });
});

//handle image upload
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const { latitude, longitude } = req.body;
  const filePath = req.file.path;

  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection:', err);
      return res.status(500).json({ message: 'Database connection error' });
    }

    const query = 'INSERT INTO upload (filePath, latitude, longitude) VALUES (?, ?, ?)';
    connection.query(query, [filePath, latitude, longitude], (err, result) => {
      if (err) {
        connection.release();
        console.error('Error inserting into MySQL:', err);
        return res.status(500).send('Error saving to database.');
      }

      const uploadId = result.insertId;
      const { user } = req.session;
      
      if (!user) {
        connection.release();
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const updateQuery = 'UPDATE user_details SET uploadId = ? WHERE username = ?';
      connection.query(updateQuery, [uploadId, user.username], (updateErr) => {
        connection.release();
        if (updateErr) {
          console.error('Error updating user uploadId:', updateErr);
          return res.status(500).send('Error updating user uploadId.');
        }
        res.status(200).send({ filePath, uploadId });
      });
    });
  });
});

app.use('/upload', express.static(path.join(__dirname, 'upload')));

app.get('/images', (req, res) => {
  const query = 'SELECT * FROM upload';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching images:', err);
      return res.status(500).send('Error fetching images');
    }
    res.status(200).json(results);
  });
});

app.get('/images/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT filePath, latitude, longitude, uploadedAt FROM upload WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching image:', err);
      return res.status(500).send('Error fetching image');
    }
    if (results.length === 0) {
      return res.status(404).send('Image not found.');
    }
    res.status(200).json(results[0]);
  });
});

app.get('/latest-image-id', (req, res) => {
  const query = 'SELECT id FROM upload ORDER BY id DESC LIMIT 1';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching latest image ID:', err);
      return res.status(500).send('Error fetching latest image ID');
    }
    if (results.length === 0) {
      return res.status(404).send('No images found.');
    }
    res.status(200).json(results[0]);
  });
});

app.post('/api/reports', (req, res) => {
  const { description, type, victim_name } = req.body;
  const sql = victim_name
    ? 'INSERT INTO reports (description, type, victim_name) VALUES (?, ?, ?)'
    : 'INSERT INTO reports (description, type) VALUES (?, ?)';
  const params = victim_name ? [description, type, victim_name] : [description, type];
  
  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Error inserting report:', err);
      return res.status(500).json({ message: 'Error inserting report' });
    }

    const reportId = result.insertId; // Get the ID of the inserted report

    // Retrieve the authenticated user's information from the session
    const { user } = req.session;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const updateQuery = 'UPDATE user_details SET reportId = ? WHERE username = ?';
    db.query(updateQuery, [reportId, user.username], (updateErr) => {
      if (updateErr) {
        console.error('Error updating user reportId:', updateErr);
        return res.status(500).json({ message: 'Error updating user reportId' });
      }

      res.status(200).json({ message: 'Report added successfully', reportId });
    });
  });
});

app.get('/api/reports/latest', (req, res) => {
  const sql = 'SELECT * FROM reports ORDER BY id DESC LIMIT 1';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching latest report:', err);
      return res.status(500).json({ message: 'Error fetching latest report' });
    }
    res.status(200).json(result[0]);
  });
});

app.get('/api/user_details', (req, res) => {
  const { user } = req.session;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection:', err);
      return res.status(500).json({ message: 'Database connection error' });
    }

    const sql = 'SELECT reportId FROM user_details WHERE username = ?';
    connection.query(sql, [user.username], (error, results) => {
      connection.release(); // Always release the connection

      if (error) {
        console.error('Error fetching user details:', error);
        return res.status(500).json({ message: 'Error fetching user details' });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(results[0]);
    });
  });
});
app.get('/api/reports/:id', (req, res) => {
  const { id } = req.params;
  
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection:', err);
      return res.status(500).json({ message: 'Database connection error' });
    }

    const sql = 'SELECT * FROM reports WHERE id = ?';
    connection.query(sql, [id], (err, results) => {
      connection.release();
      if (err) {
        console.error('Error fetching report:', err);
        return res.status(500).json({ message: 'Error fetching report' });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'Report not found' });
      }
      res.status(200).json(results[0]);
    });
  });
});

app.get('/api/user-upload-id', (req, res) => {
  const { user } = req.session;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection:', err);
      return res.status(500).json({ message: 'Database connection error' });
    }

    const query = 'SELECT uploadId FROM user_details WHERE username = ?';
    connection.query(query, [user.username], (err, results) => {
      connection.release();
      if (err) {
        console.error('Error fetching upload ID:', err);
        return res.status(500).send('Error fetching upload ID');
      }
      if (results.length === 0) {
        return res.status(404).send('User not found.');
      }
      res.status(200).json(results[0]);
    });
  });
});

app.post('/api/full_report', (req, res) => {
  const { 
    victim, 
    reporterId, 
    type, 
    latitude, 
    longitude, 
    location, 
    description, 
    uploadedAt, 
    imageUrl, 
    status, 
    closestResponderId, 
    closestBarangayId,
    closestPoliceId 
  } = req.body;
  
  console.log('Received full report data:', req.body);

  const sql = `
    INSERT INTO full_report (
      victim, 
      reporterId, 
      type, 
      latitude, 
      longitude, 
      location, 
      description, 
      uploadedAt, 
      imageUrl, 
      status, 
      closestResponderId, 
      closestBarangayId,
      closestPoliceId
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection:', err);
      return res.status(500).json({ message: 'Database connection error' });
    }

    connection.query(sql, [
      victim, 
      reporterId, 
      type, 
      latitude, 
      longitude, 
      location, 
      description, 
      uploadedAt, 
      imageUrl, 
      status, 
      closestResponderId, 
      closestBarangayId,
      closestPoliceId 
    ], (err, result) => {
      connection.release();
      if (err) {
        console.error('Error inserting full report:', err);
        return res.status(500).json({ message: 'Error inserting full report' });
      }
      res.status(200).json({ message: 'Full report added successfully' });
    });
  });
});

app.get('/api/full_reports/all', (req, res) => {
  const sql = 'SELECT * FROM full_report';
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection:', err);
      return res.status(500).json({ message: 'Database connection error' });
    }

    connection.query(sql, (err, results) => {
      connection.release();
      if (err) {
        console.error('Error fetching full reports:', err);
        return res.status(500).json({ message: 'Error fetching full reports' });
      }
      res.status(200).json(results);
    });
  });
});



app.get('/api/accounts', (req, res) => {
  const tables = ['user_details', 'responder_details', 'unit_details', 'police_details', 'barangay_details'];
  const results = {};

  const fetchAccounts = (index) => {
    if (index >= tables.length) {
      console.log('Results:', results); // Log the results
      return res.status(200).json(results);
    }

    const table = tables[index];
    const sql = `SELECT id, username, email FROM ${table}`;
    db.getConnection((err, connection) => {
      if (err) {
        console.error('Error getting connection:', err);
        return res.status(500).json({ message: 'Database connection error' });
      }

      connection.query(sql, (err, data) => {
        connection.release();
        if (err) {
          console.error(`Error fetching accounts from ${table}:`, err);
          return res.status(500).json({ message: `Error fetching accounts from ${table}` });
        }
        results[table] = data;
        fetchAccounts(index + 1);
      });
    });
  };

  fetchAccounts(0);
});

app.get('/api/accounts/:table/:id', (req, res) => {
  const { table, id } = req.params;
  const validTables = ['user_details', 'responder_details', 'unit_details', 'police_details', 'barangay_details'];

  if (!validTables.includes(table)) {
    return res.status(400).json({ message: 'Invalid table name' });
  }

  const sql = `SELECT * FROM ${table} WHERE id = ?`;
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection:', err);
      return res.status(500).json({ message: 'Database connection error' });
    }

    connection.query(sql, [id], (err, results) => {
      connection.release();
      if (err) {
        console.error(`Error fetching account details from ${table}:`, err);
        return res.status(500).json({ message: `Error fetching account details from ${table}` });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'Account not found' });
      }
      res.status(200).json(results[0]);
    });
  });
});

app.get('/checkSession', (req, res) => {
  console.log('Session check requested:', req.session);
  
  if (req.session && req.session.user) {
    const { username, table } = req.session.user;
    console.log('Session exists:', { username, table });
    
    db.getConnection((err, connection) => {
      if (err) {
        console.error('Error getting connection:', err);
        return res.status(500).json({ 
          isAuthenticated: false, 
          message: 'Database connection error' 
        });
      }

      const sql = `SELECT * FROM ${table} WHERE username = ?`;
      connection.query(sql, [username], (err, results) => {
        connection.release();
        
        if (err) {
          console.error('Error checking user:', err);
          return res.status(500).json({ 
            isAuthenticated: false, 
            message: 'Database error' 
          });
        }
        
        if (results.length > 0) {
          console.log('User authenticated:', username);
          return res.json({ 
            isAuthenticated: true, 
            user: results[0],
            table: table 
          });
        } else {
          console.log('User not found in database:', username);
          return res.json({ 
            isAuthenticated: false, 
            message: 'User not found' 
          });
        }
      });
    });
  } else {
    console.log('No session found');
    return res.json({ 
      isAuthenticated: false, 
      message: 'No session' 
    });
  }
});



app.put('/api/full_report/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, eta, barangay_eta, responderId } = req.body;

  let finalStatus = status;
  if (status === 'Responded' && responderId) {
    finalStatus = `Responded by responder_${responderId}`;
  }

  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection:', err);
      return res.status(500).json({ message: 'Database connection error' });
    }

    const sql = 'UPDATE full_report SET status = ?, eta = ?, barangay_eta = ? WHERE id = ?';
    connection.query(sql, [finalStatus, eta, barangay_eta, id], (err, result) => {
      connection.release();
      if (err) {
        console.error('Error updating report status:', err);
        return res.status(500).json({ message: 'Error updating report status' });
      }
      res.status(200).json({ message: 'Report status and ETA updated successfully' });
    });
  });
});

app.post('/api/update-victim-name', (req, res) => {
  const { victim_name } = req.body;
  const { user } = req.session;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection:', err);
      return res.status(500).json({ message: 'Database connection error' });
    }

    const sql = 'UPDATE reports SET victim_name = ? WHERE id = (SELECT reportId FROM user_details WHERE username = ?)';
    connection.query(sql, [victim_name, user.username], (err, result) => {
      connection.release();
      if (err) {
        console.error('Error updating victim name:', err);
        return res.status(500).json({ message: 'Error updating victim name' });
      }
      res.status(200).json({ message: 'Victim name updated successfully' });
    });
  });
});

app.get('/api/full_reports/locations', (req, res) => {
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection:', err);
      return res.status(500).json({ message: 'Database connection error' });
    }

    const sql = 'SELECT latitude, longitude, type, imageUrl, status, closestResponderId, closestBarangayId FROM full_report WHERE status IN ("active", "waiting for responder")';
    connection.query(sql, (err, results) => {
      connection.release();
      if (err) {
        console.error('Error fetching locations:', err);
        return res.status(500).json({ message: 'Error fetching locations' });
      }
      console.log('Active and waiting for responder reports:', results);
      res.status(200).json(results);
    });
  });
});

app.put('/api/account/status', (req, res) => {
  const { status, latitude, longitude } = req.body;
  const { user } = req.session;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection:', err);
      return res.status(500).json({ message: 'Database connection error' });
    }

    const table = user.table;
    const username = user.username;
    const sql = `UPDATE ${table} SET situation = ?, latitude = ?, longitude = ? WHERE username = ?`;

    connection.query(sql, [status, latitude, longitude, username], (err, result) => {
      connection.release();
      if (err) {
        console.error('Error updating account situation:', err);
        return res.status(500).json({ message: 'Error updating account situation' });
      }
      res.status(200).json({ message: 'Account situation updated successfully' });
    });
  });
});

app.get('/api/responders/active', (req, res) => {
  const { respondertype } = req.query;
  let sql = 'SELECT id, latitude, longitude FROM responder_details WHERE situation = "active"';

  if (respondertype) {
    sql += ' AND respondertype = ?';
  }

  db.query(sql, [respondertype], (err, results) => {
    if (err) {
      console.error('Error fetching active responders:', err);
      return res.status(500).json({ message: 'Error fetching active responders' });
    }
    res.status(200).json(results);
  });
});

app.post('/api/full_reports/closestResponder', (req, res) => {
  const { responderId } = req.body;
  const closestResponderId = `responder_${responderId}`;
  const sql = 'SELECT id FROM full_report WHERE closestResponderId = ? AND status = "active"';

  db.query(sql, [closestResponderId], (err, results) => {
    if (err) {
      console.error('Error fetching reports:', err);
      return res.status(500).json({ message: 'Error fetching reports' });
    }
    if (results.length > 0) {
      return res.status(200).json({ match: true, reportId: results[0].id });
    }
    res.status(200).json({ match: false });
  });
});

app.put('/api/responders/:id/report', (req, res) => {
  const { id } = req.params;
  const { reportId } = req.body;
  const sql = 'UPDATE responder_details SET reportId = ? WHERE id = ?';

  db.query(sql, [reportId, id], (err, result) => {
    if (err) {
      console.error('Error updating responder reportId:', err);
      return res.status(500).json({ message: 'Error updating responder reportId' });
    }
    res.status(200).json({ message: 'Responder reportId updated' });
  });
});

app.put('/api/responders/:id/situation', (req, res) => {
  const { id } = req.params;
  const { situation } = req.body;
  const sql = 'UPDATE responder_details SET situation = ? WHERE id = ?';

  db.query(sql, [situation, id], (err, result) => {
    if (err) {
      console.error('Error updating responder situation:', err);
      return res.status(500).json({ message: 'Error updating responder situation' });
    }
    res.status(200).json({ message: 'Responder situation updated' });
  });
});
app.get('/api/responder/report', (req, res) => {
  const { user } = req.session;

  if (!user || (user.table !== 'responder_details' && user.table !== 'police_details')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const sql = `SELECT reportId FROM ${user.table} WHERE username = ?`;
  db.query(sql, [user.username], (err, results) => {
    if (err) {
      console.error('Error fetching reportId:', err);
      return res.status(500).json({ message: 'Error fetching reportId' });
    }
    if (results.length === 0 || !results[0].reportId) {
      return res.status(404).json({ message: 'No report found for this responder' });
    }

    const reportId = results[0].reportId;
    const reportSql = `
      SELECT id, type, latitude, longitude, victim, reporterId, location, 
             description, uploadedAt, imageUrl, closestPoliceId, closestResponderId 
      FROM full_report WHERE id = ?`;
    
    db.query(reportSql, [reportId], (err, reportResults) => {
      if (err) {
        console.error('Error fetching report details:', err);
        return res.status(500).json({ message: 'Error fetching report details' });
      }
      if (reportResults.length === 0) {
        return res.status(404).json({ message: 'Report not found' });
      }
      res.status(200).json(reportResults[0]);
    });
  });
});

app.put('/api/responder/resetReport', (req, res) => {
  const { user } = req.session;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const table = user.table;
  const username = user.username;
  const sql = `UPDATE ${table} SET reportId = 0 WHERE username = ?`;

  db.query(sql, [username], (err, result) => {
    if (err) {
      console.error('Error updating reportId:', err);
      return res.status(500).json({ message: 'Error updating reportId' });
    }
    res.status(200).json({ message: 'ReportId reset successfully' });
  });
});



app.put('/api/full_report/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, eta, barangay_eta, responderId } = req.body;

  let finalStatus = status;
  if (status === 'Responded' && responderId) {
    finalStatus = `Responded by responder_${responderId}`;
  }

  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection:', err);
      return res.status(500).json({ message: 'Database connection error' });
    }

    const sql = 'UPDATE full_report SET status = ?, eta = ?, barangay_eta = ? WHERE id = ?';
    connection.query(sql, [finalStatus, eta, barangay_eta, id], (err, result) => {
      connection.release();
      if (err) {
        console.error('Error updating report status:', err);
        return res.status(500).json({ message: 'Error updating report status' });
      }
      res.status(200).json({ message: 'Report status and ETA updated successfully' });
    });
  });
});

app.put('/updateAccount', (req, res) => {
  const { user } = req.session;
  const { firstname, lastname, username, email, password, cpnumber, respondertype, vehicle, unit, rank, barangay } = req.body;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const table = user.table;
  const currentUsername = user.username;

  // Check if the new username already exists in any table
  const tables = ['admin_details', 'user_details', 'police_details', 'responder_details', 'unit_details', 'barangay_details'];

  let found = false;

  const checkUsername = (table, callback) => {
    db.getConnection((err, connection) => {
      if (err) return callback(err);

      const query = `SELECT * FROM ${table} WHERE username = ? AND username != ?`;
      connection.query(query, [username, currentUsername], (error, results) => {
        connection.release(); // Always release the connection

        if (error) return callback(error);

        if (results.length > 0) {
          found = true;
          return callback(null, true);
        }

        callback(null, false);
      });
    });
  };

  const checkAllTables = (index) => {
    if (index >= tables.length) {
      if (!found) {
        // Update the account details
        let sql = `UPDATE ${table} SET firstname = ?, lastname = ?, username = ?, email = ?, password = ?, cpnumber = ?`;
        const values = [firstname, lastname, username, email, password, cpnumber];

        if (table === 'responder_details') {
          sql += `, respondertype = ?, vehicle = ?`;
          values.push(respondertype, vehicle);
        } else if (table === 'police_details') {
          sql += `, unit = ?, rank = ?`;
          values.push(unit, rank);
        } else if (table === 'barangay_details') {
          sql += `, barangay = ?`;
          values.push(barangay);
        } else if (table === 'unit_details') {
          sql += `, unit = ?`;
          values.push(unit);
        }

        sql += ` WHERE username = ?`;
        values.push(currentUsername);

        db.getConnection((err, connection) => {
          if (err) {
            console.error('Error getting connection:', err);
            return res.status(500).json({ message: 'Database connection error' });
          }

          connection.query(sql, values, (err, result) => {
            connection.release();
            if (err) {
              console.error('Error updating account details:', err);
              return res.status(500).json({ message: 'Error updating account details' });
            }

            // Update session user data
            req.session.user.username = username;
            req.session.save(err => {
              if (err) {
                console.error('Error saving session:', err);
                return res.status(500).json({ message: 'Error saving session' });
              }
              res.status(200).json({ message: 'Account updated successfully' });
            });
          });
        });
      } else {
        return res.status(400).json({ message: 'Username already exists' });
      }
      return;
    }

    checkUsername(tables[index], (err, exists) => {
      if (err) return res.status(500).json(err);
      if (exists) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      checkAllTables(index + 1);
    });
  };

  checkAllTables(0);
});

app.get('/api/barangays/active', (req, res) => {
  const sql = 'SELECT id, latitude, longitude FROM barangay_details WHERE situation = "active"';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching active barangays:', err);
      return res.status(500).json({ message: 'Error fetching active barangays' });
    }
    res.status(200).json(results);
  });
});

app.post('/api/full_reports/closestBarangay', (req, res) => {
  const { barangayId } = req.body;
  const closestBarangayId = `barangay_${barangayId}`;
  const sql = 'SELECT id FROM full_report WHERE closestBarangayId = ? AND status = "active"';

  db.query(sql, [closestBarangayId], (err, results) => {
    if (err) {
      console.error('Error fetching reports:', err);
      return res.status(500).json({ message: 'Error fetching reports' });
    }
    if (results.length > 0) {
      return res.status(200).json({ match: true, reportId: results[0].id });
    }
    res.status(200).json({ match: false });
  });
});

app.put('/api/barangays/:id/report', (req, res) => {
  const { id } = req.params;
  const { reportId } = req.body;
  const sql = 'UPDATE barangay_details SET reportId = ? WHERE id = ?';

  db.query(sql, [reportId, id], (err, result) => {
    if (err) {
      console.error('Error updating barangay reportId:', err);
      return res.status(500).json({ message: 'Error updating barangay reportId' });
    }
    res.status(200).json({ message: 'Barangay reportId updated' });
  });
});

app.put('/api/barangays/:id/situation', (req, res) => {
  const { id } = req.params;
  const { situation } = req.body;

  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection:', err);
      return res.status(500).json({ message: 'Database connection error' });
    }

    const sql = 'UPDATE barangay_details SET situation = ? WHERE id = ?';
    connection.query(sql, [situation, id], (error, result) => {
      connection.release(); // Release connection

      if (error) {
        console.error('Error updating barangay situation:', error);
        return res.status(500).json({ message: 'Error updating barangay situation' });
      }
      res.status(200).json({ message: 'Barangay situation updated' });
    });
  });
});

app.get('/api/barangay/report', (req, res) => {
  const { user } = req.session;

  if (!user || user.table !== 'barangay_details') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection:', err);
      return res.status(500).json({ message: 'Database connection error' });
    }

    const sql = `SELECT reportId FROM barangay_details WHERE username = ?`;
    connection.query(sql, [user.username], (error, results) => {
      if (error) {
        connection.release();
        console.error('Error fetching barangay reportId:', error);
        return res.status(500).json({ message: 'Error fetching barangay reportId' });
      }
      
      if (results.length === 0 || !results[0].reportId) {
        connection.release();
        return res.status(404).json({ message: 'No report found for this barangay' });
      }

      const reportId = results[0].reportId;
      const reportSql = `SELECT id, type, latitude, longitude, victim, reporterId, location, description, uploadedAt, imageUrl, barangay_eta FROM full_report WHERE id = ?`;
      
      connection.query(reportSql, [reportId], (error2, reportResults) => {
        connection.release(); // Release connection

        if (error2) {
          console.error('Error fetching report details:', error2);
          return res.status(500).json({ message: 'Error fetching report details' });
        }
        if (reportResults.length === 0) {
          return res.status(404).json({ message: 'Report not found' });
        }
        res.status(200).json(reportResults[0]);
      });
    });
  });
});

app.put('/api/barangay/resetReport', (req, res) => {
  const { user } = req.session;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection:', err);
      return res.status(500).json({ message: 'Database connection error' });
    }

    const table = user.table;
    const username = user.username;
    const sql = `UPDATE ${table} SET reportId = 0 WHERE username = ?`;

    connection.query(sql, [username], (error, result) => {
      connection.release(); // Release connection

      if (error) {
        console.error('Error updating reportId:', error);
        return res.status(500).json({ message: 'Error updating reportId' });
      }
      res.status(200).json({ message: 'ReportId reset successfully' });
    });
  });
});

app.get('/api/active-responders', (req, res) => {
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection:', err);
      return res.status(500).json({ message: 'Database connection error' });
    }

    const sql = 'SELECT id, latitude, longitude, respondertype FROM responder_details WHERE situation = "active"';
    connection.query(sql, (error, results) => {
      connection.release(); // Release connection

      if (error) {
        console.error('Error fetching active responders:', error);
        return res.status(500).json({ message: 'Error fetching active responders' });
      }
      res.status(200).json(results);
    });
  });
});

app.get('/api/active-barangays', (req, res) => {
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection:', err);
      return res.status(500).json({ message: 'Database connection error' });
    }

    const sql = 'SELECT id, latitude, longitude, barangay FROM barangay_details WHERE situation = "active"';
    connection.query(sql, (err, results) => {
      connection.release();
      if (err) {
        console.error('Error fetching active barangays:', err);
        return res.status(500).json({ message: 'Error fetching active barangays' });
      }
      res.status(200).json(results);
    });
  });
});

app.post('/api/full_reports/closestPolice', (req, res) => {
  const { policeId } = req.body;
  const closestPoliceId = `responder_${policeId}`;

  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection:', err);
      return res.status(500).json({ message: 'Database connection error' });
    }

    const sql = 'SELECT id FROM full_report WHERE closestPoliceId = ? AND status = "active"';
    connection.query(sql, [closestPoliceId], (err, results) => {
      connection.release();
      if (err) {
        console.error('Error fetching reports:', err);
        return res.status(500).json({ message: 'Error fetching reports' });
      }
      if (results.length > 0) {
        return res.status(200).json({ match: true, reportId: results[0].id });
      }
      res.status(200).json({ match: false });
    });
  });
});

app.put('/api/full_report/:id/policeStatus', (req, res) => {
    const { id } = req.params;
    const { closestPoliceId } = req.body;
    
    console.log('Updating police status:', { id, closestPoliceId });
    
    const sql = 'UPDATE full_report SET closestPoliceId = ? WHERE id = ?';
    db.query(sql, [closestPoliceId, id], (err, result) => {
        if (err) {
            console.error('Error updating police status:', err);
            return res.status(500).json({ message: 'Error updating police status' });
        }
        console.log('Police status updated successfully');
        res.status(200).json({ message: 'Police status updated successfully' });
    });
});

app.get('/api/responder/type', (req, res) => {
    const { user } = req.session;
    
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection:', err);
            return res.status(500).json({ message: 'Database connection error' });
        }

        const sql = 'SELECT id, respondertype FROM responder_details WHERE username = ?';
        connection.query(sql, [user.username], (err, results) => {
            connection.release();
            if (err) {
                console.error('Error fetching responder type:', err);
                return res.status(500).json({ message: 'Error fetching responder type' });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: 'Responder not found' });
            }
            res.status(200).json(results[0]);
        });
    });
});

app.put('/api/full_report/:id/barangayStatus', (req, res) => {
    const { id } = req.params;
    const { closestBarangayId, barangay_eta } = req.body;
    
    console.log('Updating barangay status:', { id, closestBarangayId, barangay_eta });
    
    db.getConnection((err, connection) => {
      if (err) {
        console.error('Error getting connection:', err);
        return res.status(500).json({ message: 'Database connection error' });
      }

      const sql = 'UPDATE full_report SET closestBarangayId = ?, barangay_eta = ? WHERE id = ?';
      connection.query(sql, [closestBarangayId, barangay_eta, id], (err, result) => {
        connection.release();
        if (err) {
          console.error('Error updating barangay status:', err);
          return res.status(500).json({ message: 'Error updating barangay status' });
        }
        console.log('Barangay status updated successfully');
        res.status(200).json({ message: 'Barangay status updated successfully' });
      });
    });
});

// Endpoint to update responder status and ETA
app.put('/api/full_report/:id/responderStatus', (req, res) => {
  const { id } = req.params;
  const { closestResponderId, eta } = req.body;
  
  console.log('Updating responder status:', { id, closestResponderId, eta });
  
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection:', err);
      return res.status(500).json({ message: 'Database connection error' });
    }

    const sql = 'UPDATE full_report SET closestResponderId = ?, eta = ? WHERE id = ?';
    connection.query(sql, [closestResponderId, eta, id], (err, result) => {
      connection.release();
      if (err) {
        console.error('Error updating responder status:', err);
        return res.status(500).json({ message: 'Error updating responder status' });
      }
      console.log('Responder status updated successfully');
      res.status(200).json({ message: 'Responder status updated successfully' });
    });
  });
});

// Endpoint to get active responders with their locations
app.get('/api/responders/available', (req, res) => {
  const { type } = req.query;
  
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection:', err);
      return res.status(500).json({ message: 'Database connection error' });
    }

    let sql = 'SELECT id, latitude, longitude, respondertype FROM responder_details WHERE situation = "active"';
    if (type) {
      sql += ' AND respondertype = ?';
    }
    
    connection.query(sql, type ? [type] : [], (err, results) => {
      connection.release();
      if (err) {
        console.error('Error fetching available responders:', err);
        return res.status(500).json({ message: 'Error fetching available responders' });
      }
      res.status(200).json(results);
    });
  });
});

app.put('/api/full_report/:id/setFakeReport', (req, res) => {
    const { id } = req.params;
    
    console.log('Setting report as fake:', { id });
    
    db.getConnection((err, connection) => {
      if (err) {
        console.error('Error getting connection:', err);
        return res.status(500).json({ message: 'Database connection error' });
      }

      const sql = 'UPDATE full_report SET status = "Fake Report" WHERE id = ?';
      connection.query(sql, [id], (err, result) => {
        connection.release();
        if (err) {
          console.error('Error updating report status:', err);
          return res.status(500).json({ message: 'Error updating report status' });
        }
        console.log('Report marked as fake successfully');
        res.status(200).json({ message: 'Report marked as fake successfully' });
      });
    });
});

app.get('/api/test-session', (req, res) => {
  console.log('Test session route hit');
  console.log('Session:', req.session);
  res.json({ 
    sessionExists: !!req.session,
    sessionId: req.sessionID,
    sessionData: req.session 
  });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});