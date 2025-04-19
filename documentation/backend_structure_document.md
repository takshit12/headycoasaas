# Backend Structure Document

This document outlines the foundation of the backend for the Heady Lab Results project. It explains the architecture, database management, API design, hosting, infrastructure, security, and monitoring practices in everyday language. This document ensures that team members, regardless of their technical background, understand how the backend system is put together and maintained.

## 1. Backend Architecture

The backend is built on modern and reliable design patterns and frameworks, focusing on scalability, maintainability, and performance. Key points include:

- **Frameworks & Patterns**:
  - Uses a serverless approach through Supabase for database and storage operations.
  - Implements asynchronous task management for PDF uploads and AI processing, allowing tasks to be queued and processed independently.
  - The design follows clear separation of concerns (authentication, data processing, payment handling, etc.), ensuring each component can evolve independently.

- **Scalability & Maintainability**:
  - The use of cloud services (Supabase, Stripe, and external AI integration like GPT-4o) means that as traffic increases the system scales with minimal modifications.
  - Modular design approach helps in maintaining and updating parts of the system without affecting the whole platform.

- **Performance**:
  - Immediate feedback is provided through asynchronous processing, ensuring that users experience quick responses even if the underlying operations take a little longer.
  - Role-based dashboards ensure that different users see only the data relevant to them, improving overall response time and security.

## 2. Database Management

The project uses a modern cloud-based database solution to handle data in a structured and secure manner. Details include:

- **Database Technology**:
  - **Supabase Database**: A Postgres-based system that offers SQL capabilities along with built-in authentication and storage.

- **Data Management Practices**:
  - Data is structured in relational tables to keep user information, lab results, subscription details, and logs organized.
  - Regular backups and version control practices are in place to ensure data is safe, recoverable, and consistently up-to-date.
  - Efficient queries and indexing are used to ensure quick data retrieval even as the data grows.

## 3. Database Schema

### Human Readable Overview:

- **Users Table**: Contains information about both administrators and retailers, along with their roles and permissions.
- **Lab Results Table**: Stores metadata related to uploaded PDFs including file name, upload date, and processing status.
- **Subscription & Payment Details**: Contains records of subscription tiers, trial periods, payment statuses, and alert notifications.
- **Activity Logs**: Tracks user actions, PDF upload events, AI processing events, and any changes in user account settings.

### Example PostgreSQL Schema:

Below is a simplified version in PostgreSQL syntax:

---------------------------------------------------------
-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,  -- either 'admin' or 'retailer'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lab Results Table
CREATE TABLE lab_results (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    file_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',  -- e.g., pending, processing, completed
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    page_count INTEGER
);

-- Subscription Details
CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    tier VARCHAR(50) NOT NULL,  -- e.g., 'Basic', 'Enterprise'
    trial_start_date TIMESTAMP,
    trial_end_date TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active',  -- e.g., active, cancelled, expired
    payment_failure_attempts INTEGER DEFAULT 0
);

-- Activity Log Table
CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    activity VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
---------------------------------------------------------

## 4. API Design and Endpoints

The backend offers clear API endpoints for communication between the frontend and the backend services. The design is based on RESTful principles:

- **API Approach**: RESTful APIs are used for their simplicity, readability, and ease of integration across multiple platforms.

- **Key Endpoints Include**:
  - **User Authentication & Management**: Endpoints for user signup, login, password reset, and role management. These use integration with Clerk Auth or Supabase auth.
  - **PDF Upload**: An endpoint that accepts a single PDF file, validates file size and page count, and adds it to a processing queue.
  - **Lab Result Processing**: An endpoint to check the status of PDF processing and retrieve AI-generated product descriptions.
  - **Subscription Management**: Endpoints that manage subscription plans, trial periods, upgrades/downgrades, and integration with Stripe for payment processing.
  - **Reporting**: Endpoints for generating and downloading CSV reports of lab result processing, activity logs, and system analytics.

## 5. Hosting Solutions

The backend is hosted in a cloud environment for maximum reliability and flexibility. Here are the key details:

- **Cloud Providers**:
  - **Primary Hosting**: Supabase (for database, storage, and serverless functions).
  - **Payment & Additional APIs**: Stripe and external integrations are also hosted on reliable third-party platforms.

- **Benefits**:
  - **Reliability**: Cloud services offer high uptime guarantees and robust disaster recovery options.
  - **Scalability**: Auto-scaling features allow the system to handle increasing load easily.
  - **Cost-Effectiveness**: Pay-as-you-go pricing models help in managing expenses efficiently while growing.

## 6. Infrastructure Components

The following are the core pieces of infrastructure that work together to deliver a seamless user experience:

- **Load Balancers**: These distribute incoming requests evenly across servers to prevent overload and ensure smooth performance.
- **Caching Mechanisms**: Frequently accessed data, such as user session details and static resources, are cached to reduce processing time and improve load speeds.
- **Content Delivery Networks (CDNs)**: Used for serving static assets like images, JavaScript, and CSS promptly across various geographic areas.
- **Asynchronous Processing Queues**: Manage tasks such as PDF processing and AI analysis, ensuring that even if one request takes time, others aren't held up.

## 7. Security Measures

Security is a top priority, ensuring user data remains safe and compliant with relevant standards. Key measures include:

- **Authentication & Authorization**:
  - Uses secure authentication methods via Clerk and Supabase Auth to ensure only registered users access the system.
  - Role-based access control differentiates between administrators and retailers, ensuring users see only what is relevant to their role.

- **Data Encryption & Protection**:
  - All sensitive data is encrypted during transmission (using HTTPS) and at rest within the database.
  - Regular security reviews and adherence to industry best practices ensure vulnerabilities are addressed promptly.

- **Payment Security**:
  - Stripe integration handles all payment processing securely, including handling retries and notifying users about payment issues.

## 8. Monitoring and Maintenance

To keep the backend healthy and responsive, several tools and practices are in place for monitoring and maintenance:

- **Monitoring Tools**:
  - Cloud-based monitoring dashboards track server performance, API response times, and error logs.
  - Alerts and notifications are set up for any performance dips, failed processes, or security incidents.

- **Maintenance Strategies**:
  - Regular updates and patches are applied to keep software components up-to-date.
  - Continuous testing and deployment practices ensure that new additions or modifications do not disrupt current operations.
  - Scheduled database backups and failover strategies help in maintaining data integrity and quick recovery in case of unexpected issues.

## 9. Conclusion and Overall Backend Summary

In summary, the backend of Heady Lab Results is a carefully designed platform built with a modern, cloud-native approach. Key takeaways include:

- A modular backend architecture using Supabase for reliable data management and storage.
- Clean and structured database schema that supports various features such as user management, lab results processing, and subscription/payment tracking.
- RESTful API design connecting the frontend with clear endpoints for authentication, PDF uploads, lab processing, and reporting.
- Robust security measures that maintain user privacy and data integrity.
- A scalable and cost-effective hosting solution combined with a range of infrastructure components to ensure optimum performance and reliability.

This backend structure is aligned with the project’s goal of providing a fast, secure, and efficient solution for cannabis product retailers to generate product descriptions based on lab results. The design emphasizes performance, ease of maintenance, and a strong security posture, setting the foundation for future enhancements as the platform grows.