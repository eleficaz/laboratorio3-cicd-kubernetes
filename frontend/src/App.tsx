import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'
import { API_URL } from './config'

type User = {
  id: number
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

type UserFormState = {
  name: string
  email: string
}

const initialFormState: UserFormState = {
  name: '',
  email: '',
}

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [formData, setFormData] = useState<UserFormState>(initialFormState)
  const [editingUserId, setEditingUserId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function loadUsers() {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await fetch(`${API_URL}/users`)

      if (!response.ok) {
        throw new Error('No fue posible cargar los usuarios.')
      }

      const nextUsers = (await response.json()) as User[]
      setUsers(nextUsers)
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Error inesperado al cargar usuarios.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadUsers()
  }, [])

  function resetForm() {
    setFormData(initialFormState)
    setEditingUserId(null)
  }

  function startEdit(user: User) {
    setFormData({ name: user.name, email: user.email })
    setEditingUserId(user.id)
    setErrorMessage('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')

    const endpoint = editingUserId === null ? `${API_URL}/users` : `${API_URL}/users/${editingUserId}`
    const method = editingUserId === null ? 'POST' : 'PATCH'

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('No fue posible guardar el usuario.')
      }

      resetForm()
      await loadUsers()
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Error inesperado al guardar el usuario.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(userId: number) {
    setErrorMessage('')

    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('No fue posible eliminar el usuario.')
      }

      if (editingUserId === userId) {
        resetForm()
      }

      await loadUsers()
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Error inesperado al eliminar el usuario.',
      )
    }
  }

  function formatDate(value: string) {
    return new Intl.DateTimeFormat('es-CL', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value))
  }

  return (
    <main className="layout">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Administracion de usuarios</p>
          <h1>CRUD conectado a NestJS y PostgreSQL</h1>
          <p className="lead">
            Gestiona usuarios desde una sola pantalla. La aplicacion consume el backend
            configurado en <strong>{API_URL}</strong>.
          </p>
        </div>
        <div className="hero-card">
          <span>Registros</span>
          <strong>{users.length}</strong>
          <small>{editingUserId === null ? 'Modo creacion' : `Editando #${editingUserId}`}</small>
        </div>
      </section>

      <section className="content-grid">
        <article className="panel form-panel">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Formulario</p>
              <h2>{editingUserId === null ? 'Nuevo usuario' : 'Editar usuario'}</h2>
            </div>
            {editingUserId !== null && (
              <button type="button" className="ghost-button" onClick={resetForm}>
                Cancelar
              </button>
            )}
          </div>

          <form className="user-form" onSubmit={handleSubmit}>
            <label>
              Nombre
              <input
                type="text"
                value={formData.name}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, name: event.target.value }))
                }
                placeholder="Ada Lovelace"
                required
              />
            </label>

            <label>
              Correo electronico
              <input
                type="email"
                value={formData.email}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, email: event.target.value }))
                }
                placeholder="ada@ejemplo.com"
                required
              />
            </label>

            <button type="submit" className="primary-button" disabled={isSubmitting}>
              {isSubmitting
                ? 'Guardando...'
                : editingUserId === null
                  ? 'Crear usuario'
                  : 'Actualizar usuario'}
            </button>
          </form>

          {errorMessage && <p className="feedback error">{errorMessage}</p>}
        </article>

        <article className="panel list-panel">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Listado</p>
              <h2>Usuarios registrados</h2>
            </div>
            <button type="button" className="ghost-button" onClick={() => void loadUsers()}>
              Recargar
            </button>
          </div>

          {isLoading ? (
            <p className="feedback">Cargando usuarios...</p>
          ) : users.length === 0 ? (
            <p className="feedback">Aun no hay usuarios registrados.</p>
          ) : (
            <div className="user-list">
              {users.map((user) => (
                <article key={user.id} className="user-card">
                  <div>
                    <span className="user-id">#{user.id}</span>
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                  </div>
                  <dl>
                    <div>
                      <dt>Creado</dt>
                      <dd>{formatDate(user.createdAt)}</dd>
                    </div>
                    <div>
                      <dt>Actualizado</dt>
                      <dd>{formatDate(user.updatedAt)}</dd>
                    </div>
                  </dl>
                  <div className="actions">
                    <button type="button" className="ghost-button" onClick={() => startEdit(user)}>
                      Editar
                    </button>
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => void handleDelete(user.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </article>
      </section>
    </main>
  )
}

export default App
