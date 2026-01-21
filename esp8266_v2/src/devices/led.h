#include "../objects/device.h"

class LED : public Device
{
public:
    LED()
    {
        PinMode = D7;
    };
};