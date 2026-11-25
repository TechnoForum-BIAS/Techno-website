# 🛠️ Technoforum BIAS: Troubleshooting & FAQs

This guide contains instant solutions to all common engineering errors encountered during local development.

---

## Troubleshooting Matrix

| Error / Symptom | Root Cause | Exact Solution |
| :--- | :--- | :--- |
| **`npm : File ... npm.ps1 cannot be loaded because running scripts is disabled`** | Windows PowerShell security execution policy blocks script execution. | Run PowerShell as Administrator and run:<br>`Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`<br>Or run commands with `npm.cmd` instead of `npm`. |
| **`error: Your local changes to the following files would be overwritten by merge/checkout`** | Uncommitted local work is colliding with an incoming pull. | Run:<br>`git stash`<br>`git pull origin develop`<br>`git stash pop` |
| **`fatal: refusing to merge unrelated histories`** | Remote branch and local branch started with different commit roots. | Run:<br>`git pull origin develop --allow-unrelated-histories` |
| **`Error: listen EADDRINUSE: address already in use :::5000` / `:::5173`** | An old Node.js or Vite process is hanging in the background and holding the port. | **Windows (PowerShell)**:<br>`netstat -ano \| findstr :5000`<br>`taskkill /PID <PID_NUMBER> /F`<br>**Mac / Linux**:<br>`kill -9 $(lsof -t -i:5000)` |
| **`Cannot find module 'lucide-react'` or missing dependencies** | Packages were not installed across all directories. | Run from the repository root:<br>`npm run install:all`<br>(Installs dependencies in root, `client/`, and `server/`). |
| **`fetch('/api/...') returns 404 Not Found` or `ECONNREFUSED`** | The Express backend server is not running on port 5000. | Start the server in a separate terminal:<br>`npm run server`<br>Or start both concurrently: `npm run dev`. |
| **Supabase or Brevo API keys missing in `.env`** | You do not have access to live cloud keys yet. | **No action needed!** The backend has an automatic zero-dependency in-memory mock engine that serves mock events, mock inventory, and mock notices so frontend work is never blocked. |
| **`npm run build` fails with `Failed to resolve import`** | Case-sensitivity typo in a component file path (e.g. `eventCard.jsx` vs `EventCard.jsx`). | Git on Windows is case-insensitive, but Linux production environments are case-sensitive. Always verify exact file casing matching the filesystem. |

---

## Frequently Asked Questions (FAQ)

### Q1: Can I test my frontend features without cloud keys?
**Yes!** The backend detects when Supabase or Brevo credentials are placeholders and automatically falls back to an in-memory mock engine. All features (Events, Hardware, Certificates, Notices) work out of the box.

### Q2: How do I know if my code is ready to push?
Run:
```bash
npm --prefix client run build
```
If Vite outputs `✓ built in ...ms` with **0 errors**, your code is clean and safe to push.

### Q3: Where do I open my Pull Request?
Always open PRs against the **`develop`** branch on GitHub. Never merge directly into `main`.
