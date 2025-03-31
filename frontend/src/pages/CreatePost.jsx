import {useState} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";

const CreatePost = () => {
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        cover: "",
        content: "",
        readTime: {
            value: "",
            unit: "minutes"
        }
    });

    const [coverImage, setCoverImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [error, setError] = useState("");
    const { user } = useAuth();
    const navigate = useNavigate();

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
            if (!user || !user._id) {
                setError('You must be an existing user to create a post');
                return;
            }
    
            if (!coverImage) {
                setError('Cover picture is mandatory!');
                return;
            }
    
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('content', formData.content);
            formDataToSend.append('readTime', JSON.stringify({
                value: parseInt(formData.readTime.value),
                unit: formData.readTime.unit
            }));
            formDataToSend.append('author', user._id);
            formDataToSend.append('cover', coverImage);
    
            const response = await axios.post(
                process.env.REACT_APP_API_BASE_URL + "/posts", 
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
    
            if (response.data) {
                navigate("/");
            }
        } catch (err) {
            console.error('Errore:', err);
            setError(err.response?.data?.message || 'Error during the post creation');
        }
    };

    return (
        <Container>
            <Row className="justify-content-center mt-5">
                <Col xs={12} md={6}>
                    <h1>Create a new post</h1>
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
                <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                />
                {previewUrl && (
                    <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="mt-2" 
                        style={{maxWidth: '200px'}} 
                    />
                )}
            </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Reading time</Form.Label>
                            <Row>
                                <Col xs={8}>
                                    <Form.Control
                                        type="number"
                                        value={formData.readTime.value}
                                        onChange={(e) => setFormData({ ...formData, readTime: { ...formData.readTime, value: e.target.value } })}
                                        required
                                    />
                                </Col>
                                <Col xs={4}>
                                    
                                </Col>
                            </Row>
                        </Form.Group>
                        <Button variant="primary" type="submit" className="button">
                            Create Post
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )};

export default CreatePost;