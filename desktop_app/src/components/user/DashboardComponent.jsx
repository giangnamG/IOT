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
import WarningSensorComponent from '../activate/WarningSensorComponent'
import ChartComponentSensor2 from '../helper/ChartComponentSensor2'
export default function DashboardComponent({ props }) {

    return (
        <>
            <WebSocketComponent />
            <h1 className="fade-in fade-in-1" style={{
                position: 'fixed', // Làm cho Row cố định
                top: 50, // Đặt nó ở trên cùng của trang
                left: 300, // Trải rộng hết chiều ngang
                zIndex: 1000, // Đặt zIndex cao để nó luôn nằm trên các thành phần khác
            }}>Dashboard</h1>

            <Row style={{
                height: '100%',
                marginTop: 10,
                justifyContent: 'center',
                position: 'fixed', // Làm cho Row cố định
                top: 100, // Đặt nó ở trên cùng của trang
                left: 250, // Trải rộng hết chiều ngang
                zIndex: 1000, // Đặt zIndex cao để nó luôn nằm trên các thành phần khác
                maxWidth: '100%',
                border: '1px solid',
                borderColor: config.app.styles.backgroundColor2,
                borderRadius: '8px',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                marginLeft: 50,
                marginRight: 10,
            }} className='fade-in fade-in-4'>

                {/* Chart */}
                <Col lg={8}>
                    <Row className="fade-in fade-in-4" style={{
                        position: 'relative',
                        zIndex: 10,
                        borderRadius: '8px',
                        backgroundColor: config.app.styles.backgroundColor,
                        cursor: 'pointer'
                    }}>
                        <ChartComponent data={props} />
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
                            maxWidth: '92%',
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
                    {/* Summary */}
                    <Row>
                        <SummaryCardsComponent />
                    </Row>
                </Col>
            </Row>
            {/* Controller */}
            <Row
                className="fade-in fade-in-4"
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 9999,
                    maxHeight: 600,
                    backgroundColor: config.app.styles.backgroundColor, // Đảm bảo màu nền rõ ràng
                    padding: '20px 20px', // Khoảng cách bên trong để tránh chạm vào các cạnh,
                    marginLeft: 300,
                    marginRight: 10,
                    border: '1px solid',
                    borderColor: config.app.styles.backgroundColor2,
                    borderRadius: '8px',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
                }}>
                <Col lg={8}>
                    <ChartComponentSensor2 />
                </Col>
                <Col>
                    <Row>
                        <Col lg={12}>
                            <ControlDeviceComponent />
                        </Col>
                        <Col lg={12} style={{
                            paddingTop: 20,
                        }}>
                            <WarningSensorComponent />
                        </Col>
                    </Row>
                </Col>

            </Row>

        </>
    )
}