import React from 'react'
import '../../assets/css/fadeIn.css'
import '../../assets/css/spinIcon.css'

import { Row, Col, Container } from 'react-bootstrap'
import config from '../../config'

import NewControlDeviceComponent from '../activate/NewControlDeviceComponent';
import SummaryCardsComponent from './SummaryCardsComponent'
import ClockComponent from '../activate/ClockComponent'
import WebSocketComponent from '../helper/socket/WebSocketComponent'
import CharComponentSensorNew from "../helper/CharComponentSensorNew"
import WarningSensorComponent from '../activate/WarningSensorComponent'

export default function DashboardComponent({ props }) {

    return (
        <>
            <WebSocketComponent />
            <h1 className="fade-in fade-in-1" style={{
                position: 'fixed', // Làm cho Row cố định
                top: 50, // Đặt nó ở trên cùng của trang
                left: 300, // Trải rộng hết chiều ngang
                zIndex: 1000, // Đặt zIndex cao để nó luôn nằm trên các thành phần khác
            }}>New Dashboard</h1>

            <Row style={{
                height: '100%',
                marginTop: 10,
                justifyContent: 'center',
                position: 'fixed', // Làm cho Row cố định
                top: 100, // Đặt nó ở trên cùng của trang
                left: 250, // Trải rộng hết chiều ngang
                zIndex: 1000, // Đặt zIndex cao để nó luôn nằm trên các thành phần khác
                width: 1550,
                border: '1px solid',
                borderColor: config.app.styles.backgroundColor2,
                borderRadius: '8px',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                marginLeft: 50,
                marginRight: 10,
            }} className='fade-in fade-in-2'>

                {/* Chart */}
                <Col lg={8}>
                    <Row className="fade-in fade-in-2" style={{
                        position: 'relative',
                        zIndex: 10,
                        borderRadius: '8px',
                        backgroundColor: config.app.styles.backgroundColor,
                        cursor: 'pointer'
                    }}>
                        <CharComponentSensorNew data={props} />
                    </Row>
                </Col>
                {/* View Panel */}
                <Col lg={4}>
                    {/* Clock */}
                    <Row>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            height: 50,
                            maxWidth: '95%',
                            marginTop: 30,
                            marginBottom: 20,
                            marginLeft: 10,
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

                    <Row>
                        <Col lg={12}>
                            <NewControlDeviceComponent />
                        </Col>
                        <Col style={{
                            marginTop: 50,
                            width: '100%',
                            backgroundColor: config.app.styles.backgroundColor,
                            borderRadius: '8px',
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
                        }}>
                            <WarningSensorComponent />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    )
}