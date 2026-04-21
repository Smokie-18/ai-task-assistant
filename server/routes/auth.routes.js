// server/routes/auth.routes.js
import express from 'express';
import passport from 'passport';
import protect from '../middlewares/auth.middleware.js';
import { isGoogleAuthConfigured } from '../config/passport.js';
import {
  register,
  login,
  refresh,
  logout,
  googleCallback,
  getMe,
} from '../controllers/authController.js';

const router = express.Router();

const requireGoogleAuthConfig = (req, res, next) => {
  if (!isGoogleAuthConfigured) {
    return res.status(503).json({ message: 'Google OAuth is not configured' });
  }

  next();
};

// local auth
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

// google oauth
router.get('/google', requireGoogleAuthConfig, passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false,
}));

router.get('/google/callback',
  requireGoogleAuthConfig,
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`,
  }),
  googleCallback
);

// protected
router.get('/me', protect, getMe);

export default router;
