import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import axiosInstance from "./axiosinstance";
import { useNavigate } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import SPLoader from "./Loading/SpinnerLoader";
import "../assets/css/home.css";

import { Modal } from "bootstrap";
const Home = () => {
  const navigate = useNavigate();
  const [isuserlogged, setisuserlogged] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ ExcelFile: null });
  const fileInputRef = useRef(null); // Ref for the file input
  const [isLoading, setIsLoading] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [emailType, setEmailType] = useState("");
  const [showModel, setShowModel] = useState(false);

  const Logout = async () => {
    const refreshToken = Cookies.get("refresh_token");
    try {
      setIsLoading(true);
      await axiosInstance.post("auth/logout/", { refresh_token: refreshToken });
      setIsLoading(false);
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

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

  const handleFileChange = (e) => {
    const { files } = e.target;
    if (files && files[0]) {
      setFormData((prevData) => ({
        ...prevData,
        ExcelFile: files[0],
      }));
    }
  };

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

  const handlesendemail = async (mailid, type) => {
    console.log(mailid, type);
    setIsLoading(true);
    const resp = await axiosInstance.get(
      `Automail/sendmail/${mailid}/${type}/`
    );
    setIsLoading(false);
    fetchUsers();
    console.log(resp);
    if (resp.status === 200) {
      alert(resp.data.message);
    } else {
      alert("Failed to send email.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.ExcelFile) {
      alert("Please select an Excel file.");
      return;
    }

    const data = new FormData();
    data.append("file", formData.ExcelFile);

    try {
      setIsLoading(true);
      const resp = await axiosInstance.post("Automail/", data);
      setIsLoading(false);
      if (resp.status === 201) {
        alert("Excel file added successfully.");
      }
    } catch (error) {
      console.log(error);
      alert(error.response.data.message);
    }
    fetchUsers();
    setFormData({ ExcelFile: null });
    fileInputRef.current.value = "";
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

  const handleCloseModel = () => {
    setShowModel(false);
  };

  const handleAddEmailType = async (e) => {
    e.preventDefault();
    console.log(emailType);
    const resp = await axiosInstance.post("Automail/add-new-emailtype/", {
      EmailType: emailType,
    });
    if (resp.status === 200) {
      alert("Email Type added successfully.");
      fetchUsers();
      handleCloseModel();
      setEmailType("");
    } else {
      alert("Failed to add email type.");
    }
  };
  const sendtoall = async (type) => {
    setIsLoading(true);
    const resp = await axiosInstance.get(`Automail/sendmail/${type}/`);
    setIsLoading(false);
    if (resp.status === 200) {
      console.log(resp.data.message);
      alert(resp.data.message);
    }
    fetchUsers();
  };
  const sendmailtofaculty = async () => {
    setIsLoading(true);
    const resp = await axiosInstance.get("Automail/sendmailtofaculties/");
    setIsLoading(false);
    if (resp.status === 200) {
      console.log(resp.data.message);
      alert(resp.data.message);
    }
  };
  return (
    <div className="container">
      <SPLoader isLoading={isLoading} />
      <div className="mb-4">
        <div className="row d-flex align-items-stretch h-100">
          <header className="header text-center p-4 shadow-lg rounded">
            <h1 className="display-4 fw-bold">🚀 Innovo</h1>
            <p className="lead mb-3">Email Automation</p>
          </header>

          <div className="row d-flex align-items-stretch">
            <div className="col-md-4 d-flex h-100">
              <div className="card shadow-lg border-0 p-4 bg-light w-100 d-flex flex-column h-100">
                <h2 className="text-center mb-3">📊 Upload Excel</h2>
                <form
                  onSubmit={handleSubmit}
                  className="d-flex flex-column flex-grow-1"
                >
                  <div className="mb-3 flex-grow-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="form-control"
                      id="excelfile"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="d-flex gap-3">
                    <button type="submit" className="btn btn-success w-50">
                      📤 Submit
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger w-50"
                      onClick={Logout}
                    >
                      🔒 Logout
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {showModel && (
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add New Email Type</h5>
                  <button
                    type="button"
                    className="close"
                    onClick={handleCloseModel}
                  >
                    &times;
                  </button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleAddEmailType}>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Email Type"
                      value={emailType}
                      onChange={(e) => setEmailType(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary w-100">
                      Add
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="row">
        <div className="col-md-full">
          <div className="card shadow-lg border-0 bg-dark text-black p-4">
            <h2 className="text-center mb-3">📜 Registered Users</h2>
            <div className="d-flex gap-3">
              <label>Total Entries: {filteredUsers.length}</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search users..."
                value={searchQuery}
                onChange={handleSearch}
              />
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => setShowModel(true)}
              >
                Add new EmailType
              </button>
            </div>
            <div className="d-flex gap-3 mb-4 mt-2">
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={sendmailtofaculty}
              >
                Send Invitation Mail to Colleges
              </button>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => sendtoall("Confirmation")}
              >
                Send Confirmation Mail to all Pending Participants
              </button>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => sendtoall("RSVP form")}
              >
                Send RSVP Email
              </button>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => sendtoall("Join WhatsApp Community")}
              >
                Send Join WhatsApp Community Email
              </button>
              {/* <button className="btn btn-outline-primary btn-sm" onClick={() => sendtoall("INFOSET")}>
                Send Innofest Email
              </button> */}
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => sendtoall("ProblemStatement")}
              >
                Send Problem Statement Email
              </button>
              {/* <button className="btn btn-outline-primary btn-sm">
                Send Feedback Mail to all Pending Participants
              </button> */}
            </div>
            <div
              style={{ maxHeight: "400px", overflowY: "auto", width: "100%" }}
            >
              <table className="table table-dark table-hover table-bordered">
                <thead className="thead-light">
                  <tr>
                    <th>Sr. No</th>
                    <th>Event</th>
                    <th>Team Name</th>
                    <th>Member Name</th>
                    <th>Email</th>
                    <th>Email Type</th>
                    <th>Action</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => {
                    const emailTypes = user.EmailType
                      ? Object.entries(user.EmailType)
                      : {};
                    return (
                      <React.Fragment key={user.id}>
                        <tr>
                          <td rowSpan={emailTypes.length}>{index + 1}</td>
                          <td rowSpan={emailTypes.length}>{user.EventName}</td>
                          <td rowSpan={emailTypes.length}>{user.TeamName}</td>
                          <td rowSpan={emailTypes.length}>{user.MemberName}</td>
                          <td rowSpan={emailTypes.length}>{user.Email}</td>
                          <td>{emailTypes[0][0]} Email</td>
                          <td>
                            <button
                              className={`btn ${
                                emailTypes[0][1]
                                  ? "btn-success"
                                  : "btn-outline-primary"
                              } btn-sm`}
                              disabled={emailTypes[0][1]}
                              onClick={() =>
                                handlesendemail(user.Email, emailTypes[0][0])
                              }
                            >
                              Send
                            </button>
                          </td>
                          <td>{emailTypes[0][1] ? "Sent" : "Pending"}</td>
                        </tr>
                        {emailTypes.slice(1).map(([emailType, status]) => (
                          <tr key={`${user.id}-${emailType}`}>
                            <td>{emailType} Email</td>
                            <td>
                              <button
                                className={`btn ${
                                  status ? "btn-success" : "btn-outline-primary"
                                } btn-sm`}
                                disabled={status}
                                onClick={() =>
                                  handlesendemail(user.Email, emailType)
                                }
                              >
                                Send
                              </button>
                            </td>
                            <td>{status ? "Sent" : "Pending"}</td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
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
