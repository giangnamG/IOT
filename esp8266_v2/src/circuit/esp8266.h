#include "../globals.h"
#include "../objects/wifi.h"

// Định nghĩa các biến toàn cục đã khai báo trong globals.h
char receivedTopic_global[100];
char receivedPayload_global[256];

char cmd[2][5];
char topic_subscribes[10][256];
char topic_publish[10][256];

class Esp8266
{
private:
    // Thông tin MQTT Broker

    // Địa chỉ IP của MQTT broker
    const char *mqtt_server = "192.168.1.32";
    const int mqtt_port = 1883;

    // Tài khoản MQTT
    const char *mqtt_user = "ngn";
    const char *mqtt_pass = "ngn";

    Wifi wifi = Wifi();
    WiFiClient wifiClient;

public:
    PubSubClient psClient;

    // Khởi tạo PubSubClient với WiFiClient bằng initializer list
    Esp8266() : psClient(wifiClient)
    {
        // Gán giá trị cho các biến toàn cục đã được định nghĩa bằng 'extern'
        strcpy(cmd[0], "ON");
        strcpy(cmd[1], "OFF");

        strcpy(topic_subscribes[0], "fan/pub");
        strcpy(topic_subscribes[1], "airConditioner/pub");
        strcpy(topic_subscribes[2], "lightBulb/pub");

        strcpy(topic_publish[0], "fan/sub");
        strcpy(topic_publish[1], "airConditioner/sub");
        strcpy(topic_publish[2], "lightBulb/sub");
    }

    void connect_wifi()
    {
        wifi.connect_wifi();
    }

    // Hàm callback khi có thông điệp mới từ một topic MQTT
    void callback(char *topic, byte *payload, unsigned int length)
    {

        //  Lưu trữ topic vào biến global
        strncpy(receivedTopic_global, topic, sizeof(receivedTopic_global) - 1);
        receivedTopic_global[sizeof(receivedTopic_global) - 1] = '\0';

        Serial.print("------------------------------");
        Serial.print("Callback receive a topic: ");
        Serial.println(topic);

        Serial.print("Message: ");
        for (unsigned int i = 0; i < length; i++)
        {
            Serial.print((char)payload[i]);
            //  Lưu trữ message vào global
            receivedPayload_global[i] = (char)payload[i];
        }
        receivedPayload_global[length] = '\0';
        Serial.println();
        Serial.println("-----------------------");
    }

    void reconnect()
    {
        // Loop until we're reconnected
        while (!psClient.connected())
        {
            Serial.print("Attempting MQTT connection...");
            // Tạo một clientId ngẫu nhiên
            String clientId = "ESP8266Client-";
            clientId += String(random(0xffff), HEX);
            // Thử kết nối
            if (psClient.connect(clientId.c_str(), mqtt_user, mqtt_pass))
            {
                Serial.println("connected");
                // Khi kết nối thành công, gửi một thông báo
                psClient.publish("test_topic", "hello world");
                // Và đăng ký lại để nhận thông báo từ topic
                psClient.subscribe("test_topic");
            }
            else
            {
                Serial.print("failed, rc=");
                Serial.print(psClient.state());
                Serial.println(" try again in 5 seconds");
                // Hiển thị chi tiết lỗi
                switch (psClient.state())
                {
                case -4:
                    Serial.println("Connection timeout");
                    break;
                case -3:
                    Serial.println("Connection lost");
                    break;
                case -2:
                    Serial.println("Connect failed");
                    break;
                case -1:
                    Serial.println("Disconnected");
                    break;
                case 1:
                    Serial.println("Bad protocol version");
                    break;
                case 2:
                    Serial.println("Bad client ID");
                    break;
                case 3:
                    Serial.println("Unavailable");
                    break;
                case 4:
                    Serial.println("Bad credentials");
                    break;
                case 5:
                    Serial.println("Unauthorized");
                    break;
                default:
                    Serial.println("Unknown error");
                }
                // Đợi 5 giây trước khi thử lại
                delay(5000);
            }
        }
    }

    void publish(String topic, String message)
    {
        // Publish một thông điệp đến topic
        Serial.print("Publishing topic: " + topic + " -> message: ");
        Serial.println(message);
        psClient.publish(topic.c_str(), message.c_str());
    }

    void set_connection_broker()
    {
        // Kết nối đến MQTT broker
        psClient.setServer(mqtt_server, mqtt_port);
        psClient.setCallback(
            [this](char *topic, byte *payload, unsigned int length)
            {
                this->callback(topic, payload, length);
            });
        /*
         * Thay vì gọi hàm ngay lập tức, cần truyền một con trỏ hàm (function pointer) để khi có tin nhắn đến,
         * hàm callback sẽ được gọi.
         */
    }
};
