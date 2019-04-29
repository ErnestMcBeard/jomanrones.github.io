int redPin = 2;
int greenPin = 3;
int bluePin = 4;

void setup() {
  // put your setup code here, to run once:
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);

  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
    int red = Serial.read();
    int green = Serial.read();
    int blue = Serial.read();

    setColor(red, green, blue);
    delay(1000);
}

void setColor(int red, int green, int blue) {
  #ifdef COMMON_ANODE
    red = 255 - red;
    green = 255 - green;
    blue = 255 - blue;
  #endif
  analogWrite(redPin, red);
  analogWrite(greenPin, green);
  analogWrite(bluePin, blue);
}
