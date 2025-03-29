import { Navbar, Container, Nav, NavDropdown, Image } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { // Aggiungi questa funzione
    logout();
    navigate('/');
  };

  // Immagine di default per il profilo
  const defaultProfileImage = `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${user?.firstName}+${user?.lastName}`;


  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/" className='title'>Epi Travel Blog</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className='home'>Home</Nav.Link>
          </Nav>
          <Nav>
            {user ? (
              <>
                <div className="d-flex align-items-center">
                  <Image 
                    src={defaultProfileImage} 
                    roundedCircle 
                    width={40} 
                    height={40} 
                    className="me-2"
                  />
                  <NavDropdown 
                    title={`Welcome, ${user.firstName} ${user.lastName}`}
                    id="basic-nav-dropdown"
                    align="end"
                  >
                    <NavDropdown.Item as={Link} to="/posts/create">
                      Create a Post
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/my-posts">
                      My Post
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/profile">
                      Manage Profile
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item 
                      onClick={handleLogout}
                    >
                      Log me out
                    </NavDropdown.Item>
                  </NavDropdown>
                </div>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className='loginbutton'>Login</Nav.Link>
                <Nav.Link as={Link} to="/register" className='registerbutton'>Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;