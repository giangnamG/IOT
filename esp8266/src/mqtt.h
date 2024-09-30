#include "globals.h"

// Định nghĩa các biến toàn cục đã khai báo trong globals.h
char receivedTopic_global[100];
char receivedPayload_global[256];

// Thông tin MQTT Broker

// Địa chỉ IP của MQTT broker
const char *mqtt_server = "192.168.1.32";
const int mqtt_port = 1883;

// Tài khoản MQTT
const char *mqtt_user = "ngn";
const char *mqtt_pass = "ngn";

// Thông tin kết nối Wi-Fi
const char *ssid = "0x6e676e";         // Thay bằng tên mạng Wi-Fi của bạn
const char *password = "ngn@0x6e676e"; // Thay bằng mật khẩu Wi-Fi của bạn

WiFiClient espClient;
PubSubClient mqttClient(espClient);

// Hàm callback khi có thông điệp mới từ một topic MQTT
void callback(char *topic, byte *payload, unsigned int length)
{

    //  Lưu trữ topic vào biến global
    strncpy(receivedTopic_global, topic, sizeof(receivedTopic_global) - 1);
    receivedTopic_global[sizeof(receivedTopic_global) - 1] = '\0';

    Serial.print("Message arrived in topic: ");
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
    while (!mqttClient.connected())
    {
        Serial.print("Attempting MQTT connection...");
        // Tạo một clientId ngẫu nhiên
        String clientId = "ESP8266Client-";
        clientId += String(random(0xffff), HEX);
        // Thử kết nối
        if (mqttClient.connect(clientId.c_str(), mqtt_user, mqtt_pass))
        {
            Serial.println("connected");
            // Khi kết nối thành công, gửi một thông báo
            mqttClient.publish("test_topic", "hello world");
            // Và đăng ký lại để nhận thông báo từ topic
            mqttClient.subscribe("test_topic");
        }
        else
        {
            Serial.print("failed, rc=");
            Serial.print(mqttClient.state());
            Serial.println(" try again in 5 seconds");
            // Hiển thị chi tiết lỗi
            switch (mqttClient.state())
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

void connect_wifi()
{
    // Kết nối tới Wi-Fi
    Serial.println();
    Serial.print("Connecting to ");
    Serial.println(ssid);

    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }

    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
}

void _publish(String topic, String message)
{
    // Publish một thông điệp đến topic
    Serial.print("Publishing topic: " + topic + " -> message: ");
    Serial.println(message);
    mqttClient.publish(topic.c_str(), message.c_str());
}