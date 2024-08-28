import { Col, Row } from 'react-bootstrap';

import SideBarComponent from '../components/SideBarComponent';
import SideBarTopComponent from '../components/SideBarTopComponent';
import MainLayoutComponent from '../components/MainLayoutComponent';
import config from '../config';

export default function HomePage() {

    return (
        <Row>
            <Col xs={12} sm={12} md={3} lg={2} xl={2} className="d-flex">
                <SideBarComponent />
            </Col>
            <Col xs={12} sm={12} md={9} lg={10} xl={10} className="content p-4">
                <Row>
                    <Col >
                        <SideBarTopComponent />
                    </Col>
                </Row>
                <Row style={{ marginTop: config.app.styles.heightNavbar - 15 }}>
                    <Col>
                        <MainLayoutComponent />
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}