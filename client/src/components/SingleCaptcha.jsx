import { useState } from 'react';

const SingleCaptcha = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [captchatext, setCaptchatext] = useState('');
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [captchaMessage, setCaptchaMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 🔍 Helper: extract validation message from HTML
  const extractValidationMessage = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const messageSpan = doc.querySelector('span#message');
    if (messageSpan) return messageSpan.textContent.trim();

    const errorSummary = doc.querySelector('span.mandatory#err_Summary');
    if (errorSummary) return errorSummary.textContent.trim();

    const errorElements = doc.querySelectorAll(
      '[class*="error"], [class*="mandatory"], [id*="error"], [id*="err"]'
    );
    for (let el of errorElements) {
      const text = el.textContent.trim();
      if (text) return text;
    }
    return null;
  };

  // 🧠 Check login/captcha status
  const checkCaptchaStatus = async () => {
    try {
      setIsLoading(true);

      const formData = new URLSearchParams();
      formData.append('search1', 'on');
      formData.append('username', 'fgghhfdddf');
      formData.append('j_username', 'fgghhfdddf^AAAA99999A');
      formData.append('selradio', 'D');
      formData.append('ticker', '');
      formData.append('j_password', 'ddffgghhhh');
      formData.append('j_tanPan', 'AAAA99999A');
      formData.append('j_captcha', captchatext.detected_text || captchatext);

      // Step 1: POST to proxy (our Express handles redirect internally)
      const loginResponse = await fetch('/loginapis/app/j_security_check', {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        redirect: 'manual',
      });

      // Step 2: Try to read redirect location if present
      const redirectUrl = loginResponse.headers.get('location');
      console.log('Redirected to:', redirectUrl);

      let responseText = '';

      if (redirectUrl) {
        // Step 3a: Follow redirect manually
        const redirectedResponse = await fetch(
          '/loginapis' + new URL(redirectUrl).pathname,
          { credentials: 'include' }
        );
        responseText = await redirectedResponse.text();
        console.log('Followed redirect -> status:', redirectedResponse.status);
      } else {
        // Step 3b: Fallback - backend already returned HTML (most likely)
        responseText = await loginResponse.text();
        console.log('Used direct body from backend.');
      }

      console.log('Response length:', responseText.length);

      // Step 4: Extract validation message
      const validationMessage = extractValidationMessage(responseText);
      console.log('Extracted validation message:', validationMessage);

      if (validationMessage) {
        setIsCaptchaValid(false);
        setCaptchaMessage(validationMessage);
      } else if (
        responseText.includes('Welcome') ||
        responseText.includes('dashboard') ||
        responseText.includes('Portfolio')
      ) {
        setIsCaptchaValid(true);
        setCaptchaMessage('Login Successful!');
      } else if (responseText.length > 0) {
        setIsCaptchaValid(false);
        setCaptchaMessage('Login failed - could not detect error text.');
      } else {
        setIsCaptchaValid(false);
        setCaptchaMessage('Empty response from server.');
      }
    } catch (err) {
      console.error('Error in checkCaptchaStatus:', err);
      setCaptchaMessage('Error validating captcha: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔠 Get captcha image + OCR detection
  const getCaptchaText = async () => {
    try {
      setIsCaptchaValid(false);
      setCaptchaMessage('');
      setIsLoading(true);
      setImageUrl('');
      setCaptchatext('');

      // 1️⃣ Fetch captcha image via proxy
      const captchaResponse = await fetch('/loginapis/app/srv/GetCaptchaImg', {
        credentials: 'include',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      if (!captchaResponse.ok)
        throw new Error(`Failed to fetch captcha: ${captchaResponse.status}`);

      const blob = await captchaResponse.blob();
      const url = URL.createObjectURL(blob);
      setImageUrl(url);

      // 2️⃣ Send to OCR API
      const ocrFormData = new FormData();
      ocrFormData.append('file', blob, 'captcha.png');

      const apiResponse = await fetch('/brqaiagent/detect-text', {
        method: 'POST',
        body: ocrFormData,
      });

      if (!apiResponse.ok)
        throw new Error(`OCR API error: ${apiResponse.status}`);

      const result = await apiResponse.json();
      console.log('OCR Result:', result);
      setCaptchatext(result);

      // 3️⃣ Try login check after 1s
      setTimeout(() => checkCaptchaStatus(), 1000);
    } catch (err) {
      console.error('Error in getCaptchaText:', err);
      setCaptchaMessage('Error fetching captcha: ' + err.message);
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      {/* Button */}
      <button
        onClick={getCaptchaText}
        disabled={isLoading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: isLoading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
        }}
      >
        {isLoading ? 'Loading...' : 'Get Captcha Text'}
      </button>

      <br />
      <br />

      {/* Captcha Image */}
      {imageUrl && (
        <div>
          <img
            src={imageUrl}
            alt="captcha"
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              backgroundColor: '#f5f5f5',
              maxWidth: '100%',
              height: 'auto',
            }}
          />
          <br />
        </div>
      )}

      {/* Detected Captcha */}
      {captchatext && (
        <div>
          <label
            style={{
              fontSize: '24px',
              color: 'blue',
              fontWeight: 'bold',
              display: 'inline-block',
              margin: '10px 0',
              padding: '10px',
              backgroundColor: '#f0f8ff',
              borderRadius: '5px',
            }}
          >
            Detected: {captchatext.detected_text || captchatext}
          </label>
          <br />
        </div>
      )}

      {/* Captcha Message */}
      {captchaMessage && (
        <label
          style={{
            fontSize: '24px',
            color: isCaptchaValid ? 'green' : 'red',
            fontWeight: 'bold',
            display: 'inline-block',
            margin: '10px 0',
            padding: '10px',
            backgroundColor: isCaptchaValid ? '#f0fff0' : '#fff0f0',
            borderRadius: '5px',
          }}
        >
          {captchaMessage}
        </label>
      )}

      {/* Loading state */}
      {isLoading && (
        <div style={{ marginTop: '10px' }}>
          <p>Processing... Please wait</p>
        </div>
      )}
    </div>
  );
};

export default SingleCaptcha;