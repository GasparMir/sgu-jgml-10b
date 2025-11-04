import React, { useMemo, useState } from 'react';
import './index.css';
import { userService } from './services/userServices';

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const emptyForm = useMemo(
    () => ({ name: '', lastname: '', surname: '', email: '', tel: '' }),
    []
  );
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsOpen(true);
  };

  const openEdit = (user) => {
    setEditingId(user.id);
    setForm({
      name: user.name,
      lastname: user.lastname,
      surname: user.surname,
      email: user.email,
      tel: user.tel,
    });
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const action = editingId
      ? userService.update(editingId, form)
      : userService.create(form);

    action
      .then(() => {
        close();
        loadUsers();
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar el usuario?')) return;

    setLoading(true);
    setError(null);
    try {
      await userService.delete(id);
      loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getAll();
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.users)
        ? data.users
        : [];
      setUsers(list);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-6">
        <header className="mb-8 flex gap-4 items-center">
          <h1 className="text-4xl font-light tracking-tight">Usuarios</h1>
          <button
            onClick={openAdd}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-md bg-black px-4 py-2 text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '...' : 'Agregar usuario'}
          </button>
        </header>

        {/* Contenedor dividido: tabla + panel lateral */}
        <div className="flex gap-6 transition-all duration-300">
          {/* Tabla de usuarios */}
          <div
            className={`transition-all duration-300 ${
              isOpen ? 'w-2/3' : 'w-full'
            }`}
          >
            <div className="overflow-x-auto rounded-lg border border-black/20 bg-[#f5f5f0] shadow-sm">
              <table className="min-w-full border border-gray-200 shadow-sm overflow-hidden rounded-lg">
                <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
                  <tr>
                    <Th>Nombre</Th>
                    <Th>Apellido Paterno</Th>
                    <Th>Apellido Materno</Th>
                    <Th>Correo</Th>
                    <Th>Teléfono</Th>
                    <Th className="text-right font-bold">+</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-gray-500 italic">
                        Leyendo usuarios...
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-gray-500 italic">
                        No hay usuarios
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr
                        key={u.id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Td>{u.name}</Td>
                        <Td>{u.lastname}</Td>
                        <Td>{u.surname}</Td>
                        <Td>{u.email}</Td>
                        <Td>{u.tel}</Td>
                        <Td>
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openEdit(u)}
                              disabled={loading}
                              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-900 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => onDelete(u.id)}
                              disabled={loading}
                              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-red-600 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Eliminar
                            </button>
                          </div>
                        </Td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {isOpen && (
            <div className="w-1/3 bg-[#f5f5f0] p-6 rounded-lg shadow-lg transition-all duration-100">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-light">
                  {editingId ? 'Editar usuario' : 'Agregar usuario'}
                </h2>
                <button
                  onClick={close}
                  className="rounded-md p-2 text-gray-700 hover:bg-black hover:text-white transition-colors"
                  aria-label="Cerrar"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Nombre">
                  <input
                    placeholder="Nombre"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    required
                    className="w-full rounded-md border border-black/20 px-3 py-2 bg-[#f5f5f0] focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </Field>
                <Field label="Apellido Paterno">
                  <input
                    placeholder="Apellido Paterno"
                    name="lastname"
                    value={form.lastname}
                    onChange={onChange}
                    required
                    className="w-full rounded-md border border-black/20 px-3 py-2 bg-[#f5f5f0] focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </Field>
                <Field label="Apellido Materno">
                  <input
                    placeholder="Apellido Materno"
                    name="surname"
                    value={form.surname}
                    onChange={onChange}
                    required
                    className="w-full rounded-md border border-black/20 px-3 py-2 bg-[#f5f5f0] focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </Field>
                <Field label="Correo">
                  <input
                    placeholder="correo@email.com"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    required
                    className="w-full rounded-md border border-black/20 px-3 py-2 bg-[#f5f5f0] focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </Field>
                <Field label="Teléfono">
                  <input
                    placeholder="777 123 4567"
                    type="tel"
                    name="tel"
                    value={form.tel}
                    onChange={onChange}
                    required
                    className="w-full rounded-md border border-black/20 px-3 py-2 bg-[#f5f5f0] focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </Field>

                <div className="col-span-full mt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={close}
                    className="rounded-md border border-black/20 px-4 py-2 text-gray-900 hover:bg-black hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800 transition-colors"
                  >
                    {editingId ? 'Guardar' : 'Agregar'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Th({ children, className = '' }) {
  return (
    <th
      className={`px-4 py-3 text-left text-sm font-medium text-gray-900 ${className}`}
      scope="col"
    >
      {children}
    </th>
  );
}

function Td({ children, className = '' }) {
  return <td className={`px-4 py-3 text-sm text-gray-900 ${className}`}>{children}</td>;
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-900">{label}</span>
      {children}
    </label>
  );
}
