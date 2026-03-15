#include <PubSubClient.h>
#include <WiFi.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include <WiFiClientSecure.h>
// ================= CẤU HÌNH CHÂN LED (THIẾT BỊ MÔ PHỎNG) =================
#define LED_GREEN 17  // pump
#define LED_YELLOW 18 // light
#define LED_RED 19    // fan
#define LED_BLUE 21   // sprayer

// ================= CẤU HÌNH CHÂN CẢM BIẾN =================
#define DHT_TYPE DHT11
#define DHT_PIN 22
DHT dht(DHT_PIN, DHT_TYPE);

#define LDR_PIN 34
#define SOIL_PIN 35

// ================= CẤU HÌNH WIFI & MQTT =================
const char *ssid = "wifi-name";
const char *password = "wifi-password";
const char *mqtt_server_ip = "mqtt-broker-ip";
const int mqtt_port = 1883;
const char *mqtt_username = "mqtt-username";
const char *mqtt_password = "mqtt-password";

// ================= TOPIC =================
const char *topic_data_sensor = "garden/sensordata";
const char *topic_device_control = "garden/devicecontrol";
const char *topic_status = "garden/status";
const char *topic_sync = "garden/sync";

// ================= DEVICE TYPE =================
const String PUMP_TYPE = "pump";
const String LIGHT_TYPE = "light";
const String FAN_TYPE = "fan";
const String SPRAYER_TYPE = "sprayer";

// WiFiClient espClient;
WiFiClientSecure espClient;
PubSubClient client(espClient);

unsigned long lastMsg = 0;

String led_status()
{
  int st_green = digitalRead(LED_GREEN);
  int st_yellow = digitalRead(LED_YELLOW);
  int st_red = digitalRead(LED_RED);
  int st_blue = digitalRead(LED_BLUE);
  String r_green = st_green ? "ON" : "OFF";
  String r_yellow = st_yellow ? "ON" : "OFF";
  String r_red = st_red ? "ON" : "OFF";
  String r_blue = st_blue ? "ON" : "OFF";

  String status_payload = "{\"GREEN\":\"" + r_green +
                          "\",\"YELLOW\":\"" + r_yellow +
                          "\",\"RED\":\"" + r_red +
                          "\",\"BLUE\":\"" + r_blue + "\"}";

  return status_payload;
}
// Function process sub message
void callback(char *topic, byte *payload, unsigned int length)
{
  String messageTemp;
  for (int i = 0; i < length; i++)
  {
    messageTemp += (char)payload[i];
  }
  Serial.print("Co tin nhan tu Topic: [");
  Serial.print(topic);
  Serial.println("]");
  Serial.print("Noi dung: ");
  Serial.println(messageTemp);

  StaticJsonDocument<256> doc;
  DeserializationError error = deserializeJson(doc, messageTemp);

  if (error)
  {
    Serial.print("Loi parse JSON: ");
    Serial.println(error.c_str());
    return;
  }

  String device_type = doc["device_type"].as<String>();
  String action = doc["action"].as<String>();

  int ledState = (action == "ON") ? HIGH : LOW;

  if (device_type == PUMP_TYPE)
  {
    digitalWrite(LED_GREEN, ledState);
    Serial.println(action == "ON" ? "Đã BẬT LED XANH LÁ (Máy bơm)" : "Đã TẮT LED XANH LÁ (Máy bơm)");
  }
  else if (device_type == LIGHT_TYPE)
  {
    digitalWrite(LED_YELLOW, ledState);
    Serial.println(action == "ON" ? "Đã BẬT LED VÀNG (Đèn)" : "Đã TẮT LED VÀNG (Đèn)");
  }
  else if (device_type == FAN_TYPE)
  {
    digitalWrite(LED_RED, ledState);
    Serial.println(action == "ON" ? "Đã BẬT LED ĐỎ (Quạt)" : "Đã TẮT LED ĐỎ (Quạt)");
  }
  else if (device_type == SPRAYER_TYPE)
  {
    digitalWrite(LED_BLUE, ledState);
    Serial.println(action == "ON" ? "Đã BẬT LED XANH DƯƠNG (Phun sương)" : "Đã TẮT LED XANH DƯƠNG (Phun sương)");
  }
  else
  {
    Serial.println("Device ID không khớp với hệ thống!");
    return;
  }

  // --- GỬI PHẢN HỒI (STATUS) VỀ LẠI BACKEND ---
  StaticJsonDocument<256> responseDoc;
  responseDoc["device_type"] = device_type;
  responseDoc["action"] = action;
  responseDoc["status"] = "SUCCESS";
  char responseBuffer[256];
  serializeJson(responseDoc, responseBuffer);

  client.publish(topic_status, responseBuffer);
}

