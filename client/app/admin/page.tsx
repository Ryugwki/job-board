"use client";

import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/context/globalContext";
import { useRouter } from "next/navigation";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Checkbox } from "@/Components/ui/checkbox";
import { toast } from "react-hot-toast";
import {
  RefreshCw,
  Search,
  Plus,
  Edit,
  Trash2,
  ArrowUpDown,
  Shield,
  UserX,
} from "lucide-react";

// Define user interface
interface User {
  _id: string;
  name: string;
  email: string;
  auth0Id: string;
  isAdmin: boolean;
  createdAt: string;
}

function AdminDashboard() {
  const { userProfile, isAuthenticated } = useGlobalContext();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [editUser, setEditUser] = useState<User | null>(null);
  const [refresh, setRefresh] = useState(0); // Used to trigger refreshes

  // Fetch users
  useEffect(() => {
    // Check if user is admin, if not redirect
    if (!userProfile?.isAdmin) {
      router.push("/");
      return;
    }

    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Use the correct endpoint
        const response = await axios.get("/api/v1/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userProfile, router, refresh]);

  // Handle adding a new admin
  const handleAddAdmin = async () => {
    if (!newAdminEmail) {
      toast.error("Please enter an email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newAdminEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const response = await axios.post("/api/v1/user/admin", {
        email: newAdminEmail, // Changed from auth0Id to email
        isAdmin: true,
      });

      toast.success("Admin added successfully");
      setNewAdminEmail("");
      // Refresh the list
      setRefresh((prev) => prev + 1);
    } catch (error) {
      console.error("Error adding admin:", error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        toast.error("User with this email not found");
      } else {
        toast.error("Failed to add admin");
      }
    }
  };

  // Handle updating admin status
  const handleUpdateAdmin = async (userId: string, isAdmin: boolean) => {
    try {
      await axios.put(`/api/v1/user/${userId}`, { isAdmin });
      toast.success(`User ${isAdmin ? "promoted to" : "removed from"} admin`);
      // Refresh the list
      setRefresh((prev) => prev + 1);
    } catch (error) {
      console.error("Error updating admin status:", error);
      toast.error("Failed to update admin status");
    }
  };

  // Handle updating a user
  const handleUpdateUser = async () => {
    if (!editUser) return;

    try {
      await axios.put(`/api/v1/user/${editUser._id}`, {
        isAdmin: editUser.isAdmin,
      });

      toast.success("User updated successfully");
      setEditUser(null);
      // Refresh the list
      setRefresh((prev) => prev + 1);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
  };

  // Handle deleting a user's admin status
  const handleRemoveAdmin = async (userId: string) => {
    try {
      await axios.put(`/api/v1/user/${userId}`, { isAdmin: false });
      toast.success("Admin privileges removed");
      // Refresh the list
      setRefresh((prev) => prev + 1);
    } catch (error) {
      console.error("Error removing admin status:", error);
      toast.error("Failed to remove admin status");
    }
  };

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Function to manually refresh data
  const refreshData = () => {
    setRefresh((prev) => prev + 1);
  };

  // Filter and sort users
  const filteredAndSortedUsers = users
    .filter((user) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        user.name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.auth0Id?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      if (!a[sortField] || !b[sortField]) return 0;

      const aValue = a[sortField].toString().toLowerCase();
      const bValue = b[sortField].toString().toLowerCase();

      if (sortDirection === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

  // Get admin users only
  const adminUsers = filteredAndSortedUsers.filter((user) => user.isAdmin);

  if (!userProfile?.isAdmin) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <Button
              variant="outline"
              size="icon"
              onClick={refreshData}
              className="ml-2"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          {/* Admin functionality */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Admin Users</h2>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-[#2f42c2] hover:bg-[#2f42c2]/90">
                    <Plus className="mr-2 h-4 w-4" /> Add Admin
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Admin</DialogTitle>
                    <DialogDescription>
                      Enter the email of the user you want to promote to admin.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="col-span-4">
                        Email address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        className="col-span-4"
                        placeholder="user@example.com"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleAddAdmin}
                      className="bg-[#2f42c2] hover:bg-[#2f42c2]/90"
                    >
                      Add Admin
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="mb-4 flex items-center">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead
                      onClick={() => handleSort("name")}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center">
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort("email")}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center">
                        Email
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Auth0 ID</TableHead>
                    <TableHead
                      onClick={() => handleSort("createdAt")}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center">
                        Date Added
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        <div className="flex justify-center">
                          <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : adminUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        No admin users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    adminUsers.map((user, index) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {user.auth0Id}
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="mr-1"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit User</DialogTitle>
                                <DialogDescription>
                                  Update user information
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="flex items-center gap-4">
                                  <Label htmlFor="isAdmin">Admin Status</Label>
                                  <Checkbox
                                    id="isAdmin"
                                    checked={user.isAdmin}
                                    onCheckedChange={(checked) => {
                                      handleUpdateAdmin(user._id, !!checked);
                                    }}
                                  />
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveAdmin(user._id)}
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Other Users */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">All Users</h2>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead
                      onClick={() => handleSort("name")}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center">
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort("email")}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center">
                        Email
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Admin Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10">
                        <div className="flex justify-center">
                          <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredAndSortedUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAndSortedUsers.map((user, index) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {user.isAdmin ? (
                            <div className="flex items-center">
                              <Shield className="h-4 w-4 text-green-500 mr-2" />
                              Admin
                            </div>
                          ) : (
                            <div className="text-gray-500">User</div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {!user.isAdmin ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-500 hover:text-blue-700"
                              onClick={() => handleUpdateAdmin(user._id, true)}
                            >
                              Make Admin
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleUpdateAdmin(user._id, false)}
                            >
                              Remove Admin
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AdminDashboard;
