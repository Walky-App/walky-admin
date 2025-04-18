# Walky Admin Panel

This admin panel is built with [CoreUI](https://coreui.io/) - a popular UI component library for building modern, responsive admin dashboards.

## 🚀 Getting Started for Junior Developers

This guide will walk you through setting up and working with this project step by step.

### What is CoreUI?

CoreUI is a UI component library that provides pre-built components like dashboards, charts, tables, and forms to help you build admin interfaces faster without designing everything from scratch.

### What is an API?

API stands for Application Programming Interface. Think of it as a messenger that takes your request to a system, then returns the response back to you. In this project, we'll use APIs to:
- Get data from our database to display in the admin panel
- Send updates when you make changes in the admin panel

## 💻 Prerequisites

Before you start, make sure you have:

1. [Node.js](https://nodejs.org/) installed (version 16 or higher)
2. npm (comes with Node.js) or [Yarn](https://yarnpkg.com/) package manager
3. A code editor (we recommend [Visual Studio Code](https://code.visualstudio.com/))

## 📋 Step-by-Step Setup Guide

### 1. Clone this repository

```bash
git clone <repository-url>
cd walky-admin
```

### 2. Install dependencies

```bash
npm install
# or if you use yarn
yarn
```

### 3. Start the development server

```bash
npm run dev
# or with yarn
yarn dev
```

This will start the development server at http://localhost:5173 (or another port if 5173 is in use).

## 🔧 Setting Up CoreUI in a New Project

If you're starting a new project from scratch, follow these steps to set up CoreUI:

### 1. Install CoreUI packages

```bash
npm install @coreui/react @coreui/coreui @coreui/icons @coreui/icons-react
```

### 2. Import CoreUI CSS in your main file (src/main.tsx)

```jsx
// Import CoreUI CSS
import '@coreui/coreui/dist/css/coreui.min.css';
// Import icons
import '@coreui/icons/css/all.min.css';

// Rest of your imports...
```

### 3. Setup basic layout

Create a basic layout with CoreUI components in your App.tsx:

```jsx
import { CContainer } from '@coreui/react';

function App() {
  return (
    <CContainer fluid>
      {/* Your app content here */}
    </CContainer>
  );
}

export default App;
```

## 📚 Key Concepts for Beginners

### Project Structure

- `src/` - Contains all our application code
  - `components/` - Reusable UI components
  - `views/` - Full page layouts
  - `assets/` - Images, icons, and other static files
  - `App.tsx` - Main application component

### CoreUI Components

CoreUI provides many ready-to-use components. Here are some you'll use frequently:

1. **Layout Components**
   - `CContainer`, `CRow`, `CCol` - For creating responsive layouts
   - `CCard`, `CCardBody` - For creating card-based UI elements
   - `CSidebar`, `CHeader` - For page structure

2. **Form Components**
   - `CForm`, `CFormInput`, `CFormSelect` - For user input
   - `CButton` - For actions

3. **Data Display Components**
   - `CTable` - For displaying data in tables
   - `CChart` - For visualizing data

### Working with Components

Here's a simple example of using CoreUI components:

```jsx
import { CCard, CCardBody, CCardTitle, CCardText, CButton } from '@coreui/react';

function MyComponent() {
  return (
    <CCard>
      <CCardBody>
        <CCardTitle>Special Title Treatment</CCardTitle>
        <CCardText>
          With supporting text below as a natural lead-in to additional content.
        </CCardText>
        <CButton color="primary">Go somewhere</CButton>
      </CCardBody>
    </CCard>
  );
}
```

## 📝 Common Tasks

### Adding a New Page

1. Create a new file in the `src/views` folder
2. Import required CoreUI components
3. Create and export your component
4. Add the route in the appropriate router file

### Making API Calls

We use [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to make API calls. Here's a simple example:

```jsx
// Function to get data from an API
async function fetchData() {
  try {
    // Make the API request
    const response = await fetch('https://api.example.com/data');
    
    // Check if the request was successful
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    // Convert the response to JSON
    const data = await response.json();
    
    // Use the data
    console.log(data);
    return data;
  } catch (error) {
    // Handle any errors
    console.error('There was a problem with the fetch operation:', error);
  }
}
```

## 🏗️ Creating a Basic Admin Layout

Here's a simple example to create a basic admin layout with CoreUI:

```jsx
import { CSidebar, CSidebarNav, CSidebarBrand, CNavItem, CNavTitle, 
         CContainer, CHeader, CHeaderBrand, CHeaderNav } from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilSpeedometer, cilPuzzle } from '@coreui/icons';

function AdminLayout() {
  return (
    <div className="wrapper d-flex flex-column min-vh-100 bg-light">
      {/* Header */}
      <CHeader position="sticky" className="mb-4">
        <CContainer fluid>
          <CHeaderBrand href="#">Walky Admin</CHeaderBrand>
          <CHeaderNav className="ms-auto">
            {/* Add header nav items here */}
          </CHeaderNav>
        </CContainer>
      </CHeader>
      
      <div className="body flex-grow-1 px-3">
        <CContainer fluid>
          <div className="row">
            {/* Sidebar */}
            <div className="col-md-3">
              <CSidebar>
                <CSidebarBrand>Walky Admin</CSidebarBrand>
                <CSidebarNav>
                  <CNavTitle>Navigation</CNavTitle>
                  <CNavItem href="/dashboard">
                    <CIcon icon={cilSpeedometer} customClassName="nav-icon" />
                    Dashboard
                  </CNavItem>
                  <CNavItem href="/users">
                    <CIcon icon={cilPuzzle} customClassName="nav-icon" />
                    Users
                  </CNavItem>
                </CSidebarNav>
              </CSidebar>
            </div>
            
            {/* Main Content */}
            <div className="col-md-9">
              {/* This is where your page content will go */}
            </div>
          </div>
        </CContainer>
      </div>
    </div>
  );
}
```

## 🔍 Getting Help

If you're stuck, here are some resources:

1. [CoreUI Documentation](https://coreui.io/docs/) - Official documentation
2. [CoreUI Components](https://coreui.io/react/docs/components/accordion) - Reference for all available components
3. Ask your team lead or senior developer for help

## 🛠️ Troubleshooting

### Common Issues

1. **"Module not found" error**
   - Make sure you've installed all dependencies with `npm install`
   - Check your import statement for typos

2. **Components not rendering correctly**
   - Check the CoreUI documentation for proper usage
   - Make sure you've imported all necessary components

3. **API calls not working**
   - Check your API endpoint URL
   - Check your internet connection
   - Use the browser's developer tools to debug network requests

## 👩‍💻 Development Tips

1. **Use the CoreUI components whenever possible** instead of building your own. They're tested, responsive, and follow best practices.

2. **Take small steps and test often**. Make one change, test it, then move on to the next change.

3. **Ask for help early** if you're stuck. Don't spend hours trying to solve a problem alone.

4. **Use browser development tools** (F12 or right-click → Inspect) to debug issues.

5. **Learn from examples** in the CoreUI documentation.

## 🌐 Deploying to Vercel

This admin panel is set up to deploy via Vercel. Here's how to deploy it:

### Setting Up Vercel Deployment

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Sign up for a [Vercel account](https://vercel.com/signup) if you don't have one

3. Import your repository on Vercel:
   - Go to the [Vercel dashboard](https://vercel.com/dashboard)
   - Click "Add New" > "Project"
   - Select your repository
   - Vercel will automatically detect that this is a Vite.js project
   - Click "Deploy"

4. Your site will be deployed to a URL like `project-name.vercel.app`

### Setting Up a Custom Domain

1. Purchase a domain from a domain registrar (like Namecheap, GoDaddy, etc.)

2. In your Vercel project dashboard:
   - Go to "Settings" > "Domains"
   - Add your domain name
   - Follow Vercel's instructions for configuring your DNS settings

3. Vercel will automatically issue and renew SSL certificates for your domain

### Configuration Details

This project includes a `vercel.json` file that configures proper routing for a single-page application. This ensures that all routes are correctly handled by the app's router.

### Troubleshooting Deployment

- If your build fails, check the Vercel logs for specific error messages
- Ensure any environment variables needed by your app are configured in Vercel's project settings
- For routing issues, verify that the `vercel.json` file is properly set up
