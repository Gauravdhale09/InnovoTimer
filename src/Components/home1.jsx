import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import axiosInstance from "./axiosinstance";
import { useNavigate } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import SPLoader from "./Loading/SpinnerLoader";

const Home = () => {
  const navigate = useNavigate();
  const [isuserlogged, setisuserlogged] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({ ExcelFile: null });
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("Automail/");
      setIsLoading(false);
      setUsers(response.data.data);
      setFilteredUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    const accessToken = Cookies.get("access_token");
    if (accessToken) {
      fetchUsers();
      setisuserlogged(true);
    } else {
      setisuserlogged(false);
    }
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = users.filter((user) =>
      [user.EventName, user.TeamName, user.MemberName, user.Email]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
    setFilteredUsers(filtered);
  };

  return (
    <div className="container">
      <SPLoader isLoading={isLoading} />
      <div className="row mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="card shadow-lg border-0 bg-dark text-white p-4">
            <h2 className="text-center mb-3">📜 Registered Users</h2>
            <label>Total Entries: {filteredUsers.length}</label>
            <div className="table-responsive">
              <table className="table table-dark table-hover table-bordered">
                <thead>
                  <tr>
                    <th>Sr. No</th>
                    <th>Event</th>
                    <th>Team Name</th>
                    <th>Member Name</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>{user.EventName}</td>
                      <td>{user.TeamName}</td>
                      <td>{user.MemberName}</td>
                      <td>{user.Email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
