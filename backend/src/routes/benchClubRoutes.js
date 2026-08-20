import express from 'express';
import { pool } from '../db/index.js';
import jwt from 'jsonwebtoken'; // ✅ Import jwt
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// ✅ Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid token',
    });
  }
};

// ✅ Cloudinary Upload Function
const uploadToCloudinary = async (fileBuffer, fileName) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'video',
        folder: 'bench-club',
        public_id: `bench_${Date.now()}_${fileName.split('.')[0]}`,
        eager: [{ format: 'mp4', transformation: [{ quality: 'auto' }] }],
        eager_async: true,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            url: result?.secure_url || '',
            publicId: result?.public_id || '',
          });
        }
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// ✅ Multer for video upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/webm', 'video/quicktime'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only video files are allowed.'));
    }
  },
});

// ✅ NEW: Video Upload Route
router.post('/upload-video', authenticateToken, upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Video file is required.',
      });
    }

    const { url: videoUrl, publicId: videoPublicId } = await uploadToCloudinary(
      req.file.buffer,
      req.file.originalname
    );

    res.json({
      success: true,
      data: {
        video_url: videoUrl,
        public_id: videoPublicId,
      },
    });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload video.',
    });
  }
});

// ✅ Submit Application with user_id
router.post('/apply', authenticateToken, async (req, res) => {
  try {
    const {
      user_id,
      fullName,
      email,
      socialHandle,
      phoneNumber,
      lift,
      weightTier,
      videoUrl,
      additionalNotes,
    } = req.body;

    // ✅ Validate user exists
    const [userCheck] = await pool.execute(
      'SELECT id FROM users WHERE id = ?',
      [user_id]
    );

    if (!Array.isArray(userCheck) || userCheck.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // ✅ Insert application with user_id
    const [result] = await pool.execute(
      `INSERT INTO bench_club_applications 
       (user_id, full_name, email, instagram_handle, phone_number, lift_type, weight_tier, video_url, additional_notes, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        fullName.trim(),
        email.trim().toLowerCase(),
        socialHandle.trim(),
        phoneNumber || null,
        lift,
        weightTier,
        videoUrl,
        additionalNotes || null,
        'pending',
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      data: {
        id: result.insertId,
        user_id,
        video_url: videoUrl,
      },
    });
  } catch (error) {
    console.error('Submit Error:', error);
    res.status(500).json({
      success: false,
      error: 'Something went wrong. Please try again.',
    });
  }
});

// ✅ Get user's applications
router.get('/my-applications', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.execute(
      `SELECT 
        id, 
        full_name as name, 
        email, 
        instagram_handle, 
        lift_type, 
        weight_tier, 
        video_url, 
        additional_notes as notes, 
        status, 
        created_at 
      FROM bench_club_applications 
      WHERE user_id = ? 
      ORDER BY created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error('Fetch my applications error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch applications.',
    });
  }
});

// ✅ Get user's member status
router.get('/my-member', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.execute(
      `SELECT 
        id, 
        full_name as name, 
        email, 
        weight_tier, 
        member_number, 
        created_at as approved_at 
      FROM bench_club_members 
      WHERE user_id = ?`,
      [userId]
    );

    res.json({
      success: true,
      data: rows[0] || null,
    });
  } catch (error) {
    console.error('Fetch member error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch member status.',
    });
  }
});

// Get all applications with filters (Admin)
router.get('/applications', async (req, res) => {
  try {
    const { status } = req.query;

    let query = `
      SELECT 
        id, 
        full_name as name, 
        email, 
        phone_number as phone, 
        instagram_handle, 
        weight_tier, 
        video_url, 
        additional_notes as notes, 
        status, 
        created_at 
      FROM bench_club_applications
    `;

    const params = [];

    if (status && status !== 'all') {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.execute(query, params);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error('Fetch applications error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch applications.',
    });
  }
});

// Approve application (Admin)
router.put('/applications/:id/approve', async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;

    await connection.beginTransaction();

    const [apps] = await connection.execute(
      'SELECT user_id, full_name, email, weight_tier FROM bench_club_applications WHERE id = ? AND status = "pending"',
      [id]
    );

    if (!apps.length) {
      throw new Error('Application not found or already processed');
    }

    const app = apps[0];

    const [countResult] = await connection.execute(
      'SELECT MAX(member_number) as max_num FROM bench_club_members'
    );
    const nextNumber = (countResult[0]?.max_num || 0) + 1;

    await connection.execute(
      `INSERT INTO bench_club_members 
       (user_id, full_name, email, weight_tier, member_number, application_id) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [app.user_id, app.full_name, app.email, app.weight_tier, nextNumber, id]
    );

    await connection.execute(
      'UPDATE bench_club_applications SET status = ?, updated_at = NOW() WHERE id = ?',
      ['approved', id]
    );

    await connection.commit();

    const [memberResult] = await connection.execute(
      'SELECT * FROM bench_club_members WHERE application_id = ?',
      [id]
    );

    res.json({
      success: true,
      data: memberResult[0] || null,
      message: 'Application approved successfully!',
    });
  } catch (error) {
    await connection.rollback();
    console.error('Approval error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to approve application.',
    });
  } finally {
    connection.release();
  }
});

// Reject application (Admin)
router.put('/applications/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'UPDATE bench_club_applications SET status = ?, updated_at = NOW() WHERE id = ? AND status = "pending"',
      ['rejected', id]
    );

    if (result.affectedRows === 0) {
      throw new Error('Application not found or already processed');
    }

    res.json({
      success: true,
      message: 'Application rejected.',
    });
  } catch (error) {
    console.error('Reject error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reject application.',
    });
  }
});

// src/routes/benchClubRoutes.ts

// ✅ Add this route after other routes
// Get all members (Admin)
router.get('/members', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT 
        id, 
        full_name as name, 
        email, 
        weight_tier, 
        member_number, 
        created_at as approved_at 
      FROM bench_club_members 
      ORDER BY created_at DESC`
    );
    
    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error('Fetch members error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch members.',
    });
  }
});

export default router;