#include "globals.h"

class Wifi
{

private:
    // Thông tin kết nối Wi-Fi
    const char *ssid = "0x6e676e";         // Thay bằng tên mạng Wi-Fi của bạn
    const char *password = "ngn@0x6e676e"; // Thay bằng mật khẩu Wi-Fi của bạn

public:
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
};