// create cookie with token in a function, taking arguments from controller
const jwtToken = (user, statusCode, res, req) => {
  const token = user.generateToken();

  const isProd = process.env.NODE_ENV === 'production';
  const secure = isProd || process.env.COOKIE_SECURE === 'true';
  const sameSite = secure ? 'None' : 'Lax';

  // Determine cookie domain based on request origin
  let cookieDomain = undefined;

  if (isProd) {
    const origin = req.headers.origin || req.headers.referer || '';

    if (origin.includes('blockvault.pro')) {
      cookieDomain = '.blockvault.pro';
    } else if (process.env.COOKIE_DOMAIN) {
      cookieDomain = process.env.COOKIE_DOMAIN; 
    }
  }

  // Clear any existing cookies with different domains first
  res.clearCookie('jwttoken', { path: '/' });
  res.clearCookie('jwttoken', { path: '/', domain: '.blockvault.pro' }); 

  const options = {
    expires: new Date(
      Date.now() + process.env.TOKEN_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite,
    secure,
    path: '/',
    domain: cookieDomain,
  };

  console.log('🍪 Cookie options:', { domain: cookieDomain, sameSite, secure });

  res.status(statusCode).cookie('jwttoken', token, options).json({
    success: true,
    token,
    user,
    link: false,
  });
};

module.exports = jwtToken;
