#include "globals.h"
#include <mqtt.h>

//  --------------------------------------------------------------------------------------------------------------- ||

unsigned long previousMillis = 0;
const long interval = 2000; // 2 giây

//  ---------------------------------------------DEFINE DATA TYPE--------------------------------------------------- ||

struct DataStreaming
{
  String topic;
  int temp;
  int humidity;
  int light;
  String time;
  String dump;
};

struct ResultProcessTopic
{
  String topic;
  int isActive;
};

//  -----------------------------------------------------DEFINE COMMAND-------------------------------------------------- ||

char cmd[2][5] = {"ON", "OFF"};
char topic_subscribes[10][256] = {"fan/pub", "airConditioner/pub", "lightBulb/pub"};
char topic_publish[10][256] = {"fan/sub", "airConditioner/sub", "lightBulb/sub"};

//  -----------------------------------------------------STATUS DEVICES-------------------------------------------------- ||

boolean lightIsActive = false;
boolean airConditionerIsActive = false;
boolean fanIsActive = false;

//  -----------------------------------------------------STREAMING DATA--------------------------------------------------- ||

void Streaming();

//  -------------------------------------------------PROCESS TOPIC Received----------------------------------------------- ||

void processTopic();
unsigned int processFan();
unsigned int processAirConditioner();
unsigned int processLightBulb();

//  ----------------------------------------CUSTOM TOPIC RECEIVED TO TOPIC PUBLISH---------------------------------------- ||

String prepare_topic_to_publish(String topicReceived);

//  ----------------------------------------------------------END--------------------------------------------------------- ||

//  -------------------------------------------------MAIN PROGRAMMING LAUNCH---------------------------------------------- ||

void setup()
{
  Serial.begin(115200);
  Serial.println("Setup started");
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, HIGH);

  connect_wifi();

  delay(1000);

  const char *mqtt_server = "10.20.160.119"; // Địa chỉ IP của MQTT broker
  const int mqtt_port = 1883;
  // connect broker MQTT
  mqttClient.setServer(mqtt_server, mqtt_port);
  mqttClient.setCallback(callback);
}

void loop()
{
  delay(1000);

  // Kiểm tra kết nối MQTT và thực hiện kết nối lại nếu cần
  if (!mqttClient.connected())
  {
    reconnect();
    mqttClient.subscribe("fan/pub");
    mqttClient.subscribe("airConditioner/pub");
    mqttClient.subscribe("lightBulb/pub");
  }

  // Gọi mqttClient.loop() để xử lý gói tin MQTT
  mqttClient.loop();

  // Xử lý dữ liệu và nhận dữ liệu từ các topic subscribed
  processTopic();

  // Xử lý dữ liệu và publish định kỳ
  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= interval)
  {
    previousMillis = currentMillis;

    Streaming();
  }
}
//  --------------------------------------------------------END----------------------------------------------------------- ||

//  ------------------------------------------------- void Streaming() --------------------------------------------------- ||
void Streaming()
{
  DataStreaming streaming;

  streaming.topic = "streaming/all";
  streaming.temp = 28;
  streaming.humidity = random(30, 90);
  streaming.light = random(100, 1000);
  streaming.dump = "{\"temp\":" + String(streaming.temp) + "," +
                   "\"humidity\":" + String(streaming.humidity) + "," +
                   "\"light\":" + String(streaming.light) + "}";

  char buffer[150];

  sprintf(buffer, "Pushing topic %s -> data: %s", streaming.topic.c_str(), streaming.dump.c_str());

  Serial.println(buffer);

  _publish(streaming.topic, streaming.dump);
}
//  ----------------------------------------------------------END--------------------------------------------------------- ||

//  ----------------------------------- String prepare_topic_to_publish(String topicReceived) ----------------------------- ||
String prepare_topic_to_publish(String topicReceived)
{
  String delimiter = "/"; // Ký tự phân tách
  int delimiterIndex = topicReceived.indexOf(delimiter);

  if (delimiterIndex != -1)
  {
    // Trả về phần chuỗi trước ký tự phân tách
    String topic_name = topicReceived.substring(0, delimiterIndex);
    return topic_name + "/sub";
  }
  else
  {
    // Nếu không có ký tự phân tách, trả về invalid
    return "Invalid delimiter";
  }
}
//  ----------------------------------------------------------END--------------------------------------------------------- ||

//  -------------------------------------------------- void processTopic() ----------------------------------------------- ||

