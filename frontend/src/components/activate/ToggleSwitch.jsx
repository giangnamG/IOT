import React from 'react';
import { ToggleButton, ButtonGroup } from 'react-bootstrap';

export default function ToggleSwitch({ isOn, handleToggle, isDisable }) {
    return (
        <ButtonGroup className="d-flex">
            <ToggleButton
                type="radio"
                variant="primary"
                style={{
                    backgroundColor: isOn ? '#4CAF50' : '#555555', // Màu xanh lá cây nhẹ cho ON và xám cho OFF
                    borderColor: '#333333',
                    color: isOn ? '#FFFFFF' : '#BBBBBB' // Màu chữ trắng cho ON và xám nhạt cho OFF
                }}
                checked={isOn}
                value="1"
                onClick={isOn ? null : handleToggle}
                disabled={isDisable}
                className="flex-fill"
            >
                ON
            </ToggleButton>
            <ToggleButton
                type="radio"
                variant="secondary"
                style={{
                    backgroundColor: !isOn ? '#B22222' : '#555555', // Màu đỏ sẫm cho OFF và xám cho ON
                    borderColor: '#333333',
                    color: !isOn ? '#FFFFFF' : '#BBBBBB' // Màu chữ trắng cho OFF và xám nhạt cho ON
                }}
                checked={!isOn}
                value="2"
                onClick={!isOn ? null : handleToggle}
                disabled={isDisable}
                className="flex-fill"
            >
                OFF
            </ToggleButton>
        </ButtonGroup>
    );
};
