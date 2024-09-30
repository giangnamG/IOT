#include "../globals.h"

class LightSensor
{
private:
    int digitalPin;   // Chân GPIO cho tín hiệu digital
    int analogPin;    // Chân cho tín hiệu analog
    int analogValue;  // Giá trị đọc từ chân analog
    int digitalValue; // Giá trị đọc từ chân digital
public:
    // Constructor để khởi tạo cảm biến
    LightSensor(int digitalPin, int analogPin)
    {
        this->digitalPin = digitalPin;
        this->analogPin = analogPin;
        analogValue = 0;
        digitalValue = 0;
    }

    // Cấu hình chân đầu vào cho cảm biến
    void begin()
    {
        Serial.begin(115200);
        pinMode(digitalPin, INPUT); // Cấu hình chân digital
    }

    // Đọc giá trị từ chân analog
    void readAnalog()
    {
        analogValue = analogRead(analogPin);
    }

    // Đọc giá trị từ chân digital
    void readDigital()
    {
        digitalValue = digitalRead(digitalPin);
    }

    // In ra giá trị của cảm biến
    void printValues()
    {
        Serial.print("Analog value: ");
        Serial.println(analogValue);
        Serial.print("Digital value: ");
        Serial.println(digitalValue);
    }

    // Delay giữa các lần đọc
    void delayReading(int delayTime)
    {
        delay(delayTime);
    }
};