# Implementation plan

## Phase 1: Environment Setup

1. **Prevalidation:** Check if the current directory is already a initialized project by verifying the existence of a `package.json` file. (Reference: Project Overview)
2. **Node.js Installation:** Verify Node.js v20.2.1 is installed. If not, install Node.js v20.2.1 and confirm with `node -v`. (Reference: Tech Stack: Core Tools)
3. **Starter Kit Initialization:** Visit the CodeGuide Starter Pro repository and create a new repo using this starter kit. Clone it into your project directory. (Reference: Additional Notes: CodeGuide Starter Pro)
4. **Cursor Environment File Setup:**
   - Check if a `.cursor` directory exists in the project root; if not, create it. (Reference: Dev Tools: Cursor)
   - Within the `.cursor` directory, verify if `cursor_metrics.md` exists; if not, create `/cursor_metrics.md` in the project root per Cursor requirements. (Reference: Phase 1 instructions for Cursor)
5. **Supabase MCP Configuration for Cursor:**
   - Within `.cursor`, create or open the file `mcp.json`.
   - For macOS, add the configuration:
     ```json
     { "mcpServers": { "supabase": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-postgres", "<connection-string>"] } } }
     ```
   - For Windows, add the configuration:
     ```json
     { "mcpServers": { "supabase": { "command": "cmd", "args": ["/c", "npx", "-y", "@modelcontextprotocol/server-postgres", "<connection-string>"] } } }
     ```
   - Display the following link so you can retrieve your Supabase connection string: [https://supabase.com/docs/guides/getting-started/mcp#connect-to-supabase-using-mcp](https://supabase.com/docs/guides/getting-started/mcp#connect-to-supabase-using-mcp). Replace `<connection-string>` with your actual connection string once obtained. (Reference: Tech Stack: Supabase & MCP instructions)
6. **Validation (Cursor MCP):** Navigate to Settings/MCP in Cursor and verify a green active status indicating successful connection. (Reference: Dev Tools: Cursor)

## Phase 2: Frontend Development

7. **Project Structure Setup:** Ensure the Next.js 14 project uses the App Router and TypeScript as set up by CodeGuide Starter Pro. (Reference: Tech Stack: Frontend)
8. **Home Dashboard Page:** Create the Home Dashboard page at `/app/dashboard/page.tsx`. This page should display account status, subscription details, and recent activities with role-based views for both administrators and regular retailers. (Reference: App Structure: Home Dashboard)
9. **Upload Page Implementation:** Create `/app/upload/page.tsx` for PDF uploads. Integrate a file input component with the following validations:
   - Accept only PDF files
   - Maximum file size: 1 MB
   - Maximum page count: 5 pages (perform immediate client-side validation)
   (Reference: Core Features: PDF Upload)
10. **Results Analysis Page:** Create the page `/app/results/page.tsx` to display the AI-generated product descriptions and insights after processing. (Reference: App Structure: Results Analysis)
11. **Reports & Exports Page:** Create the page `/app/reports/page.tsx` to enable CSV report exports. Format the CSV to include timestamps, product details, and activity logs. (Reference: Core Features: Reporting)
12. **Account Settings Page:** Create the page `/app/account/page.tsx` for users to manage subscriptions, payment methods, and notification preferences. (Reference: App Structure: Account Settings)
13. **UI & Styling:** Integrate Tailwind CSS and shadcn UI components across pages to ensure a clean, modern, and minimalistic design. (Reference: Design & Tech Stack)
14. **Validation (Frontend):** Run the Next.js development server and manually verify navigation between pages and that validations on the Upload Page are effective. (Reference: Non-Functional Requirements: Usability)

## Phase 3: Backend Development

15. **Supabase Setup:** Ensure your Supabase project is connected via the previously configured MCP server. Verify connection using Supabase dashboard. (Reference: Tech Stack: Supabase)
16. **Database Schema Design:** Using Supabase PostgreSQL, create the following tables:
    - `users` table with role-based access fields
    - `lab_results` table to store PDF metadata and analysis results
    - `processing_queue` table to manage asynchronous AI processing tasks
    - `subscriptions` table for subscription management data
   (Reference: Core Features: User Authentication, PDF Upload, and Subscription Management)
17. **User Authentication:** Integrate Clerk Auth with Supabase to secure user accounts. Confirm role distinctions between administrators and retailers. (Reference: Core Features: User Authentication)
18. **PDF Upload API:** Create an API endpoint `POST /api/upload` in `/pages/api/upload.ts` (or use the Next.js app file structure) to accept PDF uploads. Server-side, enforce validations (file type, size, and page count) and store metadata in `lab_results` table. (Reference: Core Features: PDF Upload)
19. **AI Processing Queue API:** Create an API endpoint `POST /api/ai-process` in `/pages/api/ai-process.ts` that adds uploaded PDFs to an asynchronous processing queue for GPT-4o to generate product descriptions. (Reference: Core Features: AI Processing)
20. **Stripe Integration:** Create API endpoints under `/pages/api/subscription/` (e.g., `/create`, `/webhook`) to handle subscription operations using Stripe. Enforce subscription tiers, free trials, renewal reminders, and failed payment logic including retries for up to three attempts. (Reference: Core Features: Subscription Management)
21. **Notification System:** Develop backend logic, possibly using Supabase Functions or a serverless approach, to trigger email notifications for low-credit alerts and subscription reminders. (Reference: Core Features: Notifications)
22. **CSV Reporting API:** Create an API endpoint `GET /api/reports/export` in `/pages/api/reports/export.ts` to generate and return CSV files based on user activity and lab results. (Reference: Core Features: Reporting)
23. **Validation (Backend):** Test each endpoint manually using tools like cURL or Postman. For example, test PDF uploads with `curl -X POST http://localhost:3000/api/upload` verifying HTTP 200 and error responses where applicable. (Reference: Non-Functional Requirements: Performance)

## Phase 4: Integration

24. **Link Frontend & Backend for Uploads:** In the Upload Page (`/app/upload/page.tsx`), implement an API call (using fetch or axios) to the `POST /api/upload` endpoint. (Reference: App Structure: Upload Page)
25. **Subscription Management Integration:** On the Account Settings Page (`/app/account/page.tsx`), integrate Stripe payment functionalities by calling your subscription API endpoints and handling webhooks. (Reference: Core Features: Subscription Management)
26. **Real-Time Status Updates:** Implement real-time updates on the Results Analysis page (e.g., using Server-Sent Events or WebSockets) to inform users of the processing status of their PDFs. (Reference: Core Features: AI Processing)
27. **Role-Based Access Control:** Ensure your frontend pages check for the authenticated user’s role (admin vs. retailer) and render content accordingly. (Reference: Security: Role-based Access Control)
28. **Validation (Integration):** Conduct end-to-end tests by simulating user flows: upload a PDF, trigger AI processing, and check that subscription actions are reflected in the UI. (Reference: Non-Functional Requirements: Usability)

## Phase 5: Deployment

29. **Frontend Build & Testing:** Run a production build with `npm run build` and verify no issues. (Reference: Non-Functional Requirements: Performance)
30. **CI/CD Setup:** Configure a CI/CD pipeline (e.g., via GitHub Actions) to automate testing and deployment. (Reference: Dev Tools)
31. **Deploy Frontend:** Deploy the Next.js application (using Next.js 14, which is optimized for AI coding tools) to your chosen hosting provider (e.g., Vercel). (Reference: Tech Stack: Frontend)
32. **Deploy Backend & Database:** Ensure your Supabase instance is correctly configured and that API endpoints are accessible in production. (Reference: Tech Stack: Supabase)
33. **Stripe & Clerk Environment Variables:** Configure environment variables for Stripe keys and Clerk Auth settings in your deployment environment. (Reference: Core Features: User Authentication & Payment Processing)
34. **Post-Deployment Validation:** After deployment, perform manual tests to confirm:
    - PDF uploads work and validate correctly
    - AI processing updates are received in real-time
    - Subscription management flows operate as expected
    - CSV reports are generated accurately
   (Reference: Non-Functional Requirements: Performance & Usability)

This completes the detailed step-by-step implementation plan for Heady Lab Results, ensuring adherence to all provided project requirements and technical specifications.