void setup()
{
  Serial.begin(115200);
  // Khởi tạo chân LED
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_YELLOW, OUTPUT);
  pinMode(LED_RED, OUTPUT);
  pinMode(LED_BLUE, OUTPUT);

  // Tắt tất cả LED lúc khởi động
  digitalWrite(LED_GREEN, LOW);
  digitalWrite(LED_YELLOW, LOW);
  digitalWrite(LED_RED, LOW);
  digitalWrite(LED_BLUE, LOW);

  dht.begin();
  pinMode(LDR_PIN, INPUT);
  pinMode(SOIL_PIN, INPUT);

  espClient.setInsecure();
  setup_wifi();

  // Setup MQTT
  client.setServer(mqtt_server_ip, mqtt_port);
  client.setCallback(callback);
}
void setup_wifi()
{
  delay(10);
  Serial.print("Dang ket noi den Wifi");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi đã kết nối");
  Serial.println("Địa chỉ IP: ");
  Serial.println(WiFi.localIP());
}
void reconnect()
{
  while (!client.connected())
  {
    Serial.print("Dang ket noi MQTT...");
    String clientId = "ESP32Client-SmartGarden-" + String(random(0xffff), HEX);
    if (client.connect(clientId.c_str(), mqtt_username, mqtt_password))
    {
      Serial.println("Da ket noi MQTT Broker thanh cong!");
      client.subscribe(topic_device_control);

      client.publish("garden/sync", "{\"status\": \"connected\"}");
      Serial.println("Đã gửi yêu cầu đồng bộ trạng thái đến Backend.");
    }
    else
    {
      Serial.print("That bai, ma loi=");
      Serial.print(client.state());
      Serial.println(" Thu lai sau 2 giay");
      delay(2000);
    }
  }
}
void loop()
{
  // put your main code here, to run repeatedly:
  if (!client.connected())
  {
    reconnect();
  }
  client.loop();

  unsigned long now = millis();

  // ================= ĐỌC VÀ GỬI DỮ LIỆU CẢM BIẾN (PUBLISH) =================
  if (millis() - lastMsg > 2000)
  {
    lastMsg = now;

    // 1. Đọc dữ liệu từ DHT11
    float h = dht.readHumidity();
    float t = dht.readTemperature();

    // 2. Đọc dữ liệu Analog (Độ ẩm đất và Ánh sáng)
    int ldr_raw = analogRead(LDR_PIN);
    float light_percent = (1.0 - (ldr_raw / 4095.0)) * 100.0;
    int soil_raw = analogRead(SOIL_PIN);
    float soil_percent = (1.0 - (soil_raw / 4095.0)) * 100.0;

    // 3. Đóng gói dữ liệu thành JSON
    StaticJsonDocument<256> doc;
    doc["temp"] = t;
    doc["humid"] = h;
    doc["soil"] = soil_percent;
    doc["light"] = light_percent;

    char outBuffer[256];
    serializeJson(doc, outBuffer);

    // 4. Gửi lên MQTT Broker
    Serial.print("Gui du lieu: ");
    Serial.println(outBuffer);
    client.publish(topic_data_sensor, outBuffer);
  }
}
