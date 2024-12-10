const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));


// MySQL database connection configuration
const db = mysql.createConnection({
  host: 'localhost',      // Database host (e.g., localhost)
  user: 'root',           // MySQL username
  password: 'Rhern_19',   // MySQL password
  database: 'social_fitness_DB'      // MySQL database name
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database!");
});


app.post('/register', async (req, res) => {
  const { username, email, uid, password } = req.body; // Receive password from the frontend

  // Check if user with the Firebase UID already exists
  const checkQuery = 'SELECT * FROM users WHERE uid = ?';
  db.query(checkQuery, [uid], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error during registration" });
    if (results.length > 0) return res.status(400).json({ error: "User already exists" });

    try {
      // Hash the password
      // const hashedPassword = await bcrypt.hash(password, 10);

      // If no existing user, insert new user record
      const insertQuery = 'INSERT INTO users (username, email, uid, password, profile_image, bio) VALUES (?, ?, ?, ?, NULL, NULL)';
      db.query(insertQuery, [username, email, uid, password], (err, result) => {
        if (err) {
          console.log("Error executing query:", err);
          return res.status(500).json({ error: "User registration failed" });
        }
        else{
          res.status(201).json({ message: "User registered successfully", userId: result.insertId });
        }
      });
    } catch (hashErr) {
      return res.status(500).json({ error: "Failed to hash password" });
    }
  });
});



app.post('/get-user', (req, res) => {
  const { uid } = req.body; // Firebase uid

  // Query to fetch user information using Firebase UID
  const query = 'SELECT * FROM users WHERE uid = ?';
  db.query(query, [uid], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error during sign-in" });
    if (results.length === 0) return res.status(401).json({ error: "User not found" });

    const user = results[0];
    res.json({
      
      id: user.id, username: user.username, email: user.email,password: user.password, firstName: user.firstName, lastName: user.lastName, 
        birthDate: user.birthDate, gender: user.gender, profileImage: user.profile_image, bio: user.bio
        
    });
  });
});


app.post('/userInfo', (req, res) => {
  const { uid, firstName, lastName, birthDate, gender } = req.body; // Extract fields from request body

  if (!uid || !firstName || !lastName || !birthDate || !gender) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Query to update user information in the database using Firebase UID
  const query = `
    UPDATE users 
    SET firstName = ?, lastName = ?, birthDate = ?, gender = ?
    WHERE uid = ?
  `;
  
  db.query(query, [firstName, lastName, birthDate, gender, uid], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error during user update" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User information updated successfully" });
  });
});

// SEARCH USER
app.get('/search-users', (req, res) => {
  const { query } = req.query; // Query parameter for search input

  if (!query) {
      return res.status(400).json({ error: 'Query parameter is required.' });
  }

  const sqlQuery = `
      SELECT * 
      FROM users 
      WHERE firstName LIKE ? OR lastName LIKE ?`;

  const searchValue = `%${query}%`; // Add wildcards for partial matching

  db.query(sqlQuery, [searchValue, searchValue], (err, results) => {
      if (err) {
          console.error('Error fetching users:', err);
          return res.status(500).json({ error: 'Database error.' });
      }

      res.status(200).json({ users: results });
  });
});

// get follower and following count
app.get('/user/:uid/stats', (req, res) => {
  const userId = req.params.uid;

  if (userId == null) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  const followersCountQuery = `
    SELECT COUNT(*) AS followersCount 
    FROM followers 
    WHERE following_id = ?`;

  const followingCountQuery = `
    SELECT COUNT(*) AS followingCount 
    FROM followers 
    WHERE follower_id = ?`;

  db.query(followersCountQuery, [userId], (followersErr, followersResults) => {
    if (followersErr) {
      console.error('Error fetching followers count:', followersErr);
      return res.status(500).json({ error: 'Database error while fetching followers count.' });
    }

    const followersCount = followersResults[0].followersCount;

    db.query(followingCountQuery, [userId], (followingErr, followingResults) => {
      if (followingErr) {
        console.error('Error fetching following count:', followingErr);
        return res.status(500).json({ error: 'Database error while fetching following count.' });
      }

      const followingCount = followingResults[0].followingCount;

      res.status(200).json({
        userId,
        followersCount,
        followingCount,
      });
    });
  });
});



