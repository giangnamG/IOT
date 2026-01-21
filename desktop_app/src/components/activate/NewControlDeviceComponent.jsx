import React, { useEffect, useState } from 'react';
import config from '../../config';
import { useSelector } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import ToggleSwitch from '../activate/ToggleSwitch';
import axios from 'axios';
import ToastComponent from "../activate/ToastComponent";
import airConditionerImage from '../../assets/icons/air-off.png'; // Đường dẫn tới ảnh điều hòa không có cánh quạt
import fanBladeImage from '../../assets/icons/fan.png';
import '../../assets/css/lightBulb.css';


const controlBoxStyle = {
    backgroundColor: config.app.styles.summaryColor, // Màu nền được lấy từ config
    borderRadius: '8px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    cursor: 'pointer',
    maxWidth: '900px', // Điều chỉnh chiều rộng
    margin: '0 auto',
    padding: '20px',
    display: 'flex', // Sử dụng flex để bố trí tiêu đề và bảng điều khiển
    alignItems: 'flex-start', // Căn chỉnh các phần tử theo chiều dọc
};

const titleStyle = {
    writingMode: 'vertical-rl', // Hiển thị chữ theo chiều dọc
    transform: 'rotate(180deg)', // Đảo ngược chiều chữ
    textAlign: 'center',
    marginRight: '10px', // Tạo khoảng cách giữa tiêu đề và bảng điều khiển
    fontSize: '24px',
    fontWeight: 'bold',
    padding: '10px',
    borderRadius: '8px',
}


