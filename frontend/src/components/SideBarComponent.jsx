/* eslint-disable default-case */
import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import '../assets/css/transferColor.css'
import { sidebarStyles } from './activate/styleComponents'
import AlertModelComponent from './activate/AlertModelComponent';
import { setHook } from '../redux/HookPage';
import { useDispatch } from 'react-redux';

export default function SideBarComponent() {
    const dispatch = useDispatch();
    const [showAlert, setShowAlert] = useState(false)
    const [messageAlert, setMessageAlert] = useState('')

    const handleCloseShowAlert = () => {
        setShowAlert(false)
    }

    const [hovered, setHovered] = useState(null);

    const handleMouseEnter = (index) => {
        setHovered(index);
    };

    const handleMouseLeave = () => {
        setHovered(null);
    };

    const links = [
        { href: '/', label: 'Home Page' },
        { href: '/#Dashboard', label: 'Dashboard' },
        { href: '/#Devices', label: 'Action History' },
        { href: '/#DataStreamLogs', label: 'Data Sensor' },
        { href: '/#Profile', label: 'Profile' },
    ];

    const handleActionClick = (href) => {
        switch (href) {
            case '/#Dashboard':
                dispatch(setHook({
                    hookName: href,
                    props: {}
                }))
                console.log(href)
                break;
            case '/#Devices':
                dispatch(setHook({
                    hookName: href,
                    props: {}
                }))
                console.log(href)
                break;
            case '/#DataStreamLogs':
                dispatch(setHook({
                    hookName: href,
                    props: {}
                }))
                console.log(href)
                break;
            case '/#Profile':
                try {
                    dispatch(setHook({
                        hookName: href,
                        props: {
                            userId: 1,
                            username: "Nguyễn Giang Nam",
                            email: "kow.giangnam@gmail.com",
                            role: "admin"
                        }
                    }))
                } catch (error) {
                    setMessageAlert('Thông tin đăng nhập lưu trên máy không tồn tại hoặc đã bị thay đổi, vui lòng đăng nhập lại')
                    setShowAlert(true)
                }
                console.log(href)
                break;
        }
        localStorage.setItem('fragment', href)
    }

    return (
        <div style={sidebarStyles.sidebar}>
            <Nav defaultActiveKey="/home" className="flex-column">
                {links.map((link, index) => (
                    <React.Fragment key={index}>
                        {
                            index === 1 || index === 4 ? (<hr style={{ marginTop: 2 }}></hr>) : ''
                        }
                        <Nav.Link
                            key={index + 1}
                            href={link.href}
                            style={{
                                ...sidebarStyles.sidebarLink,
                                ...(hovered === index && sidebarStyles.hoverSidebarLink)
                            }}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => handleActionClick(link.href)}
                            disabled={index === 0}
                        >
                            {link.label}
                        </Nav.Link>
                    </React.Fragment>
                ))}
            </Nav>

            <AlertModelComponent showAlert={showAlert} handleCloseShowAlert={handleCloseShowAlert} messageAlert={messageAlert} />

        </div>
    )
}