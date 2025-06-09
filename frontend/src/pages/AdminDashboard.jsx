import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDragonas: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    totalSymptoms: 0,
    activeUsers: 0
  });
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    category: 'apoyo',
    isPrivate: false
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      loadAdminData();
    }
  }, [user]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, groupsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/groups')
      ]);
      
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setGroups(groupsRes.data);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserStatusChange = async (userId, isActive) => {
    try {
      await api.patch(`/admin/users/${userId}`, { is_active: isActive });
      setUsers(users.map(u => u.id === userId ? { ...u, is_active: isActive } : u));
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('¿Está seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        setUsers(users.filter(u => u.id !== userId));
        setShowUserModal(false);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/admin/groups', newGroup);
      setGroups([...groups, response.data]);
      setNewGroup({ name: '', description: '', category: 'apoyo', isPrivate: false });
      setShowGroupModal(false);
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (window.confirm('¿Está seguro de eliminar este grupo?')) {
      try {
        await api.delete(`/admin/groups/${groupId}`);
        setGroups(groups.filter(g => g.id !== groupId));
      } catch (error) {
        console.error('Error deleting group:', error);
      }
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4>Acceso Denegado</h4>
          <p>No tienes permisos para acceder al panel de administración.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-md-3">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Panel de Administración</h5>
            </div>
            <div className="list-group list-group-flush">
              <button
                className={`list-group-item list-group-item-action ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <i className="bi bi-graph-up me-2"></i>
                Resumen General
              </button>
              <button
                className={`list-group-item list-group-item-action ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                <i className="bi bi-people me-2"></i>
                Gestión de Usuarios
              </button>
              <button
                className={`list-group-item list-group-item-action ${activeTab === 'groups' ? 'active' : ''}`}
                onClick={() => setActiveTab('groups')}
              >
                <i className="bi bi-collection me-2"></i>
                Gestión de Grupos
              </button>
              <button
                className={`list-group-item list-group-item-action ${activeTab === 'reports' ? 'active' : ''}`}
                onClick={() => setActiveTab('reports')}
              >
                <i className="bi bi-file-earmark-text me-2"></i>
                Reportes y Estadísticas
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-9">
          {activeTab === 'overview' && (
            <div>
              <h2 className="mb-4">Resumen General del Sistema</h2>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <div className="card bg-primary text-white">
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h4>{stats.totalUsers}</h4>
                          <p className="mb-0">Total Usuarios</p>
                        </div>
                        <i className="bi bi-people fs-1"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card bg-success text-white">
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h4>{stats.totalDragonas}</h4>
                          <p className="mb-0">Dragonas</p>
                        </div>
                        <i className="bi bi-person-heart fs-1"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card bg-info text-white">
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h4>{stats.totalDoctors}</h4>
                          <p className="mb-0">Médicos</p>
                        </div>
                        <i className="bi bi-person-badge fs-1"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card bg-warning text-white">
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h4>{stats.totalAppointments}</h4>
                          <p className="mb-0">Citas Totales</p>
                        </div>
                        <i className="bi bi-calendar-check fs-1"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card bg-danger text-white">
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h4>{stats.totalSymptoms}</h4>
                          <p className="mb-0">Síntomas Registrados</p>
                        </div>
                        <i className="bi bi-heart-pulse fs-1"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card bg-secondary text-white">
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h4>{stats.activeUsers}</h4>
                          <p className="mb-0">Usuarios Activos</p>
                        </div>
                        <i className="bi bi-person-check fs-1"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Gestión de Usuarios</h2>
                <button className="btn btn-primary" onClick={() => window.location.href = '/register'}>
                  <i className="bi bi-plus-circle me-2"></i>
                  Nuevo Usuario
                </button>
              </div>
              
              <div className="card">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Usuario</th>
                          <th>Email</th>
                          <th>Nombre</th>
                          <th>Rol</th>
                          <th>Estado</th>
                          <th>Último Acceso</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(user => (
                          <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.name} {user.last_name}</td>
                            <td>
                              <span className={`badge ${
                                user.role === 'admin' ? 'bg-danger' :
                                user.role === 'medico' ? 'bg-info' : 'bg-success'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${user.is_active ? 'bg-success' : 'bg-secondary'}`}>
                                {user.is_active ? 'Activo' : 'Inactivo'}
                              </span>
                            </td>
                            <td>
                              {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Nunca'}
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                <button
                                  className="btn btn-outline-primary"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setShowUserModal(true);
                                  }}
                                >
                                  <i className="bi bi-eye"></i>
                                </button>
                                <button
                                  className={`btn ${user.is_active ? 'btn-outline-warning' : 'btn-outline-success'}`}
                                  onClick={() => handleUserStatusChange(user.id, !user.is_active)}
                                >
                                  <i className={`bi ${user.is_active ? 'bi-pause' : 'bi-play'}`}></i>
                                </button>
                                {user.role !== 'admin' && (
                                  <button
                                    className="btn btn-outline-danger"
                                    onClick={() => handleDeleteUser(user.id)}
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'groups' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Gestión de Grupos de Comunidad</h2>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowGroupModal(true)}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Crear Grupo
                </button>
              </div>

              <div className="row">
                {groups.map(group => (
                  <div key={group.id} className="col-md-6 mb-3">
                    <div className="card">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h5 className="card-title">{group.name}</h5>
                            <p className="card-text text-muted">{group.description}</p>
                            <div className="d-flex gap-2">
                              <span className="badge bg-primary">{group.category}</span>
                              <span className={`badge ${group.isPrivate ? 'bg-warning' : 'bg-success'}`}>
                                {group.isPrivate ? 'Privado' : 'Público'}
                              </span>
                              <span className="badge bg-info">{group.memberCount || 0} miembros</span>
                            </div>
                          </div>
                          <div className="dropdown">
                            <button 
                              className="btn btn-outline-secondary btn-sm"
                              data-bs-toggle="dropdown"
                            >
                              <i className="bi bi-three-dots-vertical"></i>
                            </button>
                            <ul className="dropdown-menu">
                              <li>
                                <button className="dropdown-item" onClick={() => {}}>
                                  <i className="bi bi-pencil me-2"></i>Editar
                                </button>
                              </li>
                              <li>
                                <button className="dropdown-item" onClick={() => {}}>
                                  <i className="bi bi-people me-2"></i>Ver Miembros
                                </button>
                              </li>
                              <li><hr className="dropdown-divider" /></li>
                              <li>
                                <button 
                                  className="dropdown-item text-danger"
                                  onClick={() => handleDeleteGroup(group.id)}
                                >
                                  <i className="bi bi-trash me-2"></i>Eliminar
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div>
              <h2 className="mb-4">Reportes y Estadísticas</h2>
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="card">
                    <div className="card-header">
                      <h5>Actividad de Usuarios</h5>
                    </div>
                    <div className="card-body">
                      <p>Usuarios registrados en los últimos 30 días: <strong>12</strong></p>
                      <p>Usuarios activos en los últimos 7 días: <strong>8</strong></p>
                      <p>Promedio de sesiones por usuario: <strong>3.2</strong></p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="card">
                    <div className="card-header">
                      <h5>Uso de Funcionalidades</h5>
                    </div>
                    <div className="card-body">
                      <p>Síntomas registrados esta semana: <strong>45</strong></p>
                      <p>Citas programadas este mes: <strong>23</strong></p>
                      <p>Reflexiones diarias completadas: <strong>67</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Usuario */}
      {showUserModal && selectedUser && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalles del Usuario</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowUserModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>ID:</strong> {selectedUser.id}</p>
                    <p><strong>Usuario:</strong> {selectedUser.username}</p>
                    <p><strong>Email:</strong> {selectedUser.email}</p>
                    <p><strong>Nombre:</strong> {selectedUser.name} {selectedUser.last_name}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Rol:</strong> {selectedUser.role}</p>
                    <p><strong>Estado:</strong> {selectedUser.is_active ? 'Activo' : 'Inactivo'}</p>
                    <p><strong>Registro:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                    <p><strong>Último acceso:</strong> {selectedUser.last_login ? new Date(selectedUser.last_login).toLocaleDateString() : 'Nunca'}</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowUserModal(false)}
                >
                  Cerrar
                </button>
                {selectedUser.role !== 'admin' && (
                  <button 
                    type="button" 
                    className="btn btn-danger"
                    onClick={() => handleDeleteUser(selectedUser.id)}
                  >
                    Eliminar Usuario
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Crear Grupo */}
      {showGroupModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Crear Nuevo Grupo</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowGroupModal(false)}
                ></button>
              </div>
              <form onSubmit={handleCreateGroup}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nombre del Grupo</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newGroup.name}
                      onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={newGroup.description}
                      onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Categoría</label>
                    <select
                      className="form-select"
                      value={newGroup.category}
                      onChange={(e) => setNewGroup({...newGroup, category: e.target.value})}
                    >
                      <option value="apoyo">Apoyo Emocional</option>
                      <option value="informativo">Informativo</option>
                      <option value="actividades">Actividades</option>
                      <option value="general">General</option>
                    </select>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={newGroup.isPrivate}
                      onChange={(e) => setNewGroup({...newGroup, isPrivate: e.target.checked})}
                    />
                    <label className="form-check-label">
                      Grupo Privado (requiere aprobación para unirse)
                    </label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowGroupModal(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Crear Grupo
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

