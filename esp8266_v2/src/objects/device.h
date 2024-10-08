#include "globals.h"

#pragma once

class Device
{
protected:
    uint8_t PinMode;

public:
    boolean deviceIsActive = false;

    void turnOn()
    {
        digitalWrite(PinMode, HIGH);
        deviceIsActive = true;
    }
    void turnOff()
    {
        digitalWrite(PinMode, LOW);
        deviceIsActive = false;
    }
    void isAlreadyOn()
    {
    }
    void isAlreadyOff()
    {
    }
    boolean isActive()
    {
        return deviceIsActive;
    }
};
// #endif // Kết thúc include guard DEVICE_H