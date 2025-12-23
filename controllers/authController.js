const { supabase } = require('../config/supabase');

// Register
exports.showRegister = function (req, res) {
    res.render('auth/register', { title: 'Register Page', error: null, success: null });
};

exports.handleRegister = async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.render('auth/register', {
        title: 'Register Page',
        error: 'Email and password are required',
        success: null
    });
  }

  if (!supabase) {
    return res.render('auth/register', {
        title: 'Register Page',
        error: 'Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in .env',
        success: null
    });
  }

  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      return res.render('auth/register', {
        title: 'Register Page',
        error: error.message || 'Registration failed',
        success: null
      });
    }

    return res.render('auth/register', {
        title: 'Register Page',
        error: null,
        success: data?.user?.id
            ? 'Account created! Check your email to confirm.'
            : 'Sign-up request sent. Check your inbox.'
    });
  } catch (err) {
    return res.render('auth/register', {
        title: 'Register Page',
        error: 'Unexpected error during registration',
        success: null
    });
  }
};


// Login
exports.showLogin = function (req, res) {
    res.render('auth/login', { title: 'Login Page', error: null, success: null });
};

exports.handleLogin = async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.render('auth/login', {
        title: 'Login Page',
        error: 'Email and password are required',
        success: null
    });
  }

  if (!supabase) {
    return res.render('auth/login', {
        title: 'Login Page',
        error: 'Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in .env',
        success: null
    });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return res.render('auth/login', {
        title: 'Login Page',
        error: error.message || 'Login failed',
        success: null
      });
    }

    return res.render('auth/login', {
        title: 'Login Page',
        error: null,
        success: data?.user?.id ? 'Logged in successfully.' : 'Login completed.'
    });
  } catch (err) {
    return res.render('auth/login', {
        title: 'Login Page',
        error: 'Unexpected error during login',
        success: null
    });
  }
};
