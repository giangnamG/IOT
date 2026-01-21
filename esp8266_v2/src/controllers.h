#include "globals.h"
#include "circuit/esp8266.h"
#include "circuit/dht22.h"
#include "circuit/lightsensor.h"
#include "devices/devicesController.h"
#include "circuit/sensorFader.h"
#include "devices/warning.h"

//  ---------------------------------------------DEFINE DATA TYPE--------------------------------------------------- ||

struct DataStreaming
{
    String topic;
    float temp;
    float humidity;
    int light;
    int dust;
    int rain;
    int windSpeed;
    String time;
    String dump;
};

//  -----------------------------------------------------DEFINE COMMAND Controller-------------------------------------------------- ||
class Controller
{

private:
    DataStreaming dataStreaming;

    /*
     * Khởi tạo cảm biến ánh sáng nối với chân GPIO12 (D6)
     */
    LightSensor lightSensor = LightSensor(A0);
    SensorFader sensorFader = SensorFader();
    Warning warning = Warning();

public:
    Esp8266 esp;
    DevicesController devicesController;

    /*
     * Khởi tạo lớp Controller và khởi tạo đối tượng ESP
     */
    Controller() : esp(), devicesController()
    {
        // connect wifi
        esp.connect_wifi();

        // connect broker MQTT
        esp.set_connection_broker();

        // Khởi động cảm biến DHT22
        dht22.begin();
    }

    void set_init_state_pin_mode()
    {
        /*
         * Đặt chế độ cho các chân D1, D2, D3, D5, D6 làm OUTPUT để điều khiển đèn LED
         */
        lightSensor.setPinMode();
        pinMode(D1, OUTPUT);
        pinMode(D2, OUTPUT);
        pinMode(D3, OUTPUT);
        pinMode(D4, OUTPUT);
        pinMode(D7, OUTPUT);

        digitalWrite(D1, LOW); // Đèn ban đầu tắt
        digitalWrite(D2, LOW); // Đèn ban đầu tắt
        digitalWrite(D3, LOW); // Đèn ban đầu tắt
        digitalWrite(D4, LOW); // Đèn ban đầu tắt
        digitalWrite(D7, LOW); // Đèn ban đầu tắt
    }

    //  ------------------------------------------------- Start Streaming Func --------------------------------------------------- ||
    void Streaming()
    {
        DataStreaming streaming;

        streaming.topic = "streaming/all";

        /*
         * Đọc giá trị nhiệt độ và độ ẩm
         */
        float humidity = dht22.readHumidity();
        float temperature = dht22.readTemperature();
        float light = lightSensor.readLight();
        /*
         * Kiểm tra vượt ngưỡng
         */

        Serial.print("Light sensor value: ");
        Serial.println(light);
        // Kiểm tra xem có đọc được giá trị hợp lệ không
        if (isnan(humidity) || isnan(temperature) || isnan(light))
        {
            Serial.println("Không đọc được dữ liệu từ cảm biến DHT22!");
            return;
        }

        streaming.temp = temperature;
        streaming.humidity = humidity;
        streaming.light = 1024 - light;
        streaming.dust = sensorFader.readDust();
        streaming.rain = sensorFader.readRain();
        streaming.windSpeed = sensorFader.readWindSpeed();

        if (streaming.dust > 70)
        {
            for (int i = 0; i < 3; i++)
            {
                warning.turnOn();
                delay(200);
                warning.turnOff();
                delay(200);
            }
        }
        else
        {
            warning.turnOff();
        }

        streaming.dump = "{\"temp\":" + String(streaming.temp) + "," +
                         "\"humidity\":" + String(streaming.humidity) + "," +
                         "\"light\":" + String(streaming.light) + "," +
                         "\"dust\":" + String(streaming.dust) + "," +
                         "\"rain\":" + String(streaming.rain) + "," +
                         "\"windSpeed\":" + String(streaming.windSpeed) + "}";

        esp.publish(streaming.topic, streaming.dump);
    }
    //  ----------------------------------------------------------END Streaming Func--------------------------------------------------------- ||
};
