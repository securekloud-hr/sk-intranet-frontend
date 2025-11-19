/**
 * API base URL configuration
 *
 * 🟢 In development:
 *    - The frontend runs on Vite (e.g., http://localhost:8081)
 *    - The backend runs on Node/Express (http://localhost:8000)
 *
 * 🟢 In production:
 *    - The frontend is served by Nginx (e.g., http://yourdomain.com)
 *    - Nginx proxies all /api requests to the backend running on port 8000
 *
 * So:
 *  - In dev → "http://localhost:8000"
 *  - In prod → "" (frontend will call /api/..., Nginx handles the rest)
 */

const API_BASE_URL = import.meta.env.VITE_API_URL

export default API_BASE_URL;