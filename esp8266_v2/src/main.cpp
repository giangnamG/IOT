#include "globals.h"
#include "controllers.h"

unsigned long previousMillis = 0;
const long interval = 2000; // 2000 giây

// Khai báo con trỏ controller
Controller *controller;

void setup()
{
  Serial.begin(115200);
  Serial.println("Setup started");
  delay(1000);

  /*
   * Tạo đối tượng controller
   * Kết nối wifi
   * set connect tới broker
   * khởi động dht22
   */
  controller = new Controller();

  /*
   * Đặt chế độ cho các chân D1, D2, D3 làm OUTPUT để điều khiển đèn LED
   */
  controller->set_init_state_pin_mode();
}

void loop()
{
  if (!controller->esp.psClient.connected())
  {
    controller->esp.reconnect();
    controller->esp.psClient.subscribe("fan/pub");
    controller->esp.psClient.subscribe("airConditioner/pub");
    controller->esp.psClient.subscribe("lightBulb/pub");
    controller->esp.psClient.subscribe("allDevice/pub");
  }
  /*
   * Gọi psClient.loop() để xử lý gói tin MQTT
   */
  controller->esp.psClient.loop();

  /*
   * Xử lý dữ liệu và nhận dữ liệu từ các topic subscribed
   */
  controller->devices.listen(controller->esp.psClient);

  /*
   * Xử lý dữ liệu và publish định kỳ
   */
  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= interval)
  {
    previousMillis = currentMillis;

    controller->Streaming();
  }
}
