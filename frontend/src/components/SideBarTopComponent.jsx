import { Nav, Navbar } from 'react-bootstrap'
import config from '../config'

export default function NavBarTopComponent() {
    const styles = {
        linkNavbar: {
            color: '#adb5bd',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            display: 'block',
            fontSize: 16,
            paddingTop: 12,
            paddingBottom: 4
        }
    }
    return (
        <Navbar fixed="top" expand="lg" className="bg-body-tertiary w-100" style={{
            boxShadow: '0 2px 5px ' + config.app.styles.widthSidebar,
            paddingTop: 5,
            borderRadius: '15px',
            transition: 'box-shadow 0.3s ease-in-out',
            marginLeft: config.app.styles.widthSidebar,
            height: config.app.styles.heightNavbar,
            alignItems: 'center'
        }}>
            <Navbar.Collapse id="basic-navbar-nav" style={{
                // backgroundColor: '#3CB371',
                backgroundColor: config.app.styles.sideBarColor,
                paddingBottom: 10,
                alignItems: 'center'
            }}>
                <Nav className="ms-auto" >
                    <Nav.Link href="#home" style={styles.linkNavbar}>Hello</Nav.Link>
                    <Nav.Link href="#link" style={{ ...styles.linkNavbar, marginRight: config.app.styles.widthSidebar + 10 }}>Nguyễn Giang Nam</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}