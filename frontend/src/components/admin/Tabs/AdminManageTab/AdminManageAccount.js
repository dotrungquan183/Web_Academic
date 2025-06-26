import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, X, UserCheck, UserX } from 'lucide-react';
import './AdminManageAccount.css';
import CalendarHeatmap from 'react-calendar-heatmap';
import { addDays, subDays } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock } from 'lucide-react'; // icon đồng hồ (nếu dùng shadcn/ui hoặc lucide)
const cardStyle = {
  flex: "1 1 200px",
  background: "#f0f4ff",
  borderRadius: "1rem",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  padding: "1rem",
  minWidth: "200px",
};

const h4Style = (color) => ({
  fontSize: "0.875rem",
  color,
  marginBottom: "0.25rem",
});

const pStyle = (color) => ({
  fontSize: "1.5rem",
  fontWeight: "bold",
  color,
});

const UserLoginChart = () => {
  const [showChart, setShowChart] = useState(false);

  const endDate = new Date();
  const startDate = subDays(endDate, 364);

  const fakeLoginData = Array.from({ length: 365 }, (_, i) => {
    const date = addDays(startDate, i).toISOString().slice(0, 10);
    return {
      date,
      count: Math.floor(Math.random() * 4), // 0–3 logins
    };
  });

  return (
    <div>
      <button onClick={() => setShowChart(!showChart)}>
        {showChart ? 'Ẩn biểu đồ' : 'Hiện biểu đồ đăng nhập'}
      </button>

      {showChart && (
        <div style={{ marginTop: '1rem' }}>
          <CalendarHeatmap
            startDate={startDate}
            endDate={endDate}
            values={fakeLoginData}
            classForValue={(value) => {
              if (!value || value.count === 0) {
                return 'color-empty';
              }
              return `color-github-${value.count}`;
            }}
            showWeekdayLabels
          />
        </div>
      )}
    </div>
  );
};
const AdminManageAccount = () => {
  const [hourlyLoginData, setHourlyLoginData] = useState([]); // lưu mảng {hour, logins}

  useEffect(() => {
    fetch('http://localhost:8000/api/admin/admin_user/')
      .then(res => res.json())
      .then(data => {
        console.log('=== Raw user data:', data);
        setUsers(data);

        // Lấy ngày hôm nay (local)
        const now = new Date();
        const todayYear = now.getFullYear();
        const todayMonth = now.getMonth(); // 0-11
        const todayDate = now.getDate();

        const countsByHour = Array(24).fill(0);

        data.forEach((user) => {
          user.login_histories?.forEach((ts) => {
            const dateObj = new Date(ts.replace(' ', 'T'));
            console.log(
              'checking login:',
              ts,
              '| local:',
              dateObj.getFullYear(),
              dateObj.getMonth() + 1,
              dateObj.getDate(),
              '| today:',
              todayYear,
              todayMonth + 1,
              todayDate
            );

            if (
              dateObj.getFullYear() === todayYear &&
              dateObj.getMonth() === todayMonth &&
              dateObj.getDate() === todayDate
            ) {
              countsByHour[dateObj.getHours()] += 1;
            }
          });
        });

        const hourlyData = countsByHour.map((count, i) => ({
          hour: `${i.toString().padStart(2, '0')}h`,
          logins: count,
        }));
        setHourlyLoginData(hourlyData);
        console.log('=== hourlyLoginData:', hourlyData); // log check
      })
      .catch(err => console.error('Error fetching users:', err));
  }, []);


  // Sample data combining User_info and auth_user tables
  const [users, setUsers] = useState([]); // Khởi tạo rỗng

  useEffect(() => {
    fetch('http://localhost:8000/api/admin/admin_user/')
      .then((res) => res.json())
      .then((data) => setUsers(data))  // Gán data trả về
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  const today = new Date().toISOString().slice(0, 10); // Lấy yyyy-mm-dd hôm nay
  const totalUsers = users.length;
  const totalTeachers = users.filter((u) => u.user_type === 'Giáo viên').length;
  const totalStudents = users.filter((u) => u.user_type === 'Học sinh').length;
  const loggedInToday = users.filter(
    (u) => u.last_login && u.last_login.startsWith(today)
  ).length;

  const [filteredUsers, setFilteredUsers] = useState(users);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view'); // view, edit, create
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter and search logic
  useEffect(() => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter((user) =>
        (user.full_name ?? '').toLowerCase().includes(q) ||
        (user.username ?? '').toLowerCase().includes(q) ||
        (user.email ?? '').toLowerCase().includes(q) ||
        (user.phone ?? '').toLowerCase().includes(q)
      );
    }


    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(user => user.user_type === filterType);
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(user =>
        filterStatus === 'active' ? user.is_active : !user.is_active
      );
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterType, filterStatus, users]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setModalType('view');
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser({ ...user });
    setModalType('edit');
    setShowModal(true);
  };

  const handleCreateUser = () => {
    setSelectedUser({
      username: '',
      email: '',
      full_name: '',
      phone: '',
      birth_date: '',
      gender: 'Nam',
      user_type: 'học sinh',
      address: '',
      reputation: 0,
      is_active: true,
      is_staff: false,
      is_superuser: false
    });
    setModalType('create');
    setShowModal(true);
  };

  const handleSaveUser = async () => {
    try {
      if (modalType === 'create') {
        try {
          const formData = new FormData();
          formData.append('username', selectedUser.username);
          formData.append('password', selectedUser.password);
          formData.append('email', selectedUser.email || '');
          formData.append('full_name', selectedUser.full_name || '');
          formData.append('phone', selectedUser.phone || '');
          formData.append('birth_date', selectedUser.birth_date || '');
          formData.append('gender', selectedUser.gender || '');
          formData.append('user_type', selectedUser.user_type || '');
          formData.append('address', selectedUser.address || '');

          // Nếu người dùng chọn file avatar
          if (selectedUser.avatarFile) {
            formData.append('avatar', selectedUser.avatarFile); // file gốc
          }

          const response = await fetch('http://localhost:8000/api/admin/admin_user/', {
            method: 'POST',
            body: formData, // không set Content-Type
          });

          if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Lỗi tạo người dùng');
          }

          alert('Tạo tài khoản thành công');
          // reload hoặc fetch lại danh sách user
          window.location.reload();
        } catch (error) {
          console.error('Error:', error);
          alert(`Tạo thất bại: ${error.message}`);
        }
      }
      else if (modalType === 'edit') {
        // PUT để update, ví dụ: update cả is_active
        const response = await fetch('http://localhost:8000/api/admin/admin_user/', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: selectedUser.id,
            is_active: selectedUser.is_active,
            // Các trường bạn muốn update bổ sung
            full_name: selectedUser.full_name,
            phone: selectedUser.phone,
            birth_date: selectedUser.birth_date,
            gender: selectedUser.gender,
            user_type: selectedUser.user_type,
            address: selectedUser.address,
            avatar: selectedUser.avatar
          }),
        });

        if (!response.ok) throw new Error('Lỗi update người dùng');
        alert('Cập nhật thành công');
      }
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra: ' + error.message);
    } finally {
      setShowModal(false);
    }
  };


  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;

    try {
      const response = await fetch('http://localhost:8000/api/admin/admin_user/', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Xóa người dùng thất bại.');
      }

      // Xóa thành công thì update list local
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      alert('Xóa người dùng thành công.');
    } catch (error) {
      console.error(error);
      alert(`Có lỗi xảy ra: ${error.message}`);
    }
  };


  const toggleUserStatus = async (userId, currentStatus) => {
    const confirmToggle = window.confirm(
      `Bạn có chắc chắn muốn ${currentStatus ? "khóa" : "mở"} tài khoản này không?`
    );

    if (!confirmToggle) {
      return; // Người dùng bấm Cancel
    }

    try {
      const response = await fetch('http://localhost:8000/api/admin/admin_user/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, is_active: !currentStatus })
      });

      if (!response.ok) {
        throw new Error('Lỗi khi cập nhật is_active');
      }

      alert(`Cập nhật trạng thái thành công!`);
      window.location.reload(); // Reload lại trang
    } catch (error) {
      console.error(error);
      alert(`Có lỗi xảy ra: ${error.message}`);
    }
  };


  const getUserTypeColor = (type) => {
    switch (type) {
      case 'admin': return 'aduserman-tag admin';
      case 'giáo viên': return 'aduserman-tag teacher';
      case 'học sinh': return 'aduserman-tag student';
      default: return 'aduserman-tag default';
    }
  };


  return (
    <div className="aduserman-page-wrapper">
      <div className="aduserman-content-container">
        <div className="dashboard-wrapper">
          {/* Search and Filters (đoạn của bạn giữ nguyên) */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "1.5rem" }}>
            <div style={{ ...cardStyle, background: "#dbeafe" }}>
              <h4 style={h4Style("#1e3a8a")}>Tổng người dùng</h4>
              <p style={pStyle("#2563eb")}>{totalUsers}</p>
            </div>
            <div style={{ ...cardStyle, background: "#d1fae5" }}>
              <h4 style={h4Style("#065f46")}>Số giáo viên</h4>
              <p style={pStyle("#059669")}>{totalTeachers}</p>
            </div>
            <div style={{ ...cardStyle, background: "#ede9fe" }}>
              <h4 style={h4Style("#6b21a8")}>Số học sinh</h4>
              <p style={pStyle("#9333ea")}>{totalStudents}</p>
            </div>
            <div style={{ ...cardStyle, background: "#ffedd5" }}>
              <h4 style={{ ...h4Style("#c2410c"), display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <Clock size={16} /> Đăng nhập hôm nay
              </h4>
              <p style={pStyle("#ea580c")}>{loggedInToday}</p>
            </div>
          </div>


          {/* Biểu đồ lượt đăng nhập theo giờ */}
          <div className="chart-container bg-white shadow rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-4">Lượt đăng nhập hôm nay theo giờ</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyLoginData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="logins" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Filters and Search */}
        <div className="aduserman-filter-box">
          <div className="aduserman-filter-bar">
            <div className="aduserman-filter-group">
              {/* Search */}
              <div className="aduserman-search-wrapper">
                <Search className="aduserman-search-icon" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, email, SĐT..."
                  className="aduserman-search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Type Filter */}
              <select
                className="aduserman-select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">Loại tài khoản</option>
                <option value="admin">Admin</option>
                <option value="Giáo viên">Giáo viên</option>
                <option value="Học sinh">Học sinh</option>
              </select>

              {/* Status Filter */}
              <select
                className="aduserman-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Đã khóa</option>
              </select>
            </div>

            {/* Add User Button */}
            <button
              onClick={handleCreateUser}
              className="aduserman-add-user-btn"
            >
              <Plus className="aduserman-plus-icon" />
              Thêm người dùng
            </button>
          </div>
        </div>
        {/*Users Table */}
        <div class="aduserman-table-wrapper">
          <div class="aduserman-table-scroll">
            <table class="aduserman-table">
              <thead class="aduserman-table-head">
                <tr>
                  <th>Người dùng</th>
                  <th>Thông tin liên hệ</th>
                  <th>Loại tài khoản</th>
                  <th>Điểm uy tín</th>
                  <th>Trạng thái</th>
                  <th>Lần đăng nhập cuối</th>
                  <th class="aduserman-text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody class="aduserman-table-body">
                {currentUsers.map((user) => (
                  <tr key={user.id} class="aduserman-row-hover">
                    <td>
                      <div class="aduserman-user-info">
                        <img
                          className="aduserman-avatar"
                          src={`http://localhost:8000${user.avatar}`}
                          alt={user.full_name}
                        />
                        <div class="aduserman-user-text">
                          <div class="aduserman-user-name">{user.full_name}</div>
                          <div class="aduserman-username">@{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="aduserman-text-dark">{user.email}</div>
                      <div class="aduserman-text-light">{user.phone}</div>
                    </td>
                    <td>
                      <span class={`aduserman-user-type ${getUserTypeColor(user.user_type)}`}>
                        {user.user_type}
                      </span>
                    </td>
                    <td>
                      <div class="aduserman-reputation">
                        <div class="aduserman-reputation-score">{user.reputation}</div>
                        <div class="aduserman-reputation-bar">
                          <div class="aduserman-reputation-fill" style={{ width: `${user.reputation}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => toggleUserStatus(user.user_id, user.is_active)}
                        className={`aduserman-status-btn ${user.is_active ? 'aduserman-active' : 'aduserman-inactive'}`}
                        style={{ cursor: "pointer" }}
                      >
                        {user.is_active ? (
                          <>
                            <UserCheck className="aduserman-icon" />
                            Hoạt động
                          </>
                        ) : (
                          <>
                            <UserX className="aduserman-icon" />
                            Đã khóa
                          </>
                        )}
                      </button>

                    </td>
                    <td class="aduserman-text-light">
                      {user.last_login ? new Date(user.last_login).toLocaleString('vi-VN') : 'Chưa từng đăng nhập'}
                    </td>
                    <td class="aduserman-actions">
                      <button onClick={() => handleViewUser(user)} class="aduserman-btn-view"><Eye className="aduserman-icon-sm" /></button>
                      <button onClick={() => handleEditUser(user)} class="aduserman-btn-edit"><Edit className="aduserman-icon-sm" /></button>
                      <button onClick={() => handleDeleteUser(user.id)} class="aduserman-btn-delete"><Trash2 className="aduserman-icon-sm" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div class="aduserman-pagination-wrapper">
              <div class="aduserman-pagination-mobile">
                <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
                  Trước
                </button>
                <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
                  Sau
                </button>
              </div>
              <div class="aduserman-pagination-desktop">
                <div>
                  <p>
                    Hiển thị <strong>{startIndex + 1}</strong> đến <strong>{Math.min(startIndex + itemsPerPage, filteredUsers.length)}</strong> trong <strong>{filteredUsers.length}</strong> kết quả
                  </p>
                </div>
                <div>
                  <nav class="aduserman-pagination-nav">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={currentPage === i + 1 ? 'aduserman-page-active' : 'aduserman-page'}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/*Modals */}
        {showModal && (
          <div className="aduserman-modal-overlay">
            <div className="aduserman-modal-container">
              <div className="aduserman-modal-header">
                <h3 className="aduserman-modal-title">
                  {modalType === 'view' && 'Chi tiết người dùng'}
                  {modalType === 'edit' && 'Chỉnh sửa người dùng'}
                  {modalType === 'create' && 'Thêm người dùng mới'}
                </h3>
                <button onClick={() => setShowModal(false)} className="aduserman-close-button">
                  <X className="aduserman-icon-close" />
                </button>
              </div>

              <div className="aduserman-form-grid">
                {/* Tên đăng nhập */}
                <div className="aduserman-form-group">
                  <label className="aduserman-label">Tên đăng nhập</label>
                  <input
                    type="text"
                    value={selectedUser?.username || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
                    disabled={modalType === 'view'}
                    className="aduserman-input"
                  />
                </div>
                <div className="aduserman-form-group">
                  <label className="aduserman-label">Mật khẩu</label>
                  <input
                    type="password"
                    value={selectedUser?.password || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value })}
                    className="aduserman-input"
                    placeholder="Nhập mật khẩu"
                  />
                </div>
                {/* Avatar */}
                <div className="aduserman-form-group">
                  <label className="aduserman-label">Ảnh đại diện</label>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={modalType === "view"}
                    className="aduserman-input"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedUser((prev) => ({
                          ...prev,
                          avatarFile: file, // Gán file raw vào state
                          avatarPreview: URL.createObjectURL(file), // Dùng để preview
                        }));
                      }
                    }}
                  />

                  {/* Preview */}
                  {selectedUser?.avatarPreview && (
                    <img
                      src={selectedUser.avatarPreview}
                      alt="Preview Avatar"
                      className="mt-2 w-24 h-24 object-cover rounded-full border"
                    />
                  )}
                </div>



                {/* Email */}
                <div className="aduserman-form-group">
                  <label className="aduserman-label">Email</label>
                  <input
                    type="email"
                    value={selectedUser?.email || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                    disabled={modalType === 'view'}
                    className="aduserman-input"
                  />
                </div>

                {/* Họ và tên */}
                <div className="aduserman-form-group">
                  <label className="aduserman-label">Họ và tên</label>
                  <input
                    type="text"
                    value={selectedUser?.full_name || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, full_name: e.target.value })}
                    disabled={modalType === 'view'}
                    className="aduserman-input"
                  />
                </div>

                {/* Số điện thoại */}
                <div className="aduserman-form-group">
                  <label className="aduserman-label">Số điện thoại</label>
                  <input
                    type="tel"
                    value={selectedUser?.phone || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })}
                    disabled={modalType === 'view'}
                    className="aduserman-input"
                  />
                </div>

                {/* Ngày sinh */}
                <div className="aduserman-form-group">
                  <label className="aduserman-label">Ngày sinh</label>
                  <input
                    type="date"
                    value={selectedUser?.birth_date || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, birth_date: e.target.value })}
                    disabled={modalType === 'view'}
                    className="aduserman-input"
                  />
                </div>

                {/* Giới tính */}
                <div className="aduserman-form-group">
                  <label className="aduserman-label">Giới tính</label>
                  <select
                    value={selectedUser?.gender || 'Nam'}
                    onChange={(e) => setSelectedUser({ ...selectedUser, gender: e.target.value })}
                    disabled={modalType === 'view'}
                    className="aduserman-select"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                {/* Loại tài khoản */}
                <div className="aduserman-form-group">
                  <label className="aduserman-label">Loại tài khoản</label>
                  <select
                    value={selectedUser?.user_type || 'học sinh'}
                    onChange={(e) => setSelectedUser({ ...selectedUser, user_type: e.target.value })}
                    disabled={modalType === 'view'}
                    className="aduserman-select"
                  >
                    <option value="Học sinh">Học sinh</option>
                    <option value="Giáo viên">Giáo viên</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Điểm uy tín */}
                <div className="aduserman-form-group">
                  <label className="aduserman-label">Điểm uy tín</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={selectedUser?.reputation || 0}
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, reputation: parseInt(e.target.value) || 0 })
                    }
                    disabled={modalType === 'view'}
                    className="aduserman-input"
                  />
                </div>

                {/* Địa chỉ */}
                <div className="aduserman-form-group aduserman-col-span-2">
                  <label className="aduserman-label">Địa chỉ</label>
                  <textarea
                    value={selectedUser?.address || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, address: e.target.value })}
                    disabled={modalType === 'view'}
                    rows="3"
                    className="aduserman-textarea"
                  />
                </div>

                {/* Nếu không phải tạo mới thì hiển thị login info */}
                {modalType !== 'create' && (
                  <>
                    <div className="aduserman-form-group">
                      <label className="aduserman-label">Lần đăng nhập cuối</label>
                      <input
                        type="text"
                        value={
                          selectedUser?.last_login
                            ? new Date(selectedUser.last_login).toLocaleString('vi-VN')
                            : 'Chưa từng đăng nhập'
                        }
                        disabled
                        className="aduserman-input"
                      />
                    </div>

                    <div className="aduserman-form-group">
                      <label className="aduserman-label">Ngày tạo tài khoản</label>
                      <input
                        type="text"
                        value={
                          selectedUser?.date_joined
                            ? new Date(selectedUser.date_joined).toLocaleString('vi-VN')
                            : ''
                        }
                        disabled
                        className="aduserman-input"
                      />
                    </div>

                    {/* 👇 Nút và biểu đồ heatmap login */}
                    <UserLoginChart />
                  </>
                )}


                {/* Nếu không phải chỉ xem thì hiển thị checkbox */}
                {modalType !== 'view' && (
                  <div className="aduserman-form-group aduserman-col-span-2">
                    <div className="aduserman-checkbox-group">
                      <label className="aduserman-checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedUser?.is_active || false}
                          onChange={(e) => setSelectedUser({ ...selectedUser, is_active: e.target.checked })}
                          className="aduserman-checkbox"
                        />
                        <span>Tài khoản hoạt động</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Nút hành động */}
              <div className="aduserman-button-group">
                <button onClick={() => setShowModal(false)} className="aduserman-button-cancel">
                  Hủy
                </button>
                {modalType !== 'view' && (
                  <button onClick={handleSaveUser} className="aduserman-button-save">
                    {modalType === 'create' ? 'Tạo tài khoản' : 'Lưu thay đổi'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManageAccount;