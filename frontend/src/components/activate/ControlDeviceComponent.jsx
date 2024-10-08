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

export default function ControlDeviceComponent() {

    const [deviceStatus, setDeviceStatus] = useState({
        fanIsOn: false,
        airConditionerIsOn: false,
        lightBulbIsOn: false,
        allDeviceIsOn: false,
    });

    const [toggles, setToggles] = useState(deviceStatus);

    const [turningFan, setTurningFan] = useState(false);
    const [turningAirConditioner, setTurningAirConditioner] = useState(false);
    const [turningLightBulb, setTurningLightBulb] = useState(false);
    const [turningAllDevices, setTurningAllDevices] = useState(false);

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

    useEffect(() => {
        if (!dataResponseCommand || Object.keys(dataResponseCommand).length === 0) return;

        console.log('dataResponseCommand: ', dataResponseCommand)

        if (!dataResponseCommand.status.includes('wrong')) {

            let toggleName = ''
            switch (dataResponseCommand.device_name) {
                case 'fan':
                    toggleName = 'fanIsOn';
                    break;
                case 'airConditioner':
                    toggleName = 'airConditionerIsOn';
                    break;
                case 'lightBulb':
                    toggleName = 'lightBulbIsOn';
                    break;
                case 'allDevice':
                    toggleName = 'allDeviceIsOn';
                    break;
                default:
                    break;
            }
            if (toggleName === 'allDeviceIsOn') {
                setToggles((prevToggles) => ({
                    fanIsOn: !prevToggles[toggleName],
                    airConditionerIsOn: !prevToggles[toggleName],
                    lightBulbIsOn: !prevToggles[toggleName],
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

        if (dataResponseCommand.device_name === devices.lightBulb)
            setTurningLightBulb(false);
        else if (dataResponseCommand.device_name === devices.fan)
            setTurningFan(false)
        else if (dataResponseCommand.device_name === devices.airConditioner)
            setTurningAirConditioner(false);
        else if (dataResponseCommand.device_name === devices.allDevice) {
            setTurningAllDevices(false);

        }

    }, [dataResponseCommand])

    useEffect(() => {
        if (toggles['fanIsOn'] === true && toggles['airConditionerIsOn'] === true && toggles['lightBulbIsOn'] === true) {
            setToggles((prevToggles) => ({
                ...prevToggles,
                allDeviceIsOn: true,
            }));
        } else if (toggles['fanIsOn'] === false && toggles['airConditionerIsOn'] === false && toggles['lightBulbIsOn'] === false) {
            setToggles((prevToggles) => ({
                ...prevToggles,
                allDeviceIsOn: false,
            }));
        }

    }, [toggles])
    useEffect(() => {
        axios.get(config.backend.baseUrl + '/device/status')
            .then(response => {
                const data = response.data;
                console.log('device status: ', data);
                setDeviceStatus({
                    fanIsOn: data[0]?.isOn || false,
                    airConditionerIsOn: data[1]?.isOn || false,
                    lightBulbIsOn: data[2]?.isOn || false,
                    allDeviceIsOn: data[3]?.isOn || false
                });
            }).catch((e) => {
                console.error("/device/status : ", e.message);
            });
    }, []);



    const devices = {
        'fan': 'fan',
        'airConditioner': 'airConditioner',
        'lightBulb': 'lightBulb',
        'allDevice': 'allDevice'
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
            if (topic === devices.lightBulb)
                setTurningLightBulb(true);
            else if (topic === devices.fan)
                setTurningFan(true);
            else if (topic === devices.airConditioner)
                setTurningAirConditioner(true);
            else if (topic === devices.allDevice)
                setTurningAllDevices(true);
            const data = {
                topic: topic,
                cmd: !toggles[toggleName] ? 'turnOn' : 'turnOff'
            };

            console.log('req: ', data);

            axios.post(config.backend.baseUrl + '/device/publish_cmd', data)
            // response do socket trả về sau
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Col style={{
            backgroundColor: config.app.styles.summaryColor, // Màu nền được lấy từ config
            borderRadius: '8px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            paddingTop: 50,
            cursor: 'pointer',
            marginTop: 260,
            height: 450,
            width: 500
        }}>
            <ToastComponent showToast={showToast} toggleToast={toggleToast} />
            <h3 className="fade-in fade-in-1">Bảng Điều Khiển</h3>

            {/* FAN Control */}
            <Row style={{ paddingTop: 20 }} className="fade-in fade-in-2">
                <Col md={5} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                    <h3>Quạt</h3>
                </Col>
                <Col md={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ToggleSwitch isOn={toggles.fanIsOn} handleToggle={() => handleToggle('fanIsOn', devices.fan)} isDisable={turningFan} />
                </Col>
                <Col md={3} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg className={`${turningFan ? 'fan-spinning' : ''} bi bi-fan`}
                        style={{
                            width: 32,
                            height: 32,
                            animation: turningFan ? 'spin 1s linear infinite' : toggles.fanIsOn ? 'spin 0.3s linear infinite' : 'none'
                        }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M10 3c0 1.313-.304 2.508-.8 3.4a2 2 0 0 0-1.484-.38c-.28-.982-.91-2.04-1.838-2.969a8 8 0 0 0-.491-.454A6 6 0 0 1 8 2c.691 0 1.355.117 1.973.332Q10 2.661 10 3m0 5q0 .11-.012.217c1.018-.019 2.2-.353 3.331-1.006a8 8 0 0 0 .57-.361 6 6 0 0 0-2.53-3.823 9 9 0 0 1-.145.64c-.34 1.269-.944 2.346-1.656 3.079.277.343.442.78.442 1.254m-.137.728a2 2 0 0 1-1.07 1.109c.525.87 1.405 1.725 2.535 2.377q.3.174.605.317a6 6 0 0 0 2.053-4.111q-.311.11-.641.199c-1.264.339-2.493.356-3.482.11ZM8 10c-.45 0-.866-.149-1.2-.4-.494.89-.796 2.082-.796 3.391q0 .346.027.678A6 6 0 0 0 8 14c.94 0 1.83-.216 2.623-.602a8 8 0 0 1-.497-.458c-.925-.926-1.555-1.981-1.836-2.96Q8.149 10 8 10M6 8q0-.12.014-.239c-1.02.017-2.205.351-3.34 1.007a8 8 0 0 0-.568.359 6 6 0 0 0 2.525 3.839 8 8 0 0 1 .148-.653c.34-1.267.94-2.342 1.65-3.075A2 2 0 0 1 6 8m-3.347-.632c1.267-.34 2.498-.355 3.488-.107.196-.494.583-.89 1.07-1.1-.524-.874-1.406-1.733-2.541-2.388a8 8 0 0 0-.594-.312 6 6 0 0 0-2.06 4.106q.309-.11.637-.199M8 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                    </svg>
                </Col>
            </Row>

            {/* airConditionerIsOn Control */}
            <Row style={{ paddingTop: 30 }}>
                <Col md={5} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>

                    <h3>Điều Hòa</h3>
                </Col>
                <Col md={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ToggleSwitch isOn={toggles.airConditionerIsOn} handleToggle={() => handleToggle('airConditionerIsOn', devices.airConditioner)} isDisable={turningAirConditioner} />
                </Col>
                <Col md={3} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <div
                            style={{
                                width: 32,
                                height: 32,
                                backgroundColor: '#adb5bd',
                                WebkitMaskImage: `url(${airConditionerImage})`,
                                maskImage: `url(${airConditionerImage})`,
                                WebkitMaskRepeat: 'no-repeat',
                                maskRepeat: 'no-repeat',
                                WebkitMaskSize: 'contain',
                                maskSize: 'contain',
                                WebkitMaskPosition: 'center',
                                maskPosition: 'center',
                                position: 'relative',
                            }}
                        />
                        <div
                            style={{
                                width: 24,
                                height: 24,
                                backgroundColor: config.app.styles.fontLink,
                                WebkitMaskImage: `url(${fanBladeImage})`,
                                maskImage: `url(${fanBladeImage})`,
                                WebkitMaskRepeat: 'no-repeat',
                                maskRepeat: 'no-repeat',
                                WebkitMaskSize: 'contain',
                                maskSize: 'contain',
                                WebkitMaskPosition: 'center',
                                maskPosition: 'center',
                                position: 'absolute',
                                top: '8.2%',
                                left: '-4.4%',
                                transform: 'translate(0%, 0%)',
                                animation: turningAirConditioner ? 'spin 1.5s linear infinite' : toggles.airConditionerIsOn ? 'spin 0.5s linear infinite' : 'none',
                                transformOrigin: 'center center',
                            }}
                        />
                    </div>
                </Col>
            </Row>

            {/* LightBulb Control */}
            <Row style={{ paddingTop: 30 }}>
                <Col md={5} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <h3>Đèn</h3>
                </Col>
                <Col md={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ToggleSwitch isOn={toggles.lightBulbIsOn} handleToggle={() => handleToggle('lightBulbIsOn', devices.lightBulb)} isDisable={turningLightBulb} />
                </Col>
                <Col md={3} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg xmlns="http://www.w3.org/2000/svg"
                        fill={toggles.lightBulbIsOn ? "#FFD700" : "currentColor"}
                        style={{
                            filter: toggles.lightBulbIsOn ? "drop-shadow(0 0 15px #FFA500)" : ""
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


            <Row style={{ paddingTop: 30 }}>
                <Col md={5} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <h3>ALL</h3>
                </Col>
                <Col md={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ToggleSwitch isOn={toggles.allDeviceIsOn} handleToggle={() => handleToggle('allDeviceIsOn', devices.allDevice)} isDisable={turningAllDevices} />
                </Col>
                <Col md={3} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Row className="d-flex justify-content-center align-items-center">
                        <Row className="d-flex justify-content-center align-items-center">
                            <Col> <svg className={`${turningAllDevices ? 'fan-spinning' : ''} bi bi-fan`}
                                style={{
                                    width: 32,
                                    height: 32,
                                    animation: turningAllDevices ? 'spin 1s linear infinite' : toggles.allDeviceIsOn ? 'spin 0.3s linear infinite' : 'none'
                                }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M10 3c0 1.313-.304 2.508-.8 3.4a2 2 0 0 0-1.484-.38c-.28-.982-.91-2.04-1.838-2.969a8 8 0 0 0-.491-.454A6 6 0 0 1 8 2c.691 0 1.355.117 1.973.332Q10 2.661 10 3m0 5q0 .11-.012.217c1.018-.019 2.2-.353 3.331-1.006a8 8 0 0 0 .57-.361 6 6 0 0 0-2.53-3.823 9 9 0 0 1-.145.64c-.34 1.269-.944 2.346-1.656 3.079.277.343.442.78.442 1.254m-.137.728a2 2 0 0 1-1.07 1.109c.525.87 1.405 1.725 2.535 2.377q.3.174.605.317a6 6 0 0 0 2.053-4.111q-.311.11-.641.199c-1.264.339-2.493.356-3.482.11ZM8 10c-.45 0-.866-.149-1.2-.4-.494.89-.796 2.082-.796 3.391q0 .346.027.678A6 6 0 0 0 8 14c.94 0 1.83-.216 2.623-.602a8 8 0 0 1-.497-.458c-.925-.926-1.555-1.981-1.836-2.96Q8.149 10 8 10M6 8q0-.12.014-.239c-1.02.017-2.205.351-3.34 1.007a8 8 0 0 0-.568.359 6 6 0 0 0 2.525 3.839 8 8 0 0 1 .148-.653c.34-1.267.94-2.342 1.65-3.075A2 2 0 0 1 6 8m-3.347-.632c1.267-.34 2.498-.355 3.488-.107.196-.494.583-.89 1.07-1.1-.524-.874-1.406-1.733-2.541-2.388a8 8 0 0 0-.594-.312 6 6 0 0 0-2.06 4.106q.309-.11.637-.199M8 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                            </svg></Col>
                        </Row>
                        <Row className="d-flex justify-content-center align-items-center">
                            <Col>
                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                    <div
                                        style={{
                                            width: 32,
                                            height: 32,
                                            backgroundColor: '#adb5bd',
                                            WebkitMaskImage: `url(${airConditionerImage})`,
                                            maskImage: `url(${airConditionerImage})`,
                                            WebkitMaskRepeat: 'no-repeat',
                                            maskRepeat: 'no-repeat',
                                            WebkitMaskSize: 'contain',
                                            maskSize: 'contain',
                                            WebkitMaskPosition: 'center',
                                            maskPosition: 'center',
                                            position: 'relative',
                                        }}
                                    />
                                    <div
                                        style={{
                                            width: 24,
                                            height: 24,
                                            backgroundColor: config.app.styles.fontLink,
                                            WebkitMaskImage: `url(${fanBladeImage})`,
                                            maskImage: `url(${fanBladeImage})`,
                                            WebkitMaskRepeat: 'no-repeat',
                                            maskRepeat: 'no-repeat',
                                            WebkitMaskSize: 'contain',
                                            maskSize: 'contain',
                                            WebkitMaskPosition: 'center',
                                            maskPosition: 'center',
                                            position: 'absolute',
                                            top: '8.2%',
                                            left: '-4.4%',
                                            transform: 'translate(0%, 0%)',
                                            animation: turningAllDevices ? 'spin 1.5s linear infinite' : toggles.allDeviceIsOn ? 'spin 0.5s linear infinite' : 'none',
                                            transformOrigin: 'center center',
                                        }}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    fill={toggles.allDeviceIsOn ? "#FFD700" : "currentColor"}
                                    style={{
                                        filter: toggles.allDeviceIsOn ? "drop-shadow(0 0 15px #FFA500)" : ""
                                    }}
                                    width="32" height="32"
                                    className={`bi bi-lightbulb-fill lightbulb ${turningAllDevices ? 'lightbulb-on' : ''}`}
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
                    </Row>
                </Col>
            </Row>
        </Col>
    );
}
