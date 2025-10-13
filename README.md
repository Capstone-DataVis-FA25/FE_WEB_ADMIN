# React Admin Dashboard

A modern React admin dashboard built with:

- **React 19** - Latest version of the popular UI library
- **TypeScript** - Type safety for better code quality
- **Vite** - Fast build tool and development server
- **Tailwind CSS v4** - Utility-first CSS framework
- **Shadcn UI** - Re-usable components built with Radix UI and Tailwind CSS
- **TanStack Query** - Powerful asynchronous state management
- **Axios** - Promise based HTTP client for the browser
- **React Router** - Declarative routing for React

## Features

- ✅ TypeScript support
- ✅ Tailwind CSS v4 with dark mode support
- ✅ Responsive design
- ✅ Reusable UI components (Shadcn UI)
- ✅ Data fetching with TanStack Query
- ✅ HTTP client with Axios interceptors
- ✅ Routing with React Router
- ✅ API service pattern
- ✅ Custom hooks for data fetching
- ✅ Common UI components (Card, Button, Input, Alert, Spinner)
- ✅ ESLint and Prettier configuration
- ✅ User management (Admin panel with CRUD operations)
- ✅ Profile management (View and update profile)
- ✅ Password management (Change password functionality)
- ✅ Modern dashboard layout with collapsible sidebar
- ✅ Authentication system with login/logout
- ✅ Protected routes that require authentication
- ✅ User context for managing authentication state
- ✅ Seed data for development and testing

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd FE_WEB_ADMIN
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Build

Create a production build:

```bash
npm run build
```

### Preview

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/        # Reusable components
│   ├── ui/            # Shadcn UI components
│   └── admin/         # Admin-specific components
├── pages/             # Page components
├── layouts/           # Layout components
├── hooks/             # Custom hooks
├── lib/               # Utility functions and API client
├── services/          # API services
├── contexts/          # React context providers
├── App.tsx            # Main application component
└── main.tsx           # Application entry point
```

For detailed directory structure documentation, see [Directory Structure](docs/directory-structure.md).

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies

- [React](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Shadcn UI](https://ui.shadcn.com/) - Component library
- [TanStack Query](https://tanstack.com/query) - Data fetching and state management
- [Axios](https://axios-http.com/) - HTTP client
- [React Router](https://reactrouter.com/) - Routing library

## Authentication System

The application now includes a complete authentication system with the following features:

1. **Login Page**

   - Email and password authentication
   - Form validation
   - Error handling
   - Loading states

2. **Authentication Context**

   - Global state management for authentication
   - User session persistence
   - Login and logout functions

3. **Protected Routes**

   - Automatic redirect to login for unauthenticated users
   - Route protection for admin pages

4. **Automatic Token Management**

   - Automatic injection of authentication tokens in API requests
   - Automatic logout on 401 responses

5. **User Profile Integration**
   - Display current user information in the header
   - Profile section uses real user data instead of mock data

## Layout System

The application features a modern dashboard layout with:

1. **Collapsible Sidebar**: Navigation menu that can be toggled open/closed
2. **Responsive Header**: Displays current page title and user controls
3. **Main Content Area**: Dedicated space for page content

For detailed layout documentation, see [Layout System](docs/layout-system.md).

## Axios Configuration

The project includes a pre-configured Axios client with:

- Base URL configuration via environment variables
- Request and response interceptors
- Automatic authorization header injection
- Error handling for common HTTP status codes
- Timeout configuration

To use the Axios client, simply import it from `src/lib/apiClient.ts`:

```typescript
import apiClient from "@/lib/apiClient";

// GET request
const users = await apiClient.get("/users");

// POST request
const newUser = await apiClient.post("/users", {
  name: "John",
  email: "john@example.com",
});
```

## Admin User Management

The application includes a comprehensive admin user management system with the following features:

1. **User Profile Management**

   - View current user profile
   - Edit profile information (name, email)

2. **Password Management**

   - Change password with current password validation
   - Password confirmation validation

3. **User Administration**
   - Create new users with name, email, and password
   - View list of all users
   - Edit existing user information
   - Delete users with confirmation

The admin panel is accessible at `/admin/users` route.

For detailed documentation, see [Admin User Management Documentation](docs/admin-user-management.md).

## Custom Hooks

The project includes several custom hooks for common functionality:

- `useDebounce` - Debounce value changes
- `useModal` - Modal state management
- `useLocalStorage` - Local storage management
- `useToggle` - Boolean toggle state
- `useMediaQuery` - Media query matching

Example usage:

```typescript
import { useDebounce } from "@/hooks/useDebounce";
import { useModal } from "@/hooks/useModal";

// Debounce a search term
const [searchTerm, setSearchTerm] = useState("");
const debouncedSearchTerm = useDebounce(searchTerm, 500);

// Modal state management
const modal = useModal();
```

## Seed Data

The application includes seed data for development and testing purposes:

- 1 Admin user (admin@example.com)
- 2 Regular users (user1@example.com, user2@example.com)

Seed data is located in `src/seed.ts` and can be used to populate the database during development.

## Axios Configuration
