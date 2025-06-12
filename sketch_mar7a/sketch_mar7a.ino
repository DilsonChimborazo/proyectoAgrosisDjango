#include <WiFi.h>
#include <WiFiManager.h>
#include <WebSocketsClient.h>
#include <HTTPClient.h>
#include <DHT.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <ArduinoJson.h>
#include <WiFiUdp.h>
#include <NTPClient.h>

// 📌 Configuración del sensor DHT22
#define DHTPIN 2      
#define DHTTYPE DHT22 
DHT dht(DHTPIN, DHTTYPE);

// 📌 Configuración de la pantalla OLED
#define SCREEN_WIDTH 128  
#define SCREEN_HEIGHT 64  
#define OLED_RESET 16     
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// 📌 Configuración del botón de reinicio
#define RESET_PIN 5    
#define DEBOUNCE_TIME 50 // Tiempo de debounce (ms)

// ⏰ Configuración NTP
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", -18000, 60000); // UTC-5 (Colombia)

// 🌐 Configuración
const char* websocket_server = "10.4.23.238";
const int websocket_port = 8000;
const char* websocket_path = "/ws/api/mide/";
const char* sensoresUrl = "http://10.4.23.238:8000/api/sensores/";
WebSocketsClient webSocket;

// WiFiManager
WiFiManager wm;

// Variables para el botón
volatile bool resetWiFi = false;
unsigned long lastDebounceTime = 0;

// Variables para nombres de sensores
String tempSensorName = "Esperando...";
String humSensorName = "Esperando...";
String lightSensorName = "Esperando...";
String windSensorName = "Esperando...";
String pHSensorName = "Esperando...";

// Promedio móvil
#define WINDOW_SIZE 5
float tempBuffer[WINDOW_SIZE];
float humidityBuffer[WINDOW_SIZE];
int bufferIndex = 0;
bool bufferFilled = false;

// Rastrear variaciones
float lastTemperature = 0.0;
float lastHumidity = 0.0;

// Tiempo para actualizar
unsigned long lastSensorUpdate = 0;
const unsigned long sensorUpdateInterval = 60000 ; // 1 minutos
unsigned long lastMideUpdate = 0;
const unsigned long mideUpdateInterval = 60000; //  1 minutos

void IRAM_ATTR handleResetButton() {
  if (millis() - lastDebounceTime > DEBOUNCE_TIME) {
    resetWiFi = true;
    lastDebounceTime = millis();
  }
}

// Calcular promedio móvil
float calculateMovingAverage(float newValue, float buffer[]) {
  buffer[bufferIndex] = newValue;
  bufferIndex = (bufferIndex + 1) % WINDOW_SIZE;
  if (bufferIndex == 0) bufferFilled = true;
  float sum = 0.0;
  int count = bufferFilled ? WINDOW_SIZE : bufferIndex;
  for (int i = 0; i < count; i++) {
    sum += buffer[i];
  }
  return sum / count;
}

// Obtener fecha y hora en ISO 8601
String getDateTimeISO() {
  timeClient.update();
  unsigned long epochTime = timeClient.getEpochTime();
  struct tm *ptm = gmtime((time_t *)&epochTime);
  char dateTime[30];
  sprintf(dateTime, "%04d-%02d-%02dT%02d:%02d:%02d-05:00", 
          ptm->tm_year + 1900, ptm->tm_mon + 1, ptm->tm_mday, 
          ptm->tm_hour, ptm->tm_min, ptm->tm_sec);
  return String(dateTime);
}

// Inicializar OLED
void inicializarOLED() {
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("❌ Error al inicializar el OLED");
    for(;;);
  }
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(10, 20);
  display.println("ESP32 iniciado");
  display.display();
  delay(2000);
}

// Mostrar datos en OLED
void mostrarEnOLED(int localTemp, int localHum, int localLight, float localWind) {
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
  display.setTextSize(1);
  display.setCursor(0, 0);
  display.println(getDateTimeISO());
  display.setCursor((SCREEN_WIDTH - 40) / 2, 10);
  display.println("Temp: " + String(localTemp) + " C");
  display.setCursor((SCREEN_WIDTH - 40) / 2, 22);
  display.println("Hum: " + String(localHum) + " %");
  display.setCursor((SCREEN_WIDTH - 40) / 2, 34);
  display.println("Luz: " + String(localLight) + " lux");
  display.setCursor((SCREEN_WIDTH - 50) / 2, 46);
  display.println("Viento: " + String(localWind, 1) + " m/s");
  display.display();
}

// Obtener nombres de sensores por HTTP GET
void updateSensorNames() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(sensoresUrl);
    int httpCode = http.GET();
    if (httpCode == HTTP_CODE_OK) {
      String payload = http.getString();
      Serial.println("📥 Respuesta de sensores: " + payload);
      DynamicJsonDocument doc(1024);
      DeserializationError error = deserializeJson(doc, payload);
      if (!error && doc.is<JsonArray>()) {
        for (JsonObject sensor : doc.as<JsonArray>()) {
          int id_sensor = sensor["id"];
          const char* nombre_sensor = sensor["nombre_sensor"];
          if (nombre_sensor) {
            if (id_sensor == 1) tempSensorName = String(nombre_sensor);
            else if (id_sensor == 2) humSensorName = String(nombre_sensor);
            else if (id_sensor == 3) lightSensorName = String(nombre_sensor);
            else if (id_sensor == 4) windSensorName = String(nombre_sensor);
            else if (id_sensor == 5) pHSensorName = String(nombre_sensor);
          }
        }
      }
    }
    http.end();
  }
}

