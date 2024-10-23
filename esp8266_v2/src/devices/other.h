#include "../objects/device.h"

class Other : public Device
{
public:
    Other()
    {
        PinMode = D0;
    };
};