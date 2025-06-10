import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, X, UserCheck, UserX } from 'lucide-react';
import './AdminManageAccount.css';
import CalendarHeatmap from 'react-calendar-heatmap';
import { addDays, subDays } from 'date-fns';
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
  // Sample data combining User_info and auth_user tables
  const [users, setUsers] = useState([
    {
      id: 1,
      user_id: 1,
      username: 'nguyenvana',
      email: 'nguyenvana@email.com',
      full_name: 'Nguyễn Văn A',
      phone: '0123456789',
      birth_date: '1990-05-15',
      gender: 'Nam',
      user_type: 'giáo viên',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      avatar: '/api/placeholder/50/50',
      reputation: 85,
      is_active: true,
      is_staff: true,
      is_superuser: false,
      last_login: '2024-06-10 14:30:00',
      date_joined: '2023-01-15 09:00:00'
    },
    {
      id: 2,
      user_id: 2,
      username: 'tranthib',
      email: 'tranthib@email.com',
      full_name: 'Trần Thị B',
      phone: '0987654321',
      birth_date: '2005-08-20',
      gender: 'Nữ',
      user_type: 'học sinh',
      address: '456 Đường XYZ, Quận 2, TP.HCM',
      avatar: '/api/placeholder/50/50',
      reputation: 72,
      is_active: true,
      is_staff: false,
      is_superuser: false,
      last_login: '2024-06-10 10:15:00',
      date_joined: '2023-03-20 11:30:00'
    },
    {
      id: 3,
      user_id: 3,
      username: 'admin',
      email: 'admin@system.com',
      full_name: 'Quản trị viên',
      phone: '0111222333',
      birth_date: '1985-12-01',
      gender: 'Nam',
      user_type: 'admin',
      address: 'Trụ sở chính',
      avatar: '/api/placeholder/50/50',
      reputation: 100,
      is_active: true,
      is_staff: true,
      is_superuser: true,
      last_login: '2024-06-10 16:45:00',
      date_joined: '2022-01-01 00:00:00'
    }
  ]);
 
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
      filtered = filtered.filter(user =>
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
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
    setSelectedUser({...user});
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
 
  const handleSaveUser = () => {
    if (modalType === 'create') {
      const newUser = {
        ...selectedUser,
        id: users.length + 1,
        user_id: users.length + 1,
        avatar: '/api/placeholder/50/50',
        last_login: null,
        date_joined: new Date().toISOString().slice(0, 19).replace('T', ' ')
      };
      setUsers([...users, newUser]);
    } else if (modalType === 'edit') {
      setUsers(users.map(user => user.id === selectedUser.id ? selectedUser : user));
    }
    setShowModal(false);
  };
 
  const handleDeleteUser = (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };
 
  const toggleUserStatus = (userId) => {
    setUsers(users.map(user =>
      user.id === userId ? {...user, is_active: !user.is_active} : user
    ));
  };
 
    const getUserTypeColor = (type) => {
    switch(type) {
        case 'admin': return 'aduserman-tag admin';
        case 'giáo viên': return 'aduserman-tag teacher';
        case 'học sinh': return 'aduserman-tag student';
        default: return 'aduserman-tag default';
    }
    };
 
 
  return (
    <div className="aduserman-page-wrapper">
      <div className="aduserman-content-container">
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
                    <option value="giáo viên">Giáo viên</option>
                    <option value="học sinh">Học sinh</option>
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
                            <img class="aduserman-avatar" src={user.avatar} alt="" />
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
                            onClick={() => toggleUserStatus(user.id)}
                            class={`aduserman-status-btn ${user.is_active ? 'aduserman-active' : 'aduserman-inactive'}`}
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
                        <option value="học sinh">Học sinh</option>
                        <option value="giáo viên">Giáo viên</option>
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
 
                        <label className="aduserman-checkbox-label">
                            <input
                            type="checkbox"
                            checked={selectedUser?.is_staff || false}
                            onChange={(e) => setSelectedUser({ ...selectedUser, is_staff: e.target.checked })}
                            className="aduserman-checkbox"
                            />
                            <span>Là nhân viên</span>
                        </label>
 
                        <label className="aduserman-checkbox-label">
                            <input
                            type="checkbox"
                            checked={selectedUser?.is_superuser || false}
                            onChange={(e) =>
                                setSelectedUser({ ...selectedUser, is_superuser: e.target.checked })
                            }
                            className="aduserman-checkbox"
                            />
                            <span>Quản trị viên</span>
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