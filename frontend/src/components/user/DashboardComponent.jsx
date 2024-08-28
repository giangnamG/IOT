import React from 'react'
import '../../assets/css/fadeIn.css'
import '../../assets/css/spinIcon.css'

import { Row, Col, Container } from 'react-bootstrap'
import ChartComponent from "../helper/ChartComponent"
import config from '../../config'

import ControlDeviceComponent from '../activate/ControlDeviceComponent';
import SummaryCardsComponent from './SummaryCardsComponent'
import ClockComponent from '../activate/ClockComponent'
import WebSocketComponent from '../helper/socket/WebSocketComponent'

export default function DashboardComponent({ props }) {

    return (
        <Container>
            <WebSocketComponent />
            <h1 className="fade-in fade-in-1">Dashboard</h1>
            <Row>
                <Col lg={8} className='fade-in fade-in-2'>
                    <SummaryCardsComponent />
                </Col>
                <Col lg={3} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '28%',
                    height: 370,
                }} className='fade-in fade-in-2'>
                    <Row style={{
                        marginRight: 20,
                        marginBottom: 20,
                    }}>
                        <ControlDeviceComponent />
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginTop: 20,
                            height: 100,
                            justifyContent: 'center',
                            borderRadius: '8px',
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                            cursor: 'pointer',
                            backgroundColor: config.app.styles.backgroundColor2
                        }}>
                            <i className="bi bi-clock" style={{ marginRight: 16, fontSize: '24px' }}></i>
                            <ClockComponent />
                        </div>
                    </Row>

                </Col>
            </Row>
            <Row style={{
                height: '100%',
                justifyContent: 'center',
                marginLeft: 0
            }} className='fade-in fade-in-6'>
                <Col lg={10} style={{ height: '100%', width: '100%' }}>
                    <Row className="fade-in fade-in-6" style={{
                        position: 'relative',
                        zIndex: 10,
                        // boxShadow: '0px 4px 2px ' + config.app.styles.backgroundColor2,
                        borderRadius: '8px',
                        backgroundColor: config.app.styles.backgroundColor,
                        padding: '20px',
                        marginBottom: '20px',
                        cursor: 'pointer'
                    }}>
                        <ChartComponent data={props} />
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}