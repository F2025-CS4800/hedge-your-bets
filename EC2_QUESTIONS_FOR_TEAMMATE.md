# EC2 Configuration Questions
Hey! We're integrating the frontend with the backend API and need to configure CORS (Cross-Origin Resource Sharing) properly. Can you answer these questions about our EC2 deployment?

## Questions:

### 1. **Are both frontend and backend on the same EC2 instance?**
   - [ ] Yes, same instance
   - [ ] No, separate instances
   - [ ] Not deployed yet

### 2. **What is the frontend URL in production?**
   Examples:
   - `http://ec2-18-123-45-67.us-east-1.compute.amazonaws.com:3000`
   - `https://hedgeyourbets.com`
   - `http://your-ec2-public-ip:3000`
   
   **Answer:** ______________________________________

### 3. **What is the backend URL in production?**
   Examples:
   - `http://ec2-18-123-45-67.us-east-1.compute.amazonaws.com:8000`
   - `https://api.hedgeyourbets.com`
   - `http://your-ec2-public-ip:8000`
   
   **Answer:** ______________________________________

### 4. **What ports are you using?**
   - Frontend port: _______ (usually 3000)
   - Backend port: _______ (usually 8000)

### 5. **Do you have a domain name set up?**
   - [ ] Yes, domain name: ______________________
   - [ ] No, using EC2 public IP/hostname

### 6. **Are you using HTTPS (SSL)?**
   - [ ] Yes, we have SSL certificates
   - [ ] No, just HTTP for now
   - [ ] Planning to add later

### 7. **How is the frontend accessing the backend currently?**
   - [ ] Same domain, different ports (e.g., `example.com:3000` → `example.com:8000`)
   - [ ] Different subdomains (e.g., `app.example.com` → `api.example.com`)
   - [ ] Direct IP address
   - [ ] Not accessing it yet / not set up

### 8. **EC2 Instance Details (if you know them):**
   - Public IP: _______________________
   - Region: _______________________
   - Instance type: _______________________

---

## Why We Need This:

We need to configure:
1. **CORS settings** in Django (so frontend can call backend API)
2. **API URL** in frontend environment variables (so frontend knows where backend is)

Without proper CORS, the browser will block API calls between frontend and backend!

---

## For Local Development (FYI):

We're currently testing with:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`

But need production URLs to deploy properly.

---

Thanks! 🙏

