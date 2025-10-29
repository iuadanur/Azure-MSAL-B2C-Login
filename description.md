Homework 2: Implementing Microsoft Entra ID Authentication
Son tarih: 16 Kasım 2025 23:59
•
Kapanış: 16 Kasım 2025 23:59
Yönergeler
Objective
Demonstrate your ability to secure and deploy a web application using Microsoft Entra External ID and Azure App Service. This assignment requires you to create an external tenant, register your application, implement user flows, and deploy your working application to a public-facing Azure Web App (PaaS).

Core Tasks
Resource Group:

Create a single new resource group to contain your App Service.

Name it YourName-HW-Entra-RG.

Tenant Creation:

Create a new Microsoft Entra External ID tenant.

Give it a unique "Domain name," such as YourName-HW-Customer-Tenant.onmicrosoft.com. (This is the new "External ID" workflow).

App Service Creation:

In your main Azure subscription (not the external tenant), create an Azure App Service (Web App) inside the resource group from Task 1.

Choose an appropriate runtime stack for the framework you plan to use (e.g., Node.js, Python, .NET).

Note your App Service's default URL (e.g., https://YourAppName.azurewebsites.net).

Application Registration:

Inside your new external  tenant (from Task 2) (You need to switch directory!), navigate to App registrations and register a new application.

Configure its platform as a Web application.

Set two Redirect URIs:

One for local development (e.g., http://localhost:3000/auth/redirect, http://localhost:5173/callback).

One for your deployed Azure App Service (e.g., https://YourAppName.azurewebsites.net/auth/redirect, https://YourAppName.azurewebsites.net/callback). Use the URL from Task 3.

User Flows:

In your external tenant, navigate to User flows (under the "External Identities" blade).

Create a "Sign-up and Sign-in" user flow.

Enable "Email with password" as the identity provider.

Collect at least "Email Address," "Given Name," and "Surname" as user attributes.

Web Application Integration & Deployment:

Choose any web application framework (e.g., React, Angular, ASP.NET, Node.js/Express, Python/Flask).

Local Integration: Integrate the Microsoft Authentication Library (MSAL) and configure it to work with your local development environment.

Configuration: Your app's MSAL config must use:

Your Application (client) ID.

Your customer tenant's domain name.

The name of your "Sign-up and Sign-in" user flow.

Features: Your application must implement:

A "Sign In" button.

A "Sign Out" button.

A protected component or page (e.g., a "Profile" page) only accessible after sign-in.

(Recommended) Display the logged-in user's "Given Name" or "Email".

Deployment: Once your application is working locally, deploy it to the Azure App Service you created in Task 3.

You will likely need to configure Environment Variables in your App Service to hold your Client ID, tenant info, etc., so you are not hard-coding secrets.

Testing & Verification:

First, test your application locally to ensure the sign-up and sign-in logic works.

Then, navigate to your public Azure App Service URL (e.g., https://YourAppName.azurewebsites.net).

Click the "Sign In" button.

Use the "Sign up now" link to create a new local test account.

After sign-up, you should be redirected back to your live web app as an authenticated user.

Verify that you can now access your protected page on the public App Service URL.

Verify that the "Sign Out" button successfully logs you out.

Deliverable & Submission
Your submission will be a single, unedited screen recording video (max 10 minutes) demonstrating the successful completion of all tasks. Do not record your entire setup process; show the final, working result.

Your video must clearly show the following:

The Azure Portal (Main Subscription): (20pts)

Your Resource Group (YourName-HW-Entra-RG).

Your Azure App Service resource inside this group. Click on it to show its URL.

The Azure Portal (External Tenant): (40pts)

Your Microsoft Entra ID for customers tenant.

The App Registration for your web app, clearly showing both the localhost and the azurewebsites.net Redirect URIs.

The list of your User Flows.

The Users blade, showing the new test user you created during verification.

Your Deployed Web Application: (40pts)

Show the application running on its public .azurewebsites.net URL in its "signed-out" state.

Click the "Sign In" button, showing the redirect to the Microsoft-hosted UI.

Successfully sign in with your test user account.

Show the application in its "signed-in" state, proving you can now access the protected page.

Click the "Sign Out" button and show that you are successfully logged out.

In this step open your browser's DevTools-application tab. 

⚠️ You must delete your Resource Group (YourName-HW-Entra-RG) after you have recorded your video and received your grade to prevent ongoing charges.

