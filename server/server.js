const express = require('express')
const mysql = require('mysql')
const cors = require('cors');
const e = require('express');
const multer = require('multer');
const path = require('path');
const session = require('express-session');

const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.use(session({
  secret: 'Te8LtamAsYFGxL6aS/VA2z1l/mQICv8rdX/YjX59C2o=',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'upload/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'e-report'
})

app.post('/register', (req, res) => {
  const { firstname, lastname, username, email, password } = req.body;
  const tables = ['admin_details', 'user_details', 'police_details', 'responder_details', 'unit_details', 'barangay_details'];

  let found = false;

  const checkUsername = (table, callback) => {
    const query = `SELECT * FROM ${table} WHERE username = ?`;
    db.query(query, [username], (err, results) => {
      if (err) return callback(err);

      if (results.length > 0) {
        found = true;
        return callback(null, true);
      }

      callback(null, false);
    });
  };

  const checkAllTables = (index) => {
    if (index >= tables.length) {
      if (!found) {
        // Insert new user into the user_details table
        const sql = "INSERT INTO user_details (`first_name`, `last_name`, `username`, `email`, `password`) VALUES (?)";
        const values = [firstname, lastname, username, email, password];
        db.query(sql, [values], (err, data) => {
          if (err) return res.status(500).json(err);
          return res.json({ message: 'Registered Successfully' });
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

db.connect(err => {
  if (err) throw err;
  console.log('Database connected!');
});

app.post('/checkAllTables', (req, res) => {
  const { username, password } = req.body;
  console.log(`Checking for user: ${username}`);
  const tables = ['admin_details', 'user_details', 'police_details', 'responder_details', 'unit_details', 'barangay_details'];

  let found = false;

  tables.forEach((table, index) => {
    const query = `SELECT * FROM ${table} WHERE username = ? AND password = ?`;
    db.query(query, [username, password], (err, results) => {
      if (err) {
        console.error(`Error querying table ${table}:`, err);
        if (index === tables.length - 1 && !found) {
          res.status(500).send({ message: "Error checking tables" });
        }
        return;
      }

      if (results.length > 0) {
        found = true;
        console.log(`Found in table: ${table}`);
        req.session.user = { username, table }; // Store session data
        req.session.save(err => {
          if (err) {
            console.error('Error saving session:', err);
            return res.status(500).send({ message: "Error saving session" });
          }
          res.send({ message: "Login Successful", table, sessionId: req.sessionID });
        });
      }

      if (index === tables.length - 1 && !found) {
        console.log("User not found in any table");
        res.send({ message: "Invalid Credentials" });
      }
    });
  });
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
  const { firstname, lastname, unit, username, email, password } = req.body;
  const tables = ['admin_details', 'user_details', 'police_details', 'responder_details', 'unit_details', 'barangay_details'];

  let found = false;

  const checkUsername = (table, callback) => {
    const query = `SELECT * FROM ${table} WHERE username = ?`;
    db.query(query, [username], (err, results) => {
      if (err) return callback(err);

      if (results.length > 0) {
        found = true;
        return callback(null, true);
      }

      callback(null, false);
    });
  };

  const checkAllTables = (index) => {
    if (index >= tables.length) {
      if (!found) {
        // Insert new unit into the unit_details table
        const sql = "INSERT INTO unit_details (`firstname`, `lastname`, `unit`, `username`, `email`, `password`) VALUES (?)";
        const values = [firstname, lastname, unit, username, email, password];
        db.query(sql, [values], (err, data) => {
          if (err) return res.status(500).json(err);
          return res.json({ message: 'Unit added successfully' });
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
  const { firstname, lastname, unit, rank, username, email, password } = req.body;
  const tables = ['admin_details', 'user_details', 'police_details', 'responder_details', 'unit_details', 'barangay_details'];

  let found = false;

  const checkUsername = (table, callback) => {
    const query = `SELECT * FROM ${table} WHERE username = ?`;
    db.query(query, [username], (err, results) => {
      if (err) return callback(err);

      if (results.length > 0) {
        found = true;
        return callback(null, true);
      }

      callback(null, false);
    });
  };

  const checkAllTables = (index) => {
    if (index >= tables.length) {
      if (!found) {
        // Insert new police officer into the police_details table
        const sql = "INSERT INTO police_details (`firstname`, `lastname`, `unit`, `rank`, `username`, `email`, `password`) VALUES (?)";
        const values = [firstname, lastname, unit, rank, username, email, password];
        db.query(sql, [values], (err, data) => {
          if (err) return res.status(500).json(err);
          return res.json({ message: 'Police officer added successfully' });
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
  const { firstname, lastname, barangay, username, email, password } = req.body;
  const tables = ['admin_details', 'user_details', 'police_details', 'responder_details', 'unit_details', 'barangay_details'];

  let found = false;

  const checkUsername = (table, callback) => {
    const query = `SELECT * FROM ${table} WHERE username = ?`;
    db.query(query, [username], (err, results) => {
      if (err) return callback(err);

      if (results.length > 0) {
        found = true;
        return callback(null, true);
      }

      callback(null, false);
    });
  };

  const checkAllTables = (index) => {
    if (index >= tables.length) {
      if (!found) {
        // Insert new barangay into the barangay_details table
        const sql = "INSERT INTO barangay_details (`firstname`, `lastname`, `barangay`, `username`, `email`, `password`) VALUES (?)";
        const values = [firstname, lastname, barangay, username, email, password];
        db.query(sql, [values], (err, data) => {
          if (err) return res.status(500).json(err);
          return res.json({ message: 'Barangay added successfully' });
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
  const { firstname, lastname, respondertype, vehicle, email, username, password } = req.body;
  const tables = ['admin_details', 'user_details', 'police_details', 'responder_details', 'unit_details', 'barangay_details'];

  let found = false;

  const checkUsername = (table, callback) => {
    const query = `SELECT * FROM ${table} WHERE username = ?`;
    db.query(query, [username], (err, results) => {
      if (err) return callback(err);

      if (results.length > 0) {
        found = true;
        return callback(null, true);
      }

      callback(null, false);
    });
  };

  const checkAllTables = (index) => {
    if (index >= tables.length) {
      if (!found) {
        // Insert new responder into the responder_details table
        const sql = "INSERT INTO responder_details (`firstname`, `lastname`, `respondertype`, `vehicle`, `email`, `username`, `password`) VALUES (?)";
        const values = [firstname, lastname, respondertype, vehicle, email, username, password];
        db.query(sql, [values], (err, data) => {
          if (err) return res.status(500).json(err);
          return res.json({ message: 'Responder added successfully' });
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
  const sql = "SELECT * FROM user_details WHERE username = ? AND password = ?";
  
  db.query(sql, [req.body.username, req.body.password], (err, data) => {
    if(err) return res.json("Error");
    if(data.length > 0) {
      return res.json("Login Successful");
      } else {
        return res.json("Invalid Credentials");
      }
    })
})

//handle image upload
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const { latitude, longitude } = req.body;
  const filePath = req.file.path;

  const query = 'INSERT INTO upload (filePath, latitude, longitude) VALUES (?, ?, ?)';
  db.query(query, [filePath, latitude, longitude], (err, result) => {
    if (err) {
      console.error('Error inserting into MySQL:', err);
      return res.status(500).send('Error saving to database.');
    }
    res.status(200).send({ filePath });
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
  const { description, type } = req.body;
  const sql = 'INSERT INTO reports (description, type) VALUES (?, ?)';
  db.query(sql, [description, type], (err, result) => {
    if (err) {
      console.error('Error inserting report:', err);
      return res.status(500).json({ message: 'Error inserting report' });
    }
    res.status(200).json({ message: 'Report added successfully' });
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

app.post('/api/full_report', (req, res) => {
  const { victim, reporterId, type, latitude, longitude, location, description, uploadedAt, imageUrl } = req.body;
  const sql = 'INSERT INTO full_report (victim, reporterId, type, latitude, longitude, location, description, uploadedAt, imageUrl) VALUES (?, ?, ?,?, ?, ?, ?, ?, ?)';
  db.query(sql, [victim, reporterId, type, latitude, longitude, location, description, uploadedAt, imageUrl], (err, result) => {
    if (err) {
      console.error('Error inserting full report:', err);
      return res.status(500).json({ message: 'Error inserting full report' });
    }
    res.status(200).json({ message: 'Full report added successfully' });
  });
});

app.get('/api/full_reports', (req, res) => {
  const sql = 'SELECT * FROM full_report';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching full reports:', err);
      return res.status(500).json({ message: 'Error fetching full reports' });
    }
    res.status(200).json(results);
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
    db.query(sql, (err, data) => {
      if (err) {
        console.error(`Error fetching accounts from ${table}:`, err);
        return res.status(500).json({ message: `Error fetching accounts from ${table}` });
      }
      results[table] = data;
      fetchAccounts(index + 1);
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
  db.query(sql, [id], (err, results) => {
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

app.get('/checkSession', (req, res) => {
  if (req.session.user) {
    const { username, table } = req.session.user;
    const sql = `SELECT * FROM ${table} WHERE username = ?`;
    
    db.query(sql, [username], (err, results) => {
      if (err) {
        console.error('Error fetching user details:', err);
        return res.status(500).json({ message: 'Error fetching user details' });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.send({ isAuthenticated: true, user: results[0] });
    });
  } else {
    res.send({ isAuthenticated: false });
  }
});

app.put('/api/reports/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const sql = 'UPDATE full_report SET status = ? WHERE id = ?';

  db.query(sql, [status, id], (err, result) => {
    if (err) {
      console.error('Error updating report status:', err);
      return res.status(500).json({ message: 'Error updating report status' });
    }
    res.status(200).json({ message: 'Report status updated successfully' });
  });
});

app.get('/api/full_reports/locations', (req, res) => {
  const sql = 'SELECT latitude, longitude, type, imageUrl FROM full_report WHERE status = "active"';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching locations:', err);
      return res.status(500).json({ message: 'Error fetching locations' });
    }
    console.log('Active reports:', results); // Log the results
    res.status(200).json(results);
  });
});

app.put('/api/account/status', (req, res) => {
  const { status, latitude, longitude } = req.body;
  const { user } = req.session;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const table = user.table;
  const username = user.username;
  const sql = `UPDATE ${table} SET situation = ?, latitude = ?, longitude = ? WHERE username = ?`;

  db.query(sql, [status, latitude, longitude, username], (err, result) => {
    if (err) {
      console.error('Error updating account situation:', err);
      return res.status(500).json({ message: 'Error updating account situation' });
    }
    res.status(200).json({ message: 'Account situation updated successfully' });
  });
});

app.listen(8081, () => {
    console.log("Listening...")
} )