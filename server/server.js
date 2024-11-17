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
    if (err) {
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

    const uploadId = result.insertId; // Get the ID of the inserted upload

    // Retrieve the authenticated user's information from the session
    const { user } = req.session;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const updateQuery = 'UPDATE user_details SET uploadId = ? WHERE username = ?';
    db.query(updateQuery, [uploadId, user.username], (updateErr) => {
      if (updateErr) {
        console.error('Error updating user uploadId:', updateErr);
        return res.status(500).send('Error updating user uploadId.');
      }

      res.status(200).send({ filePath, uploadId });
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

  const sql = 'SELECT reportId FROM user_details WHERE username = ?';
  db.query(sql, [user.username], (err, results) => {
    if (err) {
      console.error('Error fetching user details:', err);
      return res.status(500).json({ message: 'Error fetching user details' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(results[0]);
  });
});
app.get('/api/reports/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM reports WHERE id = ?';
  db.query(sql, [id], (err, results) => {
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

app.get('/api/user-upload-id', (req, res) => {
  const { user } = req.session;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const query = 'SELECT uploadId FROM user_details WHERE username = ?';
  db.query(query, [user.username], (err, results) => {
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

app.post('/api/full_report', (req, res) => {
  const { victim, reporterId, type, latitude, longitude, location, description, uploadedAt, imageUrl, status, closestResponderId } = req.body;
  
  console.log('Received full report data:', req.body); // Log the received data

  const sql = 'INSERT INTO full_report (victim, reporterId, type, latitude, longitude, location, description, uploadedAt, imageUrl, status, closestResponderId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [victim, reporterId, type, latitude, longitude, location, description, uploadedAt, imageUrl, status, closestResponderId], (err, result) => {
    if (err) {
      console.error('Error inserting full report:', err); // Log the error
      return res.status(500).json({ message: 'Error inserting full report' });
    }
    res.status(200).json({ message: 'Full report added successfully' });
  });
});

app.post('/api/full_report', (req, res) => {
  const { victim, reporterId, type, latitude, longitude, location, description, uploadedAt, imageUrl, status, closestResponderId } = req.body;
  
  console.log('Received full report data:', req.body); // Log the received data

  const sql = 'INSERT INTO full_report (victim, reporterId, type, latitude, longitude, location, description, uploadedAt, imageUrl, status, closestResponderId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [victim, reporterId, type, latitude, longitude, location, description, uploadedAt, imageUrl, status, closestResponderId], (err, result) => {
    if (err) {
      console.error('Error inserting full report:', err); // Log the error
      return res.status(500).json({ message: 'Error inserting full report' });
    }
    res.status(200).json({ message: 'Full report added successfully' });
  });
});

app.get('/api/full_reports/all', (req, res) => {
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

app.post('/api/update-victim-name', (req, res) => {
  const { victim_name } = req.body;
  const { user } = req.session;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const sql = 'UPDATE reports SET victim_name = ? WHERE id = (SELECT reportId FROM user_details WHERE username = ?)';
  db.query(sql, [victim_name, user.username], (err, result) => {
    if (err) {
      console.error('Error updating victim name:', err);
      return res.status(500).json({ message: 'Error updating victim name' });
    }
    res.status(200).json({ message: 'Victim name updated successfully' });
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

  if (!user || user.table !== 'responder_details') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const sql = `SELECT reportId FROM responder_details WHERE username = ?`;
  db.query(sql, [user.username], (err, results) => {
    if (err) {
      console.error('Error fetching responder reportId:', err);
      return res.status(500).json({ message: 'Error fetching responder reportId' });
    }
    if (results.length === 0 || !results[0].reportId) {
      return res.status(404).json({ message: 'No report found for this responder' });
    }

    const reportId = results[0].reportId;
    const reportSql = `SELECT id, type, latitude, longitude, victim, reporterId, location, description, uploadedAt, imageUrl FROM full_report WHERE id = ?`;
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
  const { status, eta } = req.body;

  const sql = 'UPDATE full_report SET status = ?, eta = ? WHERE id = ?';
  db.query(sql, [status, eta, id], (err, result) => {
    if (err) {
      console.error('Error updating report status:', err);
      return res.status(500).json({ message: 'Error updating report status' });
    }
    res.status(200).json({ message: 'Report status and ETA updated successfully' });
  });
});

app.listen(8081, () => {
    console.log("Listening...")
} )