# Project Requirements Document: Heady Lab Results

## 1. Project Overview

Heady Lab Results is a web-based platform designed for cannabis product retailers such as vape and pre-roll businesses. The platform simplifies daily operations by allowing users to upload PDF documents containing lab results. These lab reports are then analyzed by an AI agent powered by GPT-4o, which generates optimized product descriptions. This ensures that retailers can quickly and efficiently leverage their lab data to enhance their product listings without manual copywriting.

This project is being built to address common bottlenecks in processing detailed lab results for cannabis products. Retailers benefit from a streamlined workflow that reduces manual intervention and provides descriptive, market-ready content instantly. The key objectives for the platform include secure and user-friendly account management, immediate and accurate AI-driven analysis of PDFs, responsive notifications regarding subscription statuses, and robust support for subscription tiers via Stripe integration. Success will be measured by improved operational efficiency, enhanced user satisfaction, and seamless integration of all core functionalities.

## 2. In-Scope vs. Out-of-Scope

### In-Scope

*   User account creation with role-based access (administrators and regular retailers).
*   Secure authentication using Clerk or Supabase and subscription management.
*   PDF upload feature with strict validations (only PDFs under 1 MB and maximum 5 pages).
*   Immediate triggering of lab results analysis using GPT-4o with an asynchronous queue for processing.
*   Display of AI-generated product descriptions and insights on a dedicated results page.
*   Tools to export activity logs and lab analysis data as CSV reports.
*   Integration with Stripe for handling subscriptions, free trials, and payment retries.
*   Implementation of low-credit alerts and subscription renewal reminders via email.
*   A modern, minimalistic UI built using Next.js 14, Tailwind CSS, and shadcn components.
*   Secure data handling and adherence to privacy standards for sensitive lab details.

### Out-of-Scope

*   Batch uploads of PDFs or support for file formats other than PDF.
*   SMS or push notifications for low-credit alerts (email notifications only).
*   Integration with third-party APIs beyond GPT-4o, Stripe, and Supabase during the initial launch.
*   Advanced customization of product descriptions beyond the scope of GPT-4o analysis.
*   Extensive analytics dashboards for retailers (basic summaries only for regular users).

## 3. User Flow

When a user first lands on Heady Lab Results, they are greeted by a clean and modern registration/login interface that encourages quick onboarding. New users register using their email, set up their password, choose a subscription plan (each offering a 7-day free trial), and are directed to a home dashboard. Once logged in, the experience is customized based on the user role: regular retailers see options to upload lab results and view their generated product descriptions, whereas administrators have additional controls to manage users and view overall app analytics.

A retailer looking to process lab results navigates to the PDF upload page from the dashboard. They select the PDF document (with enforced restrictions: under 1 MB and no more than 5 pages) and upload it. Upon submission, the system validates the document immediately and queues it for processing by GPT-4o. Users see real-time status updates on the processing progress. Once the lab analysis is complete, they are redirected to a results page that displays AI-generated product descriptions along with options to export data reports in CSV format. This intuitive flow ensures users can quickly accomplish their tasks without guesswork.

## 4. Core Features

*   **User Authentication and Role Management:**

    *   Secure login/registration for administrators and retailers.
    *   Differentiated access: Administrators manage users & app settings; Retailers access personal lab data and results.

*   **PDF Upload and Processing Workflow:**

    *   Single PDF uploads with strict validation (file type, size under 1 MB, maximum 5 pages).
    *   Immediate file validation and asynchronous queue management for processing via GPT-4o.
    *   Real-time status notifications regarding analysis progress.

*   **AI-Driven Product Description Generation:**

    *   Integration with GPT-4o to transform lab results into optimized product descriptions for the cannabis industry.

*   **Subscription Management and Payment Integration:**

    *   Tiered subscription plans (Basic, Enterprise) including a 7-day free trial across tiers.
    *   Stripe integration to handle subscriptions, payment failures (with up to three retry attempts), and automated renewal reminders.

