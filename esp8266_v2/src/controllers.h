#include "globals.h"
#include "circuit/esp8266.h"
#include "circuit/dht22.h"
#include "circuit/lightsensor.h"
#include "devices/devicesController.h"

//  ---------------------------------------------DEFINE DATA TYPE--------------------------------------------------- ||

struct DataStreaming
{
    String topic;
    float temp;
    float humidity;
    int light;
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

public:
    Esp8266 esp;
    DevicesController devices;

    /*
     * Khởi tạo lớp Controller và khởi tạo đối tượng ESP
     */
    Controller() : esp(), devices()
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

        digitalWrite(D1, LOW); // Đèn ban đầu tắt
        digitalWrite(D2, LOW); // Đèn ban đầu tắt
        digitalWrite(D3, LOW); // Đèn ban đầu tắt
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
        streaming.dump = "{\"temp\":" + String(streaming.temp) + "," +
                         "\"humidity\":" + String(streaming.humidity) + "," +
                         "\"light\":" + String(streaming.light) + "}";

        char buffer[150];

        sprintf(buffer, "Pushing topic %s -> data: %s", streaming.topic.c_str(), streaming.dump.c_str());

        Serial.println(buffer);

        esp.publish(streaming.topic, streaming.dump);
    }
    //  ----------------------------------------------------------END Streaming Func--------------------------------------------------------- ||
};