// Callback WebSocket
void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED:
      Serial.println("⚠ Desconectado del WebSocket");
      break;
    case WStype_CONNECTED:
      Serial.println("✅ Conectado al WebSocket");
      break;
    case WStype_TEXT:
      Serial.println("📥 Mensaje recibido: " + String((char*)payload));
      break;
  }
}

// Enviar datos por WebSocket
void sendWebSocketData(int sensorId, int plantacionId, float value) {
  DynamicJsonDocument doc(128);
  doc["fk_id_sensor"] = sensorId;
  doc["fk_id_plantacion"] = plantacionId;
  doc["valor_medicion"] = (int)value; // Enviar como entero
  String jsonData;
  serializeJson(doc, jsonData);
  webSocket.sendTXT(jsonData);
  Serial.print("🌡 Enviando (Sensor ");
  Serial.print(sensorId);
  Serial.print("): ");
  Serial.println(jsonData);
}

void setup() {
  Serial.begin(115200);
  while (!Serial) delay(1);
  Serial.println("=== Sistema iniciado ===");
  Serial.println("Hora actual: 11:42 AM -05, Thursday, May 29, 2025");

  pinMode(RESET_PIN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(RESET_PIN), handleResetButton, FALLING);
  Serial.println("👆 Pin de reinicio: D5");

  dht.begin();
  delay(3000);

  inicializarOLED();

  Serial.println("📡 Configurando WiFiManager...");
  wm.setDebugOutput(true);
  wm.setAPCallback([](WiFiManager *myWiFiManager) {
    Serial.println("📍 Modo AP activado");
    Serial.print("SSID: ");
    Serial.println(myWiFiManager->getConfigPortalSSID());
    Serial.print("IP del portal: ");
    Serial.println(WiFi.softAPIP());
  });
  wm.setConfigPortalTimeout(180);
  wm.setConnectTimeout(60);

  if (digitalRead(RESET_PIN) == LOW || resetWiFi) {
    Serial.println("🔄 Reiniciando credenciales WiFi");
    wm.resetSettings();
    resetWiFi = false;
  }

  Serial.println("🔌 Conectando a WiFi...");
  bool res = wm.autoConnect("ESP32-Config", "12345678");
  if (!res) {
    Serial.println("❌ Fallo al conectar al WiFi. Reiniciando...");
    delay(3000);
    ESP.restart();
  } else {
    Serial.println("✅ WiFi conectado");
    Serial.print("📡 IP: ");
    Serial.println(WiFi.localIP());
  }

  timeClient.begin();
  timeClient.forceUpdate();

  for (int i = 0; i < WINDOW_SIZE; i++) {
    tempBuffer[i] = 0.0;
    humidityBuffer[i] = 0.0;
  }

  // Iniciar WebSocket
  webSocket.begin(websocket_server, websocket_port, websocket_path);
  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(5000); // Reconectar cada 5 segundos si falla

  updateSensorNames();
}

void loop() {
  if (resetWiFi) {
    Serial.println("🔄 Botón de reinicio presionado. Borrando credenciales...");
    wm.resetSettings();
    resetWiFi = false;
    ESP.restart();
  }

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("⚠ WiFi desconectado. Reconectando...");
    wm.autoConnect("ESP32-Config", "12345678");
  }

  webSocket.loop();

  unsigned long currentMillis = millis();

  // Actualizar nombres de sensores cada 60 segundos
  if (currentMillis - lastSensorUpdate >= sensorUpdateInterval) {
    updateSensorNames();
    lastSensorUpdate = currentMillis;
  }

  // Enviar mediciones cada 15 segundos
  if (currentMillis - lastMideUpdate >= mideUpdateInterval) {
    float rawTemperature = dht.readTemperature();
    float rawHumidity = dht.readHumidity();
    if (!isnan(rawTemperature) && !isnan(rawHumidity) && 
        rawTemperature >= -40 && rawTemperature <= 80 && 
        rawHumidity >= 0 && rawHumidity <= 100) {
      Serial.print("🌡 Temperatura cruda válida: ");
      Serial.println(rawTemperature, 2);
      Serial.print("💧 Humedad cruda válida: ");
      Serial.println(rawHumidity, 2);

      float smoothedTemperature = calculateMovingAverage(rawTemperature, tempBuffer);
      float smoothedHumidity = calculateMovingAverage(rawHumidity, humidityBuffer);

      int temperatura = constrain((int)smoothedTemperature, -40, 80);
      int humedad = constrain((int)smoothedHumidity, 0, 100);

      Serial.print("🌡 Temperatura validada (entero): ");
      Serial.println(temperatura);
      Serial.print("💧 Humedad validada (entero): ");
      Serial.println(humedad);

      // Enviar mediciones reales
      sendWebSocketData(1, 1, temperatura); // Temperatura
      sendWebSocketData(2, 1, humedad);     // Humedad

      // Simular otros sensores (puedes reemplazar con sensores reales si los tienes)
      int luzSimulada = random(100, 3000);
      float vientoSimulado = random(0, 301) / 10.0;
      float pHSimulado = random(40, 81) / 10.0;
      sendWebSocketData(3, 1, luzSimulada); // Luz
      sendWebSocketData(4, 1, vientoSimulado); // Viento
      sendWebSocketData(5, 1, pHSimulado);  // pH

      mostrarEnOLED(temperatura, humedad, luzSimulada, vientoSimulado);
    } else {
      Serial.println("⚠ Error al leer DHT22: valores inválidos");
      display.clearDisplay();
      display.setTextColor(SSD1306_WHITE);
      display.setTextSize(1);
      display.setCursor(10, 20);
      display.println("Error DHT22");
      display.display();
      delay(100000);
    }
    lastMideUpdate = currentMillis;
  }
}