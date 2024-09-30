#include "../globals.h"
#include "fan.h"
#include "lightbulb.h"
#include "airconditional.h"

struct ResultProcessTopic
{
    String topic;
    int isActive;
};
String prepare_topic_to_publish(String topicReceived);

class DevicesController
{
private:
    Fan fan = Fan();
    LightBulb lightBulb = LightBulb();
    AirConditional airConditional = AirConditional();

public:
    void listen(PubSubClient &psClient)
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
            isActive = fan.process();
        }
        // Nếu topic này là điều hòa
        else if (strcmp(receivedTopic_global, topic_subscribes[1]) == 0)
        {
            isActive = airConditional.process();
        }
        // Nếu topic này là đèn
        else if (strcmp(receivedTopic_global, topic_subscribes[2]) == 0)
        {
            isActive = lightBulb.process();
        }

        // Trả kết quả xử lý topic
        result.topic = receivedTopic_global;
        result.isActive = isActive;

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

                Serial.println("TurnOff successfully");
                delay(100);
            }
            // Nếu lệnh được Publish đến bị sai logic nên không được thực hiện
            // nếu đang tắt mà Publish đến lệnh tắt
            else if (result.isActive == 2)
            {
                status = "is already off!";
                Serial.println(status);
                delay(100);
            }
            // nếu đang bật mà Publish đến lệnh bật
            else if (result.isActive == 3)
            {
                status = "is already on!";
                Serial.println(status);
                delay(100);
            }
            else if (result.isActive == -1)
            {
                status = "Wrong Command";

                Serial.println("Failed to active message");
                delay(100);
            }

            // Tạo Chuối JSON để gửi đi
            String message = "{\"topic\":\"" + topic_to_publish + "\"," +
                             "\"cmd\":\"" + receivedPayload_global + "\"," +
                             "\"status\":\"" + status + "\"}";
            Serial.println("Tạo Chuối JSON để gửi đi");
            Serial.println(message);

            // Xoá topic và payload sau khi hoàn thành
            strncpy(receivedTopic_global, "", sizeof(receivedTopic_global) - 1);
            receivedTopic_global[0] = '\0';
            strncpy(receivedPayload_global, "", sizeof(receivedPayload_global) - 1);
            receivedPayload_global[0] = '\0';

            psClient.publish(topic_to_publish.c_str(), message.c_str());
        }
    }
};

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
