# ============================================
# Dockerfile for Task Board API
# ENGSE207 - Week 6 Docker Version
# ============================================

# Stage 1: Base image
# ใช้ Node.js Alpine version (เล็กกว่า ~5x)
FROM node:20-alpine

# ตั้งค่า metadata
LABEL maintainer="ENGSE207 Student"
LABEL description="Task Board API - N-Tier Architecture"
LABEL version="2.0.0"

# ตั้งค่า Working Directory
WORKDIR /app

# Copy package files ก่อน (สำหรับ layer caching)
COPY package*.json ./

# Install dependencies
# --omit=dev = ไม่ install devDependencies ใน production
RUN npm ci --omit=dev

# Copy source code
COPY . .

# สร้าง non-root user เพื่อความปลอดภัย
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

# เปลี่ยน ownership ของ app files
RUN chown -R nodejs:nodejs /app

# ใช้ non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start command
CMD ["node", "server.js"]
