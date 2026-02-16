#!/bin/bash
# Generate self-signed SSL certificate for development

SSL_DIR="./nginx/ssl"
mkdir -p $SSL_DIR

echo "🔐 Generating SSL certificate..."

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout $SSL_DIR/server.key \
    -out $SSL_DIR/server.crt \
    -subj "/C=TH/ST=ChiangMai/L=ChiangMai/O=RMUTL/OU=SoftwareEngineering/CN=localhost"

echo "✅ SSL certificate generated!"
echo "   Certificate: $SSL_DIR/server.crt"
echo "   Private Key: $SSL_DIR/server.key"
