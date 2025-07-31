#!/bin/bash
NEW_IP=$(hostname -I | awk '{print $1}')
ENV_FILE="/home/dilson/proyectoAgroSisDjango/frontAgrosis/.env"

if [ ! -f "$ENV_FILE" ]; then
    echo "VITE_API_URL=http://$NEW_IP:8000/api/" > "$ENV_FILE"
    echo "VITE_WS_URL=ws://$NEW_IP:8000/ws/api/" >> "$ENV_FILE"
    echo "VITE_WEATHER_API_KEY=d1eac6ff7d294b7d90c162117252605" >> "$ENV_FILE"
    echo "VITE_GOOGLE_MAPS_API_KEY=AIzaSyBC5iRBfXm_H_6NEeoC8JdJ9SDj4hg3dCQ" >> "$ENV_FILE"
fi

sed -i "s|VITE_API_URL=.*|VITE_API_URL=http://$NEW_IP:8000/api/|" "$ENV_FILE"
sed -i "s|VITE_WS_URL=.*|VITE_WS_URL=ws://$NEW_IP:8000/ws/api/|" "$ENV_FILE"

echo "Updated .env with IP: $NEW_IP"