*   **Low-Credit Alerts and Email Notifications:**

    *   Email-based notifications alerting users when their subscriptions or credits are nearing expiration.

*   **Reporting and Data Export:**

    *   Ability to generate CSV reports containing timestamps, product details, and activity logs.

*   **Modern Minimalist User Interface:**

    *   Built with Next.js 14, Tailwind CSS, shadcn UI, ensuring usability and a modern look.

## 5. Tech Stack & Tools

*   **Frontend:**

    *   Framework: Next.js 14 (using app router).
    *   Language: TypeScript.
    *   Styling: Tailwind CSS with shadcn UI components for a minimalistic modern look.

*   **Backend & Storage:**

    *   Database, Authentication, Storage: Supabase.
    *   Secure server handling PDF validation & asynchronous processing.

*   **AI Integration:**

    *   GPT-4o for processing lab results and generating product descriptions specifically optimized for cannabis products.

*   **Payment Processing:**

    *   Stripe for managing subscriptions, free trials, and handling payment failures and renewals.

*   **Developer Tools & Integrations:**

    *   Cursor for advanced real-time IDE suggestions and AI-powered coding assistance.
    *   Lovable.dev for generating both front-end and full-stack code components.

## 6. Non-Functional Requirements

*   **Performance:**

    *   Immediate feedback after PDF uploads, with minimal processing delay through efficient asynchronous queuing.
    *   Quick response times across the application with optimized load times.

*   **Security:**

    *   Secure user data handling and storage, especially for sensitive lab details.
    *   Role-based access control ensuring only authorized users access specific functionalities.

*   **Usability:**

    *   A modern, minimalistic interface ensuring ease of use for both technologically experienced and novice users.
    *   Clear navigation elements and straightforward instructions guiding users through upload, analysis, and report phases.

*   **Compliance:**

    *   Adherence to data protection standards to ensure sensitive information is handled securely and privately.

## 7. Constraints & Assumptions

*   The availability and performance of GPT-4o will be reliable and support immediate triggering plus asynchronous processing.
*   PDF files are strictly limited to PDFs under 1 MB and no more than five pages; files not matching these requirements must be rejected.
*   Only email-based notifications are supported for low-credit alerts and subscription reminders.
*   The initial scope will only integrate GPT-4o, Stripe, and Supabase. No additional third-party APIs will be incorporated until the MVP is validated.
*   The minimalistic UI should avoid overly technical designs while staying modern and user-friendly.
*   Assumes that user data will be securely stored and processed according to best practices.

## 8. Known Issues & Potential Pitfalls

*   **PDF Validation Issues:**

    *   Handling cases where PDF documents are malformed or exceed stipulated limits.
    *   Mitigation: Implement strict validation logic and clear error messages for users.

*   **Asynchronous Processing Load:**

    *   High volume of simultaneous PDF uploads could slow processing times.
    *   Mitigation: Use a robust asynchronous queue system with load balancing.

*   **Subscription Payment Failures:**

    *   Payment failures might lead to user friction and potential downgrades that are not clearly communicated.
    *   Mitigation: Implement clear notification systems and retry logic, with user-friendly alerts and status updates.

*   **Role-Based Complexity:**

    *   Differentiating functionalities between administrators and regular retailers may lead to potential security loopholes if not correctly enforced.
    *   Mitigation: Clearly define roles in the backend with strong access controls and thorough testing.

*   **Integration Dependencies:**

    *   Dependence on external services (GPT-4o, Stripe, Supabase) may bring API rate limits or downtime affecting overall performance.
    *   Mitigation: Monitor service status and prepare fallback mechanisms or user notifications in case of outages.

This PRD serves as the foundational document for the development of Heady Lab Results. It clearly outlines the project’s intent, key functionalities, technology choices, and potential areas needing careful attention. All subsequent technical documents like Tech Stack, Frontend Guidelines, Backend Structure, and App Flow can now be generated with a complete understanding of the requirements and intended user experience.
