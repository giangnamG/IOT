// globals.h
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

//  -----------------------------------------------------DEFINE Data Global-------------------------------------------------- ||

extern char receivedTopic_global[100];
extern char receivedPayload_global[256];

//  -----------------------------------------------------DEFINE COMMAND-------------------------------------------------- ||

extern char cmd[2][5];
extern char topic_subscribes[10][256];
extern char topic_publish[10][256];
