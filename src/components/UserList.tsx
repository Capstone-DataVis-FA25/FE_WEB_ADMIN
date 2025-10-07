import { Link } from "react-router-dom";
import { useUsers } from "../hooks/useUsers";

export default function UserList() {
  const { data, isLoading, error } = useUsers();

  if (isLoading) return <div className="p-4">Loading users...</div>;

  if (error) return <div className="p-4 text-red-500">Error loading users</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Users</h2>
      <ul className="space-y-2">
        {data?.map((user) => (
          <li
            key={user.id}
            className="bg-white dark:bg-gray-800 p-3 rounded shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Link to={`/user/${user.id}`} className="block">
              <div className="font-medium">{user.name}</div>
              <div className="text-gray-600 dark:text-gray-400">
                {user.email}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