// Xử lý topic được publish tới và trả kết quả là định dạng ResultProcessTopic
void processTopic()
{
  ResultProcessTopic result;

  // Nếu không có Topic nào gửi đến thì không xử lý
  if (strlen(receivedTopic_global) == 0)
  {
    result.topic = "NoTopicReceived";
    result.isActive = -2;
    return;
  }

  Serial.print("Topic nhận được: ");
  Serial.println(receivedTopic_global);

  Serial.print("Payload nhận được: ");
  Serial.println(receivedPayload_global);

  unsigned int isActive = -1;

  // Nếu topic này là fan
  if (strcmp(receivedTopic_global, topic_subscribes[0]) == 0)
  {
    isActive = processFan();
  }
  // Nếu topic này là điều hòa
  else if (strcmp(receivedTopic_global, topic_subscribes[1]) == 0)
  {
    isActive = processAirConditioner();
  }
  // Nếu topic này là đèn
  else if (strcmp(receivedTopic_global, topic_subscribes[2]) == 0)
  {
    isActive = processLightBulb();
  }

  // Trả kết quả xử lý topic
  result.topic = receivedTopic_global;
  result.isActive = isActive;

  // Xoá topic và payload sau khi hoàn thành
  strncpy(receivedTopic_global, "", sizeof(receivedTopic_global) - 1);
  receivedTopic_global[0] = '\0';
  strncpy(receivedPayload_global, "", sizeof(receivedPayload_global) - 1);
  receivedPayload_global[0] = '\0';

  // chuyển topic được publish đến thành dạng subscribe của server, sau đó publish nó đi.
  // Ví dụ: fan/pub -> fan/sub.
  String topic_to_publish = prepare_topic_to_publish(result.topic);

  // Nếu có topic hợp lệ gửi đến và topic này đã được định nghĩa đúng format : fan/pub
  if (topic_to_publish != "Invalid delimiter")
  {
    String status = "";
    // Bật thành công
    if (result.isActive == 1)
    {
      status = "TurnOn Successfully";

      Serial.println("TurnOn successfully");
      delay(100);
    }
    // Tắt thành công
    else if (result.isActive == 0)
    {
      status = "TurnOff Successfully";

      Serial.println("Failed to TurnOff");
      delay(100);
    }
    // Nếu lệnh được Publish đến bị sai logic nên không được thực hiện
    else if (result.isActive == -1)
    {
      status = "Wrong Command";

      Serial.println("Failed to active message");
      delay(100);
    }

    // Tạo Chuối JSON để gửi đi
    String message = "{\"topic\":\"" + topic_to_publish + "\"," +
                     "\"status\":\"" + status + "\"}";
    _publish(topic_to_publish, message);
  }
}
//  ----------------------------------------------------------END--------------------------------------------------------- ||

//  ----------------------------------------------- unsigned int processFan() -------------------------------------------- ||

unsigned int processFan()
{
  unsigned int isActive = -1;

  // nếu quạt đang tắt và subscribe cmd là ON thì cho bật quạt
  if (fanIsActive == false && strcmp(receivedPayload_global, cmd[0]) == 0)
  {
    digitalWrite(LED_BUILTIN, LOW);
    isActive = 1;
    fanIsActive = true;
  }
  // nếu quạt đang bật và subscribe cmd là OFF thì cho tắt quạt
  else if (fanIsActive == true && strcmp(receivedPayload_global, cmd[1]) == 0)
  {
    isActive = 0;
    digitalWrite(LED_BUILTIN, HIGH);
    fanIsActive = false;
  }
  else
  {
    // không cho tương tác với quạt
    isActive = -1;
  }

  return isActive;
}
//  ----------------------------------------------------------END--------------------------------------------------------- ||

//  ----------------------------------------- unsigned int processAirConditioner() --------------------------------------- ||
unsigned int processAirConditioner()
{
  unsigned int isActive = -1;

  // nếu điều hòa đang tắt và subscribe cmd là ON thì cho bật điều hòa
  if (airConditionerIsActive == false && strcmp(receivedPayload_global, cmd[0]) == 0)
  {
    digitalWrite(LED_BUILTIN, LOW);
    isActive = 1;
    airConditionerIsActive = true;
  }
  // nếu điều hòa đang bật và subscribe cmd là OFF thì cho tắt điều hòa
  else if (airConditionerIsActive == true && strcmp(receivedPayload_global, cmd[1]) == 0)
  {
    isActive = 0;
    digitalWrite(LED_BUILTIN, HIGH);
    airConditionerIsActive = false;
  }
  else
  {
    // không cho tương tác với điều hòa
    isActive = -1;
  }

  return isActive;
}
//  ----------------------------------------------------------END--------------------------------------------------------- ||

//  --------------------------------------------- unsigned int processLightBulb() ---------------------------------------- ||
unsigned int processLightBulb()
{
  unsigned int isActive = -1;

  // nếu đèn đang tắt và subscribe cmd là ON thì cho bật đèn
  if (lightIsActive == false && strcmp(receivedPayload_global, cmd[0]) == 0)
  {
    digitalWrite(LED_BUILTIN, LOW);
    isActive = 1;
    lightIsActive = true;
  }
  // nếu đèn đang bật và subscribe cmd là OFF thì cho tắt đèn
  else if (lightIsActive == true && strcmp(receivedPayload_global, cmd[1]) == 0)
  {
    isActive = 0;
    digitalWrite(LED_BUILTIN, HIGH);
    lightIsActive = false;
  }
  else
  {
    // không cho tương tác với đèn
    isActive = -1;
  }

  return isActive;
}
//  ----------------------------------------------------------END--------------------------------------------------------- ||
