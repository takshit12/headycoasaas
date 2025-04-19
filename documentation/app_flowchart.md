flowchart TD
    A[Heady Lab Results App Start] --> B[User Authentication]
    B --> C1[Retailer Flow]
    B --> C2[Admin Flow]

    C1 --> D[Upload PDF]
    D --> E[Validate PDF: PDF only, <1MB, <=5 pages]
    E --> F[Submit to Asynchronous Queue]
    F --> G[Process with GPT-4o]
    G --> H[Store Result in Supabase]
    G --> I[Display AI Generated Results]
    I --> J[Export CSV Report]

    C1 --> K[Subscription Management]
    K --> L[Stripe Payment Integration]
    K --> M[7-Day Free Trial and Plan Management]
    L --> N[Email Notifications for Low Credit and Trial Expiration]

    C2 --> O[Manage User Accounts]
    C2 --> P[View Analytics]
    C2 --> Q[Configure System Settings]
    C2 --> R[Subscription Management]
    R --> L
    R --> M

    I --> S[Modern Minimalistic UI]
    D --> H
    