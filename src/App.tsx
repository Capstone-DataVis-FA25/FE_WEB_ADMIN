import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import UserList from "./components/UserList";
import UserDetail from "./components/UserDetail";
import UserManagement from "./components/UserManagement";
import HookDemo from "./components/HookDemo";
import { Button } from "./components/ui/button";
import "./App.css";

function Home() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Vite + React + Tailwind CSS + Shadcn UI + TanStack Query
      </h1>
      <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4">
        <Button
          onClick={() => setCount((count) => count + 1)}
          variant="default"
        >
          count is {count}
        </Button>
        <p className="mt-4">
          Edit{" "}
          <code className="bg-gray-100 dark:bg-gray-700 p-1 rounded">
            src/App.tsx
          </code>{" "}
          and save to test HMR
        </p>
      </div>
      <div className="mb-4">
        <Link to="/about" className="text-blue-500 hover:text-blue-700 mr-4">
          Go to About
        </Link>
      </div>
      <UserList />
      <p className="text-gray-600 dark:text-gray-400 mt-4">
        Click on the links to navigate between pages
      </p>
    </div>
  );
}

function About() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">About Page</h1>
      <p className="mb-4">
        This is a sample about page to demonstrate routing.
      </p>
      <Link to="/" className="text-blue-500 hover:text-blue-700">
        Go back home
      </Link>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <nav className="bg-white dark:bg-gray-800 shadow p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">My App</h1>
          <div>
            <Link to="/" className="mr-4 text-blue-500 hover:text-blue-700">
              Home
            </Link>
            <Link
              to="/users"
              className="mr-4 text-blue-500 hover:text-blue-700"
            >
              Users
            </Link>
            <Link
              to="/hooks"
              className="mr-4 text-blue-500 hover:text-blue-700"
            >
              Hooks Demo
            </Link>
            <Link to="/about" className="text-blue-500 hover:text-blue-700">
              About
            </Link>
          </div>
        </div>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/hooks" element={<HookDemo />} />
          <Route path="/user/:id" element={<UserDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
