#include "globals.h"

#pragma once

class Device
{
protected:
    boolean deviceIsActive = false;
    uint8_t PinMode;

public:
    unsigned int process()
    {
        unsigned int isActive = -1;

        // nếu device đang tắt và subscribe cmd là ON thì cho bật device
        if (deviceIsActive == false && strcmp(receivedPayload_global, cmd[0]) == 0)
        {
            isActive = 1;
            turnOn();
        }
        // nếu device đang bật và subscribe cmd là OFF thì cho tắt device
        else if (deviceIsActive == true && strcmp(receivedPayload_global, cmd[1]) == 0)
        {
            isActive = 0;
            turnOff();
        }
        // Nếu device đang tắt và subscribe cmd là OFF thì thông báo lại
        else if (deviceIsActive == false && strcmp(receivedPayload_global, cmd[1]) == 0)
        {
            // không cho tương tác với device
            isActive = 2;
            isAlreadyOff();
        }
        // nếu device đang bật và subscribe cmd là ON thì thông báo lại
        else if (deviceIsActive == true && strcmp(receivedPayload_global, cmd[0]) == 0)
        {
            // không cho tương tác với device
            isActive = 3;
            isAlreadyOn();
        }

        return isActive;
    }
    //  ----------------------------------------------------------END--------------------------------------------------------- ||
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