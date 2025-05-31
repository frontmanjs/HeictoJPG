# Firebase Studio HEIC to JPG Converter

This is a Next.js application built in Firebase Studio that allows users to convert HEIC/HEIF files to JPG format locally in their browser.

To get started with development, take a look at `src/app/page.tsx`.

## Running the Development Server

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:9002](http://localhost:9002) (or the port specified in your `package.json`) with your browser to see the result.

## Building for Production

To create a production-ready build of your application, run:
```bash
npm run build
```
This command will generate an optimized version of your app in the `.next` folder.

## Deployment to a Custom Server

Deploying a Next.js application to your own server involves a few more steps than a static website. Here's a general guide:

**Prerequisites on your server:**
*   **Node.js:** Ensure you have a recent version of Node.js (LTS recommended) installed.
*   **npm (or yarn/pnpm):** Node.js usually comes with npm.

**Deployment Steps:**

1.  **Transfer Project Files to Server:**
    *   You can use `git clone` if your project is in a Git repository.
    *   Alternatively, use tools like `scp`, `sftp`, or `rsync` to copy your project files (excluding `node_modules` and `.next` if you plan to build on the server) to your server.

2.  **Install Dependencies on Server:**
    Navigate to your project directory on the server via SSH and run:
    ```bash
    npm install
    ```
    This will install all necessary dependencies listed in `package.json`.

3.  **Build the Application on Server:**
    In the same project directory on the server, run:
    ```bash
    npm run build
    ```
    This command compiles your Next.js application for production and creates the `.next` folder.

4.  **Start the Production Server:**
    To run your application, use:
    ```bash
    npm run start
    ```
    By default, this will start the Next.js production server, usually on port 3000.

5.  **Keep the Application Running (Recommended):**
    For long-running applications, it's highly recommended to use a process manager like `pm2`. This will keep your app alive, restart it on crashes, and help manage logs.
    *   Install `pm2` globally (if not already installed):
        ```bash
        npm install pm2 -g
        ```
    *   Start your application with `pm2`:
        ```bash
        pm2 start npm --name "heic-converter-app" -- start
        ```
    *   You can manage your app with commands like `pm2 list`, `pm2 stop heic-converter-app`, `pm2 logs heic-converter-app`.
    *   To ensure `pm2` restarts your app after a server reboot: `pm2 startup` (follow instructions) and then `pm2 save`.

6.  **Configure a Reverse Proxy (Optional but Recommended):**
    It's common practice to use a web server like Nginx or Apache as a reverse proxy in front of your Node.js application. This allows you to:
    *   Handle SSL/TLS (HTTPS).
    *   Serve static assets efficiently.
    *   Implement caching and load balancing.
    *   Run multiple applications on the same server on standard ports (80/443).

    **Example Nginx Configuration (simplified):**
    Assuming your Next.js app runs on `http://localhost:3000`:
    ```nginx
    server {
        listen 80;
        server_name your_domain.com www.your_domain.com;

        location / {
            proxy_pass http://localhost:3000; # Forward requests to your Next.js app
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

        # For HTTPS, you would typically configure SSL certificates here:
        # listen 443 ssl;
        # ssl_certificate /path/to/your/fullchain.pem;
        # ssl_certificate_key /path/to/your/privkey.pem;
        # ... other SSL settings ...
    }
    ```
    Remember to reload your web server's configuration after making changes (e.g., `sudo systemctl reload nginx`).

**Note:** The exact commands and file paths might vary slightly depending on your server's operating system and configuration.

## Firebase App Hosting

This project also includes an `apphosting.yaml` file, which means it can be easily deployed to Firebase App Hosting. If you prefer this method:

1.  Ensure you have the Firebase CLI installed and are logged in (`firebase login`).
2.  Run the deployment command from your project's root directory:
    ```bash
    firebase deploy
    ```
    Firebase CLI will handle the build and deployment process.
```