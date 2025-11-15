import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const TasterManagement = () => {
  const [tasters, setTasters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [pendingActionUser, setPendingActionUser] = useState(null);
  const [confirmActionType, setConfirmActionType] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    fetchTasters();
  }, []);

  const fetchTasters = async () => {
    try {
      const response = await fetch('http://localhost:8082/api/usuarios/all', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();

      const mappedTasters = data.map((user) => ({
        id: user.idUsuario,
        name: user.nombre,
        email: user.email,
        avatar: user.fotoPerfil || 'https://randomuser.me/api/portraits/lego/1.jpg',
        status: user.rol,
        isAdmin: user.rol === 'ADMIN',
        fullData: user,
      }));

      setTasters(mappedTasters);
    } catch (error) {
      console.error('Error fetching tasters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const requestRoleChange = (taster) => {
    setPendingActionUser(taster);
    setConfirmActionType('role');
    setShowConfirmModal(true);
  };

  const requestDeleteUser = (taster) => {
    setPendingActionUser(taster);
    setConfirmActionType('delete');
    setShowConfirmModal(true);
  };

  const confirmAction = async () => {
    if (!pendingActionUser) return;

    try {
      if (confirmActionType === 'role') {
        const newRole = pendingActionUser.status === 'CATADOR' ? 'USER' : 'CATADOR';
        const updatedDTO = {
          ...pendingActionUser.fullData,
          rol: newRole,
        };

        const response = await fetch(
          `http://localhost:8082/api/usuarios/update?idUsuario=${pendingActionUser.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(updatedDTO),
          }
        );

        if (!response.ok) throw new Error('Failed to update role');

        const updatedUser = await response.json();
        setTasters((prev) =>
          prev.map((u) =>
            u.id === pendingActionUser.id
              ? {
                  ...u,
                  status: updatedUser.rol,
                  fullData: { ...updatedUser },
                }
              : u
          )
        );
      } else if (confirmActionType === 'delete') {
        const response = await fetch(
          `http://localhost:8082/api/usuarios/delete?idUsuario=${pendingActionUser.id}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (!response.ok) throw new Error('Failed to delete user');

        setTasters((prev) => prev.filter((u) => u.id !== pendingActionUser.id));
      }
    } catch (error) {
      console.error('Error during action:', error);
    } finally {
      setPendingActionUser(null);
      setConfirmActionType(null);
      setShowConfirmModal(false);
    }
  };

  const filteredTasters = tasters.filter((taster) =>
    (taster.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (taster.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTasters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTasters = filteredTasters.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    const totalFilteredPages = Math.ceil(filteredTasters.length / itemsPerPage);
    if (currentPage > totalFilteredPages) {
      setCurrentPage(Math.max(1, totalFilteredPages));
    }
  }, [filteredTasters, currentPage, itemsPerPage]);

  const getStatusBadge = (role) => {
    const base = 'status-badge';
    if (role === 'ADMIN') return `${base} status-warning`;
    if (role === 'CATADOR') return `${base} status-success`;
    return `${base} status-secondary`;
  };

  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="shimmer">
          <div className="skeleton h-16 w-full rounded-lg"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Taster Management</h2>
          <p className="text-sm text-text-secondary mt-1">{filteredTasters.length} total tasters</p>
        </div>
      </div>

      <div className="relative mb-4">
        <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
        <input
          type="text"
          placeholder="Search tasters by name or email..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="input-field pl-10"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <LoadingSkeleton />
        ) : paginatedTasters.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Users" size={32} color="#64748B" />
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">No tasters found</h3>
            <p className="text-text-secondary">
              {searchTerm ? 'Try adjusting your search criteria' : 'Get started by adding your first taster'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {paginatedTasters.map((taster) => (
              <div key={taster.id} className="card hover-lift">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-secondary-100">
                        <Image src={taster.avatar} alt={taster.name} className="w-full h-full object-cover" />
                      </div>
                      {taster.status === 'CATADOR' && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-success rounded-full flex items-center justify-center">
                          <Icon name="Crown" size={12} color="white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-text-primary">{taster.name}</h3>
                        <span className={getStatusBadge(taster.status)}>{taster.status}</span>
                      </div>
                      <p className="text-sm text-text-secondary">{taster.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => requestRoleChange(taster)}
                      className="p-2 text-text-secondary hover:text-success hover:bg-success-50 rounded-lg transition-all duration-150"
                      title={`Toggle role to ${taster.status === 'CATADOR' ? 'USER' : 'CATADOR'}`}
                    >
                      <Icon name="Crown" size={16} />
                    </button>

                    <button
                      onClick={() => requestDeleteUser(taster)}
                      className="p-2 text-text-secondary hover:text-error hover:bg-error-50 rounded-lg transition-all duration-150"
                      title="Delete taster"
                    >
                      <Icon name="Trash2" size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!isLoading && filteredTasters.length > itemsPerPage && (
        <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
          <div className="text-sm text-text-secondary">
            Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredTasters.length)} of {filteredTasters.length}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon name="ChevronLeft" size={16} />
            </button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-150 ${
                      currentPage === pageNum
                        ? 'bg-primary text-white'
                        : 'text-text-secondary hover:text-text-primary hover:bg-secondary-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon name="ChevronRight" size={16} />
            </button>
          </div>
        </div>
      )}

      {showConfirmModal && pendingActionUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Confirmar acción</h2>
            <p className="text-text-secondary mb-6">
              {confirmActionType === 'role' ? (
                <>
                  ¿Estás seguro de cambiar el rol del usuario <strong>"{pendingActionUser.name}"</strong> a{' '}
                  <strong>{pendingActionUser.status === 'CATADOR' ? 'USER' : 'CATADOR'}</strong>?
                </>
              ) : (
                <>
                  ¿Estás seguro de eliminar al usuario <strong>"{pendingActionUser.name}"</strong>? Esta acción no se puede deshacer.
                </>
              )}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setPendingActionUser(null);
                  setConfirmActionType(null);
                }}
                className="px-4 py-2 text-sm bg-secondary-100 text-text-primary rounded-lg hover:bg-secondary-200 transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmAction}
                className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-600 transition"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasterManagement;
