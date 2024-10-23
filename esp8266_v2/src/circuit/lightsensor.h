#include "globals.h"

class LightSensor
{
private:
    /*
     * Chân GPIO để kết nối với cảm biến ánh sáng
     */
    uint8_t dataPin;

    /*
     * Giá trị đọc từ cảm biến
     */
    int lightValue;
    int threshold = 500;

public:
    /*
     * Constructor để khởi tạo cảm biến với chân GPIO
     */
    LightSensor(uint8_t pin)
    {
        dataPin = pin;
        lightValue = 0;
    }

    /*
     * Cấu hình chân digital đầu vào cho cảm biến
     */
    void setPinMode()
    {
        pinMode(dataPin, INPUT);
    }

    /*
     * Đọc giá trị digital từ cảm biến ánh sáng
     */
    float readLight()
    {
        lightValue = analogRead(dataPin);

        return lightValue;
    }

    /*
     * In ra giá trị của cảm biến ánh sáng
     */
    void printLightValue()
    {
        Serial.print("Light sensor value: ");
        Serial.println(lightValue);
    }
    boolean checkThreshold()
    {

        return (1024 - lightValue) > threshold;
    }
};
