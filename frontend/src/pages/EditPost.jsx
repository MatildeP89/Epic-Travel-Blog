import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [coverImage, setCoverImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        cover: '',
        content: '',
        readTime: {
            value: '',
            unit: 'minuti'
        }
    });

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/posts/${id}`);
                const post = response.data;
                
                if (post.author._id !== user._id) {
                    navigate('/');
                    return;
                }

                setFormData({
                    title: post.title,
                    category: post.category,
                    cover: post.cover,
                    content: post.content,
                    readTime: post.readTime
                });
                setPreviewUrl(post.cover);
            } catch (err) {
                setError('Errore nel caricamento del post');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id, user._id, navigate]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('content', formData.content);
            formDataToSend.append('readTime', JSON.stringify({
                value: parseInt(formData.readTime.value),
                unit: formData.readTime.unit
            }));

            // Aggiungi l'immagine solo se è stata modificata
            if (coverImage) {
                formDataToSend.append('cover', coverImage);
            }

            const response = await axios.put(
                `http://localhost:3001/posts/${id}`, 
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data) {
                navigate(`/posts/${id}`);
            }
        } catch (err) {
            console.error('Errore:', err);
            setError(err.response?.data?.message || 'Errore durante l\'aggiornamento del post');
        }
    };

    if (loading) return <Container className="mt-4"><p>Caricamento...</p></Container>;

    return (
        <Container>
            <Row className="justify-content-center mt-5">
                <Col xs={12} md={8}>
                    <h2>Modify Post</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Cover picture</Form.Label>
                            {previewUrl && (
                                <div className="mb-3">
                                    <img 
                                        src={previewUrl} 
                                        alt="Cover preview" 
                                        style={{
                                            maxWidth: '200px',
                                            display: 'block',
                                            marginBottom: '1rem'
                                        }}
                                    />
                                </div>
                            )}
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            <Form.Text className="text-muted">
                                Upload new picture only if you want to replace the existing one
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={6}
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Reading time (minutes)</Form.Label>
                            <Form.Control
                                type="number"
                                value={formData.readTime.value}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    readTime: { ...formData.readTime, value: parseInt(e.target.value) }
                                })}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Update Post
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default EditPost;