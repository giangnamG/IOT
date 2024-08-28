import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';
import "../../assets/css/toast.css";
import config from '../../config';

function ToastComponent({ showToast, toggleToast }) {

    return (
        <>
            <ToastContainer
                className="p-3"
                position="middle-center"  // Đặt vị trí ở góc trên bên phải

            >
                <CSSTransition
                    in={showToast.isShow}
                    timeout={1000}
                    classNames="toast"
                    unmountOnExit
                >
                    <Toast onClose={() => toggleToast()} bg="success">
                        <Toast.Header closeButton={true} style={{
                            backgroundColor: config.app.styles.backgroundColor,
                            color: '#8FBC8F'
                        }}>
                            <img
                                src="holder.js/20x20?text=%20"
                                className="rounded me-2"
                                alt=""
                            />
                            <strong className="me-auto">{showToast.title}</strong>
                            <small>{showToast.time} - Just now!</small>
                        </Toast.Header>
                        <Toast.Body style={{
                            backgroundColor: config.app.styles.backgroundColor2,
                            height: 150
                        }}>
                            <h1>{showToast.message}</h1>
                        </Toast.Body>
                    </Toast>
                </CSSTransition>
            </ToastContainer>
        </>
    );
}

export default ToastComponent;
