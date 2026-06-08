import { useEffect, useState } from "react";
import {
  getAllUsers,
  updateUserStatus,
} from "../../api/userApi";
import AdminFilters from "../../components/admin/AdminFilters";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state management
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const filteredUsers = users.filter((user) => {
  const matchesSearch =
    user.name
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    user.email
      .toLowerCase()
      .includes(search.toLowerCase());

  const matchesStatus =
    statusFilter === "ALL" ||
    (statusFilter === "ACTIVE" &&
      user.status) ||
    (statusFilter === "INACTIVE" &&
      !user.status);

    const matchesRole = 
    roleFilter === "ALL" ||
    user.role === roleFilter;

  return matchesSearch && matchesStatus && matchesRole;
});
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await getAllUsers();

      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusChange = async (
    userId,
    currentStatus
  ) => {
    const newStatus = !currentStatus;

    const confirmed = window.confirm(
      `Are you sure you want to ${
        newStatus ? "activate" : "deactivate"
      } this user?`
    );

    if (!confirmed) return;

    try {

      const payload = {
        status: newStatus,
      }
      await updateUserStatus(userId, payload);

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, status: newStatus }
            : user
        )
      );
    } catch (error) {
      console.error(
        "Failed to update user status:",
        error
      );

      alert("Failed to update user status");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Manage Users</h2>
      </div>

      <AdminFilters
        search={search}
        setSearch={setSearch}
        searchPlaceholder="Search users..."
        filters={[
            {
            name: "status",
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
                { value: "ALL", label: "All Users" },
                { value: "ACTIVE", label: "Active" },
                { value: "INACTIVE", label: "Inactive" },
            ],
            },
            {
        name: "role",
        value: roleFilter,
        onChange: setRoleFilter,
        options: [
            { value: "ALL", label: "All Roles" },
            { value: "ADMIN", label: "Admin" },
            { value: "GUEST", label: "Guest" },
      ],
    },
        ]}
        />

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.thId}>ID</th>
              <th style={styles.thImage}>Image</th>
              <th style={styles.thName}>Name</th>
              <th style={styles.thEmail}>Email</th>
              <th style={styles.thPhone}>Phone</th>
              <th style={styles.thRole}>Role</th>
              <th style={styles.thStatus}>Status</th>
              <th style={styles.thActions}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td style={styles.td}>
                  {user.id}
                </td>

                <td style={styles.td}>
                  {user.imageURL ? (
                    <img
                      src={user.imageURL}
                      alt={user.name}
                      style={styles.image}
                    />
                  ) : (
                    <div style={styles.avatarPlaceholder}>
                      {user.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                </td>

                <td style={styles.td}>
                  {user.name}
                </td>

                <td style={styles.tdEmail}>
                  {user.email}
                </td>

                <td style={styles.td}>
                  {user.phoneNumber || "-"}
                </td>

                <td style={styles.td}>
                  {user.role}
                </td>

                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      ...(user.status
                        ? styles.active
                        : styles.inactive),
                    }}
                  >
                    {user.status
                      ? "ACTIVE"
                      : "INACTIVE"}
                  </span>
                </td>

                <td style={styles.actions}>
                  <button
                    style={
                      user.status
                        ? styles.deactivateBtn
                        : styles.activateBtn
                    }
                    onClick={() =>
                      handleStatusChange(
                        user.id,
                        user.status
                      )
                    }
                  >
                    {user.status
                      ? "Deactivate"
                      : "Activate"}
                  </button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan="8" style={styles.empty}>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "white",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    tableLayout: "fixed",
  },

  thId: {
    width: "60px",
    textAlign: "center",
  },

  thImage: {
    width: "90px",
    textAlign: "center",
  },

  thName: {
    width: "150px",
    textAlign: "center",
  },

  thEmail: {
    width: "250px",
    textAlign: "center",
  },

  thPhone: {
    width: "150px",
    textAlign: "center",
  },

  thRole: {
    width: "120px",
    textAlign: "center",
  },

  thStatus: {
    width: "120px",
    textAlign: "center",
  },

  thActions: {
    width: "140px",
    textAlign: "center",
  },

  td: {
    textAlign: "center",
    padding: "10px",
    verticalAlign: "middle",
  },

  tdEmail: {
    textAlign: "center",
    padding: "10px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  image: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    objectFit: "cover",
  },

  avatarPlaceholder: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    backgroundColor: "#1e3a8a",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    margin: "0 auto",
  },

  statusBadge: {
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
  },

  active: {
    backgroundColor: "#dcfce7",
    color: "#15803d",
  },

  inactive: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
  },

  actions: {
    display: "flex",
    justifyContent: "center",
    padding: "10px",
  },

  activateBtn: {
    backgroundColor: "#22c55e",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },

  deactivateBtn: {
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },

  empty: {
    textAlign: "center",
    padding: "20px",
  },
};

export default ManageUsers;