// Follow API endpoint
app.post('/api/follow', (req, res) => {
  const { followerId, followingId } = req.body;

  // Validate input
  if (!followerId || !followingId) {
    return res.status(400).json({ error: 'followerId and followingId are required' });
  }

  if (followerId === followingId) {
    return res.status(400).json({ error: 'You cannot follow yourself' });
  }

  const checkFollowQuery = `
    SELECT * 
    FROM followers 
    WHERE follower_id = ? AND following_id = ?`;

  const insertFollowQuery = `
    INSERT INTO followers (follower_id, following_id) 
    VALUES (?, ?)`;

  // Check if the follow relationship already exists
  db.query(checkFollowQuery, [followerId, followingId], (checkErr, results) => {
    if (checkErr) {
      console.error('Error checking follow relationship:', checkErr);
      return res.status(500).json({ error: 'Database error while checking follow relationship.' });
    }

    if (results.length > 0) {
      return res.status(409).json({ error: 'You are already following this user' });
    }

    // Insert a new follow relationship
    db.query(insertFollowQuery, [followerId, followingId], (insertErr, insertResults) => {
      if (insertErr) {
        console.error('Error inserting follow relationship:', insertErr);
        return res.status(500).json({ error: 'Database error while inserting follow relationship.' });
      }

      res.status(201).json({ message: 'Followed successfully' });
    });
  });
});


// Fetch progress for a user with optional filters
app.get('/api/exercises-progress', (req, res) => {
  const uid = req.query.uid;
  const exerciseName = req.query.exercise_name || null;
  const exerciseCategory = req.query.exercise_category || null;

  if (!uid) {
      return res.status(400).json({ error: 'uid is required' });
  }

  let query = `
      SELECT 
          progress_id,
          uid,
          exercise_name,
          exercise_category,
          weight,
          reps,
          sets,
          created_at
      FROM exercises_progress
      WHERE uid = ?
  `;
  const queryParams = [uid];

  // Add optional filters for exercise_name and exercise_category
  if (exerciseName) {
      query += ' AND exercise_name = ?';
      queryParams.push(exerciseName);
  }
  if (exerciseCategory) {
      query += ' AND exercise_category = ?';
      queryParams.push(exerciseCategory);
  }

  query += ' ORDER BY created_at DESC';

  db.query(query, queryParams, (err, results) => {
      if (err) {
          console.error('Error fetching exercise progress:', err);
          return res.status(500).json({ error: 'Failed to fetch exercise progress' });
      }

      res.json(results);
  });
});


// Insert exercise progress
app.post('/api/exercises-progress', (req, res) => {
  const { uid, exercise_name, exercise_category, weight, reps, sets } = req.body;

  // Validate input
  if (!uid || !exercise_name || !exercise_category || !weight || !reps || !sets) {
      return res.status(400).json({
          error: 'All fields (uid, exercise_name, exercise_category, weight, reps, sets) are required.',
      });
  }

  const query = `
      INSERT INTO exercises_progress 
      (uid, exercise_name, exercise_category, weight, reps, sets) 
      VALUES (?, ?, ?, ?, ?, ?)
  `;
  const queryParams = [uid, exercise_name, exercise_category, weight, reps, sets];

  db.query(query, queryParams, (err, result) => {
      if (err) {
          console.error('Error inserting exercise progress:', err);
          return res.status(500).json({ error: 'Failed to insert exercise progress' });
      }

      res.status(201).json({
          message: 'Exercise progress added successfully',
          progress_id: result.insertId,
      });
  });
});


// create group 
app.post('/api/groups', (req, res) => {
  const { group_name, profile_picture, location, group_type } = req.body;

  // Validate input
  if (!group_name || !group_type) {
      return res.status(400).json({
          error: 'Fields (group_name and group_type) are required.',
      });
  }

  const query = `
      INSERT INTO workout_groups 
      (group_name, profile_picture, location, group_type) 
      VALUES (?, ?, ?, ?)
  `;
  const queryParams = [group_name, profile_picture || null, location || null, group_type];

  db.query(query, queryParams, (err, result) => {
      if (err) {
          console.error('Error inserting group:', err);
          return res.status(500).json({ error: 'Failed to insert group' });
      }

      res.status(201).json({
          message: 'Group added successfully',
          group_id: result.insertId,
      });
  });
});


// get all groups
app.get('/api/groups', (req, res) => {
  const query = 'SELECT * FROM workout_groups ORDER BY created_at DESC';

  db.query(query, (err, results) => {
      if (err) {
          console.error('Error fetching groups:', err);
          return res.status(500).json({ error: 'Failed to fetch groups' });
      }

      res.status(200).json(results);
  });
});






// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
