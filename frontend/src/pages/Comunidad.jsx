import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Modal, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Comunidad = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general' });
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = async () => {
    try {
      setLoading(true);
      const [postsRes, groupsRes] = await Promise.all([
        api.get('/community/posts'),
        api.get('/community/groups')
      ]);
      
      setPosts(postsRes.data || []);
      setGroups(groupsRes.data || []);
    } catch (error) {
      console.error('Error loading community data:', error);
      setError('Error al cargar los datos de la comunidad');
      // Datos de fallback para desarrollo
      setPosts([]);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/community/posts', newPost);
      setPosts([response.data, ...posts]);
      setNewPost({ title: '', content: '', category: 'general' });
      setShowNewPost(false);
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Error al crear la publicación');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <p className="mt-3">Cargando comunidad...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4 animate-fade-in">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center">
              <img 
                src="/images/2.jpg" 
                alt="Comunidad" 
                className="rounded-circle me-3"
                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
              />
              <div>
                <h1 className="mb-1">Comunidad de Dragonas</h1>
                <p className="text-muted mb-0">Espacio de apoyo y conexión</p>
              </div>
            </div>
            <Button 
              variant="primary" 
              onClick={() => setShowNewPost(true)}
              className="d-flex align-items-center"
            >
              <i className="bi bi-plus-circle me-2"></i>
              Nueva Publicación
            </Button>
          </div>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Estadísticas rápidas */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <i className="bi bi-people text-primary mb-2" style={{ fontSize: '2rem' }}></i>
              <h4 className="mb-1">{groups.length || 0}</h4>
              <p className="text-muted mb-0">Grupos activos</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <i className="bi bi-chat-dots text-success mb-2" style={{ fontSize: '2rem' }}></i>
              <h4 className="mb-1">{posts.length || 0}</h4>
              <p className="text-muted mb-0">Publicaciones</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <i className="bi bi-heart text-danger mb-2" style={{ fontSize: '2rem' }}></i>
              <h4 className="mb-1">0</h4>
              <p className="text-muted mb-0">Reacciones hoy</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <i className="bi bi-calendar-event text-info mb-2" style={{ fontSize: '2rem' }}></i>
              <h4 className="mb-1">0</h4>
              <p className="text-muted mb-0">Eventos próximos</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Publicaciones */}
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Publicaciones Recientes</h5>
            </Card.Header>
            <Card.Body>
              {posts.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-chat-square-text text-muted mb-3" style={{ fontSize: '3rem' }}></i>
                  <h5 className="text-muted">No hay publicaciones aún</h5>
                  <p className="text-muted">Sé la primera en compartir algo con la comunidad</p>
                  <Button variant="primary" onClick={() => setShowNewPost(true)}>
                    Crear Primera Publicación
                  </Button>
                </div>
              ) : (
                posts.map(post => (
                  <div key={post.id} className="border-bottom pb-3 mb-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div className="d-flex align-items-center">
                        <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                             style={{ width: '40px', height: '40px' }}>
                          <i className="bi bi-person text-white"></i>
                        </div>
                        <div>
                          <h6 className="mb-0">{post.author_name}</h6>
                          <small className="text-muted">{formatDate(post.created_at)}</small>
                        </div>
                      </div>
                      <Badge bg="secondary">{post.category}</Badge>
                    </div>
                    <h6>{post.title}</h6>
                    <p className="text-muted mb-2">{post.content}</p>
                    <div className="d-flex align-items-center">
                      <Button variant="outline-primary" size="sm" className="me-2">
                        <i className="bi bi-heart me-1"></i>
                        {post.likes || 0}
                      </Button>
                      <Button variant="outline-secondary" size="sm">
                        <i className="bi bi-chat me-1"></i>
                        {post.comments || 0}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Grupos y eventos */}
        <Col md={4}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Grupos de Apoyo</h5>
            </Card.Header>
            <Card.Body>
              {groups.length === 0 ? (
                <div className="text-center py-3">
                  <p className="text-muted">No hay grupos disponibles</p>
                  <Button variant="outline-primary" size="sm">
                    Crear Grupo
                  </Button>
                </div>
              ) : (
                groups.map(group => (
                  <div key={group.id} className="d-flex justify-content-between align-items-center mb-3 p-2 border rounded">
                    <div>
                      <h6 className="mb-1">{group.name}</h6>
                      <small className="text-muted">{group.members_count} miembros</small>
                    </div>
                    <Button variant="outline-primary" size="sm">
                      Unirse
                    </Button>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h5 className="mb-0">Próximos Eventos</h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center py-3">
                <i className="bi bi-calendar-x text-muted mb-2" style={{ fontSize: '2rem' }}></i>
                <p className="text-muted mb-0">No hay eventos programados</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal para nueva publicación */}
      <Modal show={showNewPost} onHide={() => setShowNewPost(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Nueva Publicación</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreatePost}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                placeholder="Escribe un título para tu publicación"
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Select
                value={newPost.category}
                onChange={(e) => setNewPost({...newPost, category: e.target.value})}
              >
                <option value="general">General</option>
                <option value="apoyo">Apoyo</option>
                <option value="consejos">Consejos</option>
                <option value="experiencias">Experiencias</option>
                <option value="preguntas">Preguntas</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contenido</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Comparte tus pensamientos, experiencias o preguntas..."
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowNewPost(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Publicar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Comunidad;

