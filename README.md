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
│   └── ...            # Other components
├── hooks/             # Custom hooks
├── lib/               # Utility functions and API client
├── services/          # API services
├── App.tsx            # Main application component
└── main.tsx           # Application entry point
```

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

## Common Components

The project includes several reusable UI components:

- **Button** - Styled button with variants
- **Card** - Container component with header, content, and footer
- **Input** - Styled input field
- **Alert** - Notification component with variants
- **Spinner** - Loading indicator with size and color options
- **Modal** - Accessible modal dialog component

All components follow the Shadcn UI design pattern and are fully typed.

## Custom Hooks

The project includes several useful custom hooks:

- **useDebounce** - Debounces a value for performance optimization
- **useLocalStorage** - Manages state in localStorage
- **useModal** - Manages modal open/close state
- **useOnClickOutside** - Detects clicks outside of an element
- **useMediaQuery** - Matches CSS media queries
- **useToggle** - Manages boolean toggle state
- **useAsync** - Handles asynchronous operations
- **useHover** - Detects hover state on elements
- **useCopyToClipboard** - Copies text to clipboard

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

## Axios Configuration
