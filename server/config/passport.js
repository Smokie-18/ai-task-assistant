
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

export const isGoogleAuthConfigured =
  Boolean(process.env.GOOGLE_CLIENT_ID) &&
  Boolean(process.env.GOOGLE_CLIENT_SECRET) &&
  process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id' &&
  process.env.GOOGLE_CLIENT_SECRET !== 'your_google_client_secret';

if (isGoogleAuthConfigured) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value?.toLowerCase();

          if (!email) {
            return done(new Error('Google account email not available'), null);
          }

          let user = await User.findOne({ email });

          if (user) {
            return done(null, user);
          }

          user = await User.create({
            name: profile.displayName,
            email,
            avatar: profile.photos?.[0]?.value || '',
            authProvider: 'google',
            googleId: profile.id,
            isVerified: true,
          });

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
}

export default passport;
