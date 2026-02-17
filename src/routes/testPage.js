
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Firebase OTP Test</title>
    <script type="module">
      import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
      import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } 
      from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

      const firebaseConfig = {
        apiKey: "YOUR_WEB_API_KEY",
        authDomain: "YOUR_PROJECT.firebaseapp.com",
        projectId: "YOUR_PROJECT_ID"
      };

      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);

      window.sendOtp = async () => {
        const phone = document.getElementById("phone").value;

        window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {});
        const appVerifier = window.recaptchaVerifier;

        const confirmation = await signInWithPhoneNumber(auth, phone, appVerifier);
        window.confirmationResult = confirmation;

        alert("OTP Sent");
      };

      window.verifyOtp = async () => {
        const code = document.getElementById("otp").value;

        const result = await window.confirmationResult.confirm(code);
        const idToken = await result.user.getIdToken();

        document.getElementById("token").innerText = idToken;
      };
    </script>
  </head>
  <body>
    <h2>Phone OTP Test</h2>

    <input id="phone" placeholder="+919999999999" />
    <button onclick="sendOtp()">Send OTP</button>

    <div id="recaptcha-container"></div>

    <br/><br/>

    <input id="otp" placeholder="Enter OTP" />
    <button onclick="verifyOtp()">Verify OTP</button>

    <h3>ID Token:</h3>
    <p id="token" style="word-break: break-all;"></p>
  </body>
  </html>
  `;
  
  module.exports.page = async (req, res) => {
    res.send(html);
  };

  //module.exports = router;