const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const https = require('https');
const http = require('http'); // added to handle http→https redirect

const app = express();
const port = process.env.PORT || 3001;

console.log('🚀 Starting server...');

// ==============================
// 1️⃣ Serve React build files
// ==============================
const buildPath = path.join(__dirname, 'dist'); // change to 'build' if CRA
app.use(express.static(buildPath));

// ==============================
// 2️⃣ CORS setup
// ==============================
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, User-Agent, Referer'
  );

  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// ==============================
// 3️⃣ Custom login handler (Fixed redirect handling)
// ==============================
app.post('/loginapis/app/j_security_check', express.urlencoded({ extended: true }), async (req, res) => {
  try {
    const formData = new URLSearchParams();
    Object.keys(req.body).forEach((key) => formData.append(key, req.body[key]));

    // Step 1: Send POST to TDSCPC login endpoint
    const step1Options = {
      hostname: 'www.tdscpc.gov.in',
      path: '/app/j_security_check',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(formData.toString()),
        'Origin': 'https://www.tdscpc.gov.in',
        'Referer': 'https://www.tdscpc.gov.in/app/login.xhtml',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    };

    const step1Req = https.request(step1Options, (step1Res) => {
      console.log('Step 1 - POST /j_security_check status:', step1Res.statusCode);

      // ---- Handle redirect case (302 Found) ----
      if (step1Res.statusCode === 302 && step1Res.headers.location) {
        let redirectUrl = step1Res.headers.location;
        console.log('Step 2 - Redirect to:', redirectUrl);

        // Ensure HTTPS (browser enforces HSTS, but we do too)
        if (redirectUrl.startsWith('http://')) {
          redirectUrl = redirectUrl.replace('http://', 'https://');
        }

        const redirectPath = new URL(redirectUrl).pathname;

        // Step 3: Follow redirect manually
        const step3Options = {
          hostname: 'www.tdscpc.gov.in',
          path: redirectPath,
          method: 'GET',
          headers: {
            Cookie: step1Res.headers['set-cookie']
              ? step1Res.headers['set-cookie'].join('; ')
              : '',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            Referer: 'https://www.tdscpc.gov.in/app/login.xhtml',
            Accept:
              'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          },
        };

        const step3Req = https.request(step3Options, (step3Res) => {
          let finalBody = '';
          step3Res.on('data', (chunk) => (finalBody += chunk));
          step3Res.on('end', () => {
            console.log('Step 3 - Final HTML length:', finalBody.length);

            res
              .header('Access-Control-Allow-Origin', 'http://localhost:3000')
              .header('Access-Control-Allow-Credentials', 'true')
              .header('Content-Type', 'text/html; charset=utf-8')
              .status(200)
              .send(finalBody);
          });
        });

        step3Req.on('error', (err) => {
          console.error('Step 3 request error:', err);
          res.status(500).send('Final redirect fetch error');
        });

        step3Req.end();
      } else {
        // ---- Non-redirect case ----
        let body = '';
        step1Res.on('data', (chunk) => (body += chunk));
        step1Res.on('end', () => {
          console.log('Non-redirect login response length:', body.length);
          res
            .header('Access-Control-Allow-Origin', 'http://localhost:3000')
            .header('Access-Control-Allow-Credentials', 'true')
            .status(step1Res.statusCode)
            .send(body);
        });
      }
    });

    step1Req.on('error', (err) => {
      console.error('Step 1 request error:', err);
      res.status(500).send('Initial request error');
    });

    step1Req.write(formData.toString());
    step1Req.end();
  } catch (error) {
    console.error('Login handler error:', error);
    res.status(500).send('Server internal error');
  }
});

// ==============================
// 4️⃣ Proxy routes
// ==============================

// For tdscpc APIs (captcha/images/etc.)
app.use(
  '/loginapis',
  createProxyMiddleware({
    target: 'https://www.tdscpc.gov.in',
    changeOrigin: true,
    secure: true,
    pathRewrite: { '^/loginapis': '' },
    cookieDomainRewrite: { '*': '' },
    onProxyRes: (proxyRes, req, res) => {
      proxyRes.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000';
      proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
      console.log(`Proxy: ${req.method} ${req.url} -> ${proxyRes.statusCode}`);
    },
  })
);

// For OCR service
app.use(
  '/brqaiagent',
  createProxyMiddleware({
    target: 'http://localhost:8000',
    changeOrigin: true,
    secure: false,
    pathRewrite: { '^/brqaiagent': '' },
    cookieDomainRewrite: { '*': '' },
    onProxyRes: (proxyRes, req, res) => {
      proxyRes.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000';
      proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
    },
  })
);

// ==============================
// 5️⃣ Health check
// ==============================
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// ==============================
// 6️⃣ Fallback for SPA routing
// ==============================
app.get('*', (req, res, next) => {
  if (req.url.startsWith('/loginapis') || req.url.startsWith('/brqaiagent')) return next();
  res.sendFile(path.join(buildPath, 'index.html'));
});

// ==============================
// 7️⃣ Start the server
// ==============================
app
  .listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
    console.log(`📁 Serving React app from: ${buildPath}`);
  })
  .on('error', (err) => console.error('❌ Server failed to start:', err));
