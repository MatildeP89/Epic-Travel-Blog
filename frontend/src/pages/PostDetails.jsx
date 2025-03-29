import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import Comments from '../components/Comments';

const PostDetails = () => {
    const [post, setPost] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:3001/posts/${id}`);
                setPost(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching post:', error);
                setError('Error while loading the post');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await axios.delete(`http://localhost:3001/posts/${id}`);
                navigate('/my-posts');
            } catch (err) {
                setError('Error while deleting the post');
            }
        }
    };

    // Verifica se l'utente è l'autore del post
    const isAuthor = user && post.author && user._id === post.author._id;

    return (
        <Container className="mt-5">
            {loading && <p>Loading...</p>}
            {error && <Alert variant="danger">{error}</Alert>}
            {post && post._id && (
                <>
                    <Row className="mb-4">
                        <Col md={8}>
                            <div className="d-flex justify-content-between align-items-center">
                                <h1>{post.title}</h1>
                                {isAuthor && (
                                    <div>
                                        <Button 
                                            variant="outline-primary" 
                                            className="me-2"
                                            onClick={() => navigate(`/posts/edit/${post._id}`)}
                                        >
                                            Modify
                                        </Button>
                                        <Button 
                                            variant="outline-danger"
                                            onClick={handleDelete}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                )}
                            </div>
                            <div className="mb-3">
                                <span className="badge bg-secondary me-2">{post.category}</span>
                                <small className="text-muted">
                                    {post.readTime?.value} {post.readTime?.unit}
                                </small>
                            </div>
                            <p>{post.content}</p>
                            <div className="mt-4">
                                <small className="text-muted">
                                    Author: {post.author?.firstName} {post.author?.lastName}
                                </small>
                            </div>
                        </Col>
                        <Col md={4}>
                            <img 
                                src={post.cover} 
                                alt={post.title} 
                                className="img-fluid rounded shadow"
                            />
                        </Col>
                    </Row>
                    <Comments postId={post._id} />
                </>
            )}
        </Container>
    );
};

export default PostDetails;