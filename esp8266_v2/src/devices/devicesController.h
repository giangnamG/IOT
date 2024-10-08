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
    boolean allDeviceIsActive = false;

    /*
Hàm xử lý bật tắt 1 device
*/
    unsigned int device_process(Device *device)
    {
        unsigned int isActive = -1;

        // nếu device đang tắt và subscribe cmd là ON thì cho bật device
        if (device->deviceIsActive == false && strcmp(receivedPayload_global, cmd[0]) == 0)
        {
            isActive = 1;
            device->turnOn();
        }
        // nếu device đang bật và subscribe cmd là OFF thì cho tắt device
        else if (device->deviceIsActive == true && strcmp(receivedPayload_global, cmd[1]) == 0)
        {
            isActive = 0;
            device->turnOff();
            /*
             *
             */
            if (this->allDeviceIsActive == true)
                this->allDeviceIsActive = false;
        }
        // Nếu device đang tắt và subscribe cmd là OFF thì thông báo lại
        else if (device->deviceIsActive == false && strcmp(receivedPayload_global, cmd[1]) == 0)
        {
            // không cho tương tác với device
            isActive = 2;
            device->isAlreadyOff();
        }
        // nếu device đang bật và subscribe cmd là ON thì thông báo lại
        else if (device->deviceIsActive == true && strcmp(receivedPayload_global, cmd[0]) == 0)
        {
            // không cho tương tác với device
            isActive = 3;
            device->isAlreadyOn();
        }

        return isActive;
    }

public:
    void listen(PubSubClient &psClient)
    {
        /*
         *
         */
        if (fan.deviceIsActive == true && airConditional.deviceIsActive == true && lightBulb.deviceIsActive == true)
        {
            allDeviceIsActive = true;
        }
        else if (fan.deviceIsActive == false && airConditional.deviceIsActive == false && lightBulb.deviceIsActive == false)
        {
            allDeviceIsActive = false;
        }
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

        // Nếu topic này điều khiển cả 3 thiết bị
        if (strcmp(receivedTopic_global, topic_subscribes[3]) == 0)
        {
            allDeviceIsActive = fan.isActive() && airConditional.isActive() && lightBulb.isActive()
                                    ? true
                                    : false;
            // nếu tất cả device đang tắt và subscribe cmd là ON thì cho bật device
            if (allDeviceIsActive == false && strcmp(receivedPayload_global, cmd[0]) == 0)
            {
                allDeviceIsActive = true;
                isActive = 1;
                fan.turnOn();
                lightBulb.turnOn();
                airConditional.turnOn();
            }
            // nếu tất device đang bật và subscribe cmd là OFF thì cho tắt device
            else if (allDeviceIsActive == true && strcmp(receivedPayload_global, cmd[1]) == 0)
            {
                isActive = 0;
                allDeviceIsActive = false;
                fan.turnOff();
                lightBulb.turnOff();
                airConditional.turnOff();
            }
            // Nếu device đang tắt và subscribe cmd là OFF thì thông báo lại
            else if (allDeviceIsActive == false && strcmp(receivedPayload_global, cmd[1]) == 0)
            {
                // không cho tương tác với device
                isActive = 2;
            }
            // nếu device đang bật và subscribe cmd là ON thì thông báo lại
            else if (allDeviceIsActive == true && strcmp(receivedPayload_global, cmd[0]) == 0)
            {
                // không cho tương tác với device
                isActive = 3;
            }
        }
        // Nếu topic này là fan
        else if (strcmp(receivedTopic_global, topic_subscribes[0]) == 0)
        {
            isActive = this->device_process(&fan);
        }
        // Nếu topic này là điều hòa
        else if (strcmp(receivedTopic_global, topic_subscribes[1]) == 0)
        {
            isActive = this->device_process(&airConditional);
        }
        // Nếu topic này là đèn
        else if (strcmp(receivedTopic_global, topic_subscribes[2]) == 0)
        {
            isActive = this->device_process(&lightBulb);
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
            /*
             * Nếu lệnh được Publish đến bị sai logic nên không được thực hiện
             */
            /*
             * nếu đang tắt mà Publish đến lệnh tắt
             */
            else if (result.isActive == 2)
            {
                status = "is already off!";
                Serial.println(status);
                delay(100);
            }
            /*
             * nếu đang bật mà Publish đến lệnh bật
             */
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
