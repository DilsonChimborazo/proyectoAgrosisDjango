#include <WiFi.h>
#include <DHT.h>
#include <Wire.h>
#include <ArduinoWebsockets.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <ArduinoJson.h>
#include <WiFiUdp.h>
#include <NTPClient.h>

// 📡 Configuración de WiFi
const char* ssid = "FUTUTEL_BUITRON";            
const char* password = "Laboyana66+1954*";   

// 🌐 WebSocket Servers
const char* websocket_mediciones = "ws://192.168.0.106:8000/ws/api/mide/";
const char* websocket_sensores = "ws://192.168.0.106:8000/ws/api/sensores/";

// ⏰ Configuración NTP
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "co.pool.ntp.org", 0, 60000); // Servidor NTP local para Colombia

// 📌 Configuración del sensor DHT11
#define DHTPIN 2      
#define DHTTYPE DHT11  
DHT dht(DHTPIN, DHTTYPE);  

// 📌 Configuración de la pantalla OLED
#define SCREEN_WIDTH 128  
#define SCREEN_HEIGHT 64  
#define OLED_RESET -1
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// 📡 Clientes WebSocket
using namespace websockets;
WebsocketsClient client_mediciones;
WebsocketsClient client_sensores;

// Variables para almacenar los datos recibidos del WebSocket
float receivedTemperature = 0.0;
float receivedHumidity = 0.0;
float receivedLight = 0.0;
float receivedWind = 0.0;

// Variables para almacenar los nombres de los sensores
String tempSensorName = "Esperando...";
String humSensorName = "Esperando...";
String lightSensorName = "Esperando...";
String windSensorName = "Esperando...";
bool newDataReceived = false;

// Función para obtener fecha y hora local en formato ISO 8601 (UTC-5)
String getDateTimeISO() {
  timeClient.update();
  unsigned long epochTime = timeClient.getEpochTime();
  const long offsetSeconds = -5 * 3600; // UTC-5
  epochTime += offsetSeconds;
  struct tm *ptm = gmtime((time_t *)&epochTime);
  char dateTime[30];
  sprintf(dateTime, "%04d-%02d-%02dT%02d:%02d:%02d-05:00", 
          ptm->tm_year + 1900, ptm->tm_mon + 1, ptm->tm_mday,
          ptm->tm_hour, ptm->tm_min, ptm->tm_sec);
  Serial.print("⏰ Hora enviada por ESP32: ");
  Serial.println(dateTime);
  return String(dateTime);
}

void conectarWiFi() {
  Serial.print("🔌 Conectando a WiFi...");
  WiFi.begin(ssid, password);
  int intentos = 0;
  while (WiFi.status() != WL_CONNECTED && intentos < 20) {
    delay(1000);
    Serial.print(".");
    intentos++;
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ WiFi conectado");
    Serial.print("📡 IP: ");
    Serial.println(WiFi.localIP());
    timeClient.begin();
    timeClient.forceUpdate();
  } else {
    Serial.println("\n❌ No se pudo conectar a WiFi");
  }
}

void onMessageCallbackMediciones(WebsocketsMessage message) {
  String data = message.data();
  Serial.print("📥 Mensaje recibido del WebSocket (mediciones): ");
  Serial.println(data);

  DynamicJsonDocument doc(1024);
  DeserializationError error = deserializeJson(doc, data);
  if (error) {
    Serial.print("❌ Error al parsear JSON: ");
    Serial.println(error.c_str());
    return;
  }

  int fk_id_sensor = doc["fk_id_sensor"];
  float valor_medicion = doc["valor_medicion"];

  if (fk_id_sensor == 1) {
    receivedTemperature = valor_medicion;
  } else if (fk_id_sensor == 2) {
    receivedWind = valor_medicion;
  } else if (fk_id_sensor == 3) {
    receivedLight = valor_medicion;
  } else if (fk_id_sensor == 4) {
    receivedHumidity = valor_medicion;
  }
  newDataReceived = true;
}

void onMessageCallbackSensores(WebsocketsMessage message) {
  String data = message.data();
  Serial.print("📥 Mensaje recibido del WebSocket (sensores): ");
  Serial.println(data);

  DynamicJsonDocument doc(1024);
  DeserializationError error = deserializeJson(doc, data);
  if (error) {
    Serial.print("❌ Error al parsear JSON: ");
    Serial.println(error.c_str());
    return;
  }

  int id_sensor = doc["id"];
  const char* nombre_sensor = doc["nombre_sensor"];
  if (nombre_sensor) {
    if (id_sensor == 1) {
      tempSensorName = String(nombre_sensor);
      Serial.print("✅ Sensor de temperatura recibido: ");
      Serial.println(tempSensorName);
    } else if (id_sensor == 2) {
      windSensorName = String(nombre_sensor);
      Serial.print("✅ Sensor de viento recibido: ");
      Serial.println(windSensorName);
    } else if (id_sensor == 3) {
      lightSensorName = String(nombre_sensor);
      Serial.print("✅ Sensor de luz recibido: ");
      Serial.println(lightSensorName);
    } else if (id_sensor == 4) {
      humSensorName = String(nombre_sensor);
      Serial.print("✅ Sensor de humedad recibido: ");
      Serial.println(humSensorName);
    }
  } else {
    Serial.println("⚠ No se encontró 'nombre_sensor' en el mensaje del WebSocket");
  }
}