export default function ControlDeviceComponent() {

    const [deviceStatus, setDeviceStatus] = useState({
        fanIsOn: false,
        airConditionerIsOn: false,
        ledIsOn: false,
        deviceOtherIsOn: false,
        allDeviceIsOn: false,
    });

    const [toggles, setToggles] = useState(deviceStatus);

    const [turningLightBulb, setTurningLightBulb] = useState(false);

    useEffect(() => {
        // Đồng bộ hóa toggles với deviceStatus khi deviceStatus thay đổi
        setToggles(deviceStatus);
    }, [deviceStatus]);

    /** Sau khi request control device tới server, response trả về sẽ 
    *   là 1 sự kiện socket có tên là: device event, 
    *   sự kiện này được định nghĩa trong webSocketComponent, và lấy giá trị lấy từ stream 
    *   bằng cách sử dụng redux
    **/

    const { dataResponseCommand } = useSelector((state) => state.responseCommand);
    const { dataDeviceStatus } = useSelector((state) => state.deviceStatus);

    /**
     * Sử dụng websocket để nhận dữ liệu
     * 
     */
    useEffect(() => {
        axios.get(config.backend.baseUrl + '/device/status')
        axios.get(config.backend.baseUrl + '/device/status')

    }, []);

    useEffect(() => {
        const status = dataDeviceStatus.status
        if (status !== undefined) {
            console.log(status);
            setDeviceStatus({
                fanIsOn: status.fan,
                airConditionerIsOn: status.airConditional,
                deviceOtherIsOn: status.deviceOther,
                ledIsOn: status.led,
                allDeviceIsOn: status.allDevice
            });
        }

    }, [dataDeviceStatus])

    useEffect(() => {
        if (!dataResponseCommand || Object.keys(dataResponseCommand).length === 0) return;

        console.log('dataResponseCommand: ', dataResponseCommand)

        if (!dataResponseCommand.status.includes('wrong')) {

            let toggleName = ''
            switch (dataResponseCommand.device_name) {
                case 'led':
                    toggleName = 'ledIsOn';
                    break;

                default:
                    break;
            }
            if (toggleName === 'allDeviceIsOn') {
                setToggles((prevToggles) => ({
                    fanIsOn: !prevToggles[toggleName],
                    airConditionerIsOn: !prevToggles[toggleName],
                    ledIsOn: !prevToggles[toggleName],
                    deviceOtherIsOn: !prevToggles[toggleName],
                    allDeviceIsOn: !prevToggles[toggleName],
                }));
            }
            else {
                if (dataResponseCommand.cmd === 'OFF') {
                    setToggles((prevToggles) => ({
                        ...prevToggles,
                        [toggleName]: !prevToggles[toggleName],
                        allDeviceIsOn: false,
                    }));
                } else {
                    setToggles((prevToggles) => ({
                        ...prevToggles,
                        [toggleName]: !prevToggles[toggleName],
                    }));
                }
            }
            console.log(toggleName);
            toggleToast(true, 'Thông báo', dataResponseCommand.status, dataResponseCommand.timestamp, 'success')
        } else {
            toggleToast(true, 'Thông báo', dataResponseCommand.status, dataResponseCommand.timestamp, 'warning')
        }

        if (dataResponseCommand.device_name === devices.led)
            setTurningLightBulb(false);


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataResponseCommand])

    useEffect(() => {
        if (toggles['fanIsOn'] === true && toggles['airConditionerIsOn'] === true && toggles['ledIsOn'] === true) {
            setToggles((prevToggles) => ({
                ...prevToggles,
                allDeviceIsOn: true,
            }));
        } else if (toggles['fanIsOn'] === false && toggles['airConditionerIsOn'] === false && toggles['ledIsOn'] === false) {
            setToggles((prevToggles) => ({
                ...prevToggles,
                allDeviceIsOn: false,
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [toggles.airConditionerIsOn, toggles.ledIsOn, toggles.fanIsOn])

    const devices = {
        'fan': 'fan',
        'airConditioner': 'airConditioner',
        'lightBulb': 'lightBulb',
        'allDevice': 'allDevice',
        'led': 'led',
    };

    const [showToast, setShowToast] = useState({
        isShow: false,
        title: '',
        message: '',
        time: '',
        type: '', // 'success', 'danger', 'warning', 'info'
    });

    const toggleToast = (isShow = false, title = '', message = '', time = '', type = 'success') => {
        setShowToast({
            isShow: isShow,
            title: title,
            message: message,
            time: time,
            type: type,
        });

        if (isShow) {
            // Tự động tắt Toast sau 2 giây
            setTimeout(() => {
                setShowToast((prevState) => ({
                    ...prevState,
                    isShow: false,
                }));
            }, 2000);
        }
    };

    const handleToggle = (toggleName, topic) => {
        try {
            if (topic === devices.led)
                setTurningLightBulb(true);
            const data = {
                topic: topic,
                cmd: !toggles[toggleName] ? 'turnOn' : 'turnOff'
            };

            console.log('req: ', data);

            axios.post(config.backend.baseUrl + '/device/led', data)
            // response do socket trả về sau
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div style={controlBoxStyle}>

            {/* Tiêu đề "Bảng Điều Khiển" theo chiều dọc */}
            <h4 style={titleStyle}>
                Bảng Điều Khiển
            </h4>

            {/* Phần bảng điều khiển */}
            <div style={{ flex: 1 }}>
                <ToastComponent showToast={showToast} toggleToast={toggleToast} />


                {/* LightBulb Control */}
                <Row style={{ paddingTop: 15 }}>
                    <Col md={5} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <label style={{
                            fontFamily: 'Arial, sans-serif',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: '#CCCCCC',
                            padding: '5px 10px',
                            backgroundColor: '#2C2C2C',
                            borderRadius: '8px',
                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
                            display: 'inline-block',
                        }}>
                            Đèn
                        </label>
                    </Col>
                    <Col md={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ToggleSwitch isOn={toggles.ledIsOn} handleToggle={() => handleToggle('ledIsOn', devices.led)} isDisable={turningLightBulb} />
                    </Col>
                    <Col md={3} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg xmlns="http://www.w3.org/2000/svg"
                            fill={toggles.ledIsOn ? "#FFD700" : "currentColor"}
                            style={{
                                filter: toggles.ledIsOn ? "drop-shadow(0 0 15px #FFA500)" : ""
                            }}
                            width="32" height="32"
                            className={`bi bi-lightbulb-fill lightbulb ${turningLightBulb ? 'lightbulb-on' : ''}`}
                            viewBox="0 0 16 16">
                            <defs>
                                <linearGradient id="grad" x1="0%" y1="100%" x2="0%" y2="80%" x3="0%" y3="60%" x4="0%" y4="40%" x5="0%" y5="20%" x6="0%" y6="0%">
                                    <stop offset="0%" style={{ stopColor: "yellow", stopOpacity: 1 }} />
                                    <stop offset="100%" style={{ stopColor: "transparent", stopOpacity: 1 }} />
                                </linearGradient>
                            </defs>
                            <path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13h-5a.5.5 0 0 1-.46-.302l-.761-1.77a2 2 0 0 0-.453-.618A5.98 5.98 0 0 1 2 6m3 8.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1-.5-.5" />
                        </svg>
                    </Col>
                </Row>
            </div>
        </div>

    );
}
