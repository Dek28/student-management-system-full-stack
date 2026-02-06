import { useEffect, useState } from "react";
import client from "../../api/client"; 
import LoadingSpinner from "../../components/LoadingSpinner"; 

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await client.get("/users/me");
        setUser(res.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!user) return <div className="p-6">No profile data</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">My Profile</h2>

      <div className="bg-white rounded-lg shadow p-5 space-y-2">
        <p><span className="font-semibold">Username:</span> {user.username}</p>
        <p><span className="font-semibold">Role:</span> {user.role?.name || user.role}</p>
        <p><span className="font-semibold">User ID:</span> {user._id}</p>
      </div>
    </div>
  );
}
