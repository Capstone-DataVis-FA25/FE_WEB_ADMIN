import { useParams } from "react-router-dom";
import { useUser } from "../hooks/useUsers";

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading, error } = useUser(Number(id));

  if (isLoading) return <div className="p-4">Loading user...</div>;

  if (error) return <div className="p-4 text-red-500">Error loading user</div>;

  if (!user) return <div className="p-4">User not found</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User Details</h2>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
            Name:
          </label>
          <div className="text-lg">{user.name}</div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
            Email:
          </label>
          <div className="text-lg">{user.email}</div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
            ID:
          </label>
          <div className="text-lg">{user.id}</div>
        </div>
      </div>
    </div>
  );
}
