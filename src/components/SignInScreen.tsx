import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { Eye, EyeOff } from 'lucide-react';

const SignInScreen = () => {
  const { setUser } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      const name = email.split('@')[0];
      setUser(name);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotEmail.trim()) {
      setForgotSent(true);
      setTimeout(() => {
        setForgotSent(false);
        setShowForgot(false);
        setForgotEmail('');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background to-background" />
      </div>

      <div className="relative z-10 px-8 py-6">
        <h1
          className="text-3xl font-bold text-primary tracking-wider"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '3px' }}
        >
          NSTREAM
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex-1 flex items-center justify-center px-4"
      >
        <div className="w-full max-w-md bg-card/80 backdrop-blur-md rounded-lg p-10">
          {!showForgot ? (
            <>
              <h2 className="text-3xl font-bold text-foreground mb-8">Sign In</h2>

              <form onSubmit={handleSignIn} className="space-y-5">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3.5 rounded bg-secondary text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3.5 rounded bg-secondary text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary transition-all text-sm pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    Forgot your password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!email.trim() || !password.trim()}
                  className="w-full py-3.5 rounded bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sign In
                </button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-3 text-muted-foreground">or</span>
                </div>
              </div>

              <button
                onClick={() => setUser('Guest')}
                className="w-full py-3.5 rounded bg-secondary text-foreground font-semibold text-sm hover:bg-secondary/80 transition-colors"
              >
                Continue as Guest
              </button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-foreground mb-2">Forgot Password</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Enter your email and we'll send you a reset link.
              </p>

              {forgotSent ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-6"
                >
                  <p className="text-sm text-green-500 font-medium">Reset link sent! Check your inbox.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-5">
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3.5 rounded bg-secondary text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                  />
                  <button
                    type="submit"
                    disabled={!forgotEmail.trim()}
                    className="w-full py-3.5 rounded bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send Reset Link
                  </button>
                </form>
              )}

              <button
                onClick={() => { setShowForgot(false); setForgotSent(false); setForgotEmail(''); }}
                className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to Sign In
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SignInScreen;