void conectarWebSocketMediciones() {
  Serial.println("🔌 Conectando al WebSocket de mediciones...");
  if (client_mediciones.connect(websocket_mediciones)) {
    Serial.println("✅ WebSocket de mediciones conectado");
    client_mediciones.onMessage(onMessageCallbackMediciones);
  } else {
    Serial.println("❌ Error al conectar WebSocket de mediciones");
  }
}

void conectarWebSocketSensores() {
  Serial.println("🔌 Conectando al WebSocket de sensores...");
  if (client_sensores.connect(websocket_sensores)) {
    Serial.println("✅ WebSocket de sensores conectado");
    client_sensores.onMessage(onMessageCallbackSensores);
  } else {
    Serial.println("❌ Error al conectar WebSocket de sensores");
  }
}

void inicializarOLED() {
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { 
    Serial.println("❌ Error al inicializar OLED");
    for(;;);
  }
  Serial.println("✅ Pantalla OLED lista");
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(10, 20);
  display.println("ESP32 Iniciado");
  display.display();
  delay(2000);
}

void mostrarEnOLED(float localTemp, float localHum, float localLight, float localWind) {
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
  display.setTextSize(1);

  // Mostrar hora actual
  display.setCursor(0, 0);
  display.println(getDateTimeISO());

  // Sensor de Temperatura
  String tempText = "Temp: " + String(localTemp, 1) + " C";
  int16_t x1, y1;
  uint16_t w, h;
  display.getTextBounds(tempText, 0, 0, &x1, &y1, &w, &h);
  display.setCursor((SCREEN_WIDTH - w) / 2, 10);
  display.println(tempText);

  // Sensor de Humedad
  String humText = "Hum: " + String(localHum, 1) + " %";
  display.getTextBounds(humText, 0, 0, &x1, &y1, &w, &h);
  display.setCursor((SCREEN_WIDTH - w) / 2, 22);
  display.println(humText);

  // Sensor de Luz
  String lightText = "Luz: " + String(localLight, 0) + " lux";
  display.getTextBounds(lightText, 0, 0, &x1, &y1, &w, &h);
  display.setCursor((SCREEN_WIDTH - w) / 2, 34);
  display.println(lightText);

  // Sensor de Viento
  String windText = "Viento: " + String(localWind, 1) + " m/s";
  display.getTextBounds(windText, 0, 0, &x1, &y1, &w, &h);
  display.setCursor((SCREEN_WIDTH - w) / 2, 46);
  display.println(windText);

  display.display();
}

void setup() {
  Serial.begin(115200);
  dht.begin();
  conectarWiFi();
  inicializarOLED();
  conectarWebSocketMediciones();
  conectarWebSocketSensores();
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("⚠ WiFi desconectado. Reintentando...");
    conectarWiFi();
  }

  if (!client_mediciones.available()) {
    Serial.println("⚠ WebSocket de mediciones desconectado. Reintentando...");
    conectarWebSocketMediciones();
  } else {
    client_mediciones.poll();
  }

  if (!client_sensores.available()) {
    Serial.println("⚠ WebSocket de sensores desconectado. Reintentando...");
    conectarWebSocketSensores();
  } else {
    client_sensores.poll();
  }

  // Leer datos del DHT11
  float humedad = dht.readHumidity();
  float temperatura = dht.readTemperature();

  if (isnan(humedad) || isnan(temperatura)) {
    Serial.println("⚠ Error al leer el sensor DHT11");
    delay(5000);
    return;
  }

  // Simular datos de luz (0-2998 lux) y viento (0-30 m/s)
  float luzSimulada = random(100, 2999); // Rango realista para iluminación
  float vientoSimulado = random(0, 301) / 10.0; // Rango 0-30 m/s con un decimal

  // Enviar datos al WebSocket
  DynamicJsonDocument doc(128); // Tamaño suficiente para los campos necesarios
  String jsonData;

  // Temperatura (fk_id_sensor: 1)
  doc["fk_id_sensor"] = 1;
  doc["fk_id_plantacion"] = 1;
  doc["valor_medicion"] = temperatura;
  serializeJson(doc, jsonData);
  client_mediciones.send(jsonData);
  Serial.print("📡 Datos enviados por WebSocket: ");
  Serial.println(jsonData);

  // Viento (fk_id_sensor: 2)
  doc["fk_id_sensor"] = 2;
  doc["fk_id_plantacion"] = 1;
  doc["valor_medicion"] = vientoSimulado;
  serializeJson(doc, jsonData);
  client_mediciones.send(jsonData);
  Serial.print("📡 Datos enviados por WebSocket: ");
  Serial.println(jsonData);

  // Luz (fk_id_sensor: 3)
  doc["fk_id_sensor"] = 3;
  doc["fk_id_plantacion"] = 1;
  doc["valor_medicion"] = luzSimulada;
  serializeJson(doc, jsonData);
  client_mediciones.send(jsonData);
  Serial.print("📡 Datos enviados por WebSocket: ");
  Serial.println(jsonData);

  // Humedad (fk_id_sensor: 4)
  doc["fk_id_sensor"] = 4;
  doc["fk_id_plantacion"] = 1;
  doc["valor_medicion"] = humedad;
  serializeJson(doc, jsonData);
  client_mediciones.send(jsonData);
  Serial.print("📡 Datos enviados por WebSocket: ");
  Serial.println(jsonData);

  delay(10000); // Enviar cada 10 segundos (ajustado para pruebas)
}
