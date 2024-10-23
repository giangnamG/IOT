class SensorFader
{

public:
    int readDust()
    {
        return random(0, 100);
    }
    int readRain()
    {
        return random(0, 150);
    }
    int readWindSpeed()
    {
        return random(1, 15);
    }
};