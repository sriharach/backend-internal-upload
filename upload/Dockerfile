# เลือกฐานข้อมูล Docker image ที่มี Node.js เวอร์ชัน 14
FROM node:16

# สร้างโฟลเดอร์ app ในคอนเทนเนอร์และเปลี่ยนไปใช้เป็นโฟลเดอร์ทำงาน
WORKDIR /app

# คัดลอกไฟล์ package.json และ package-lock.json แล้วดำเนินการ npm install
COPY package*.json ./
RUN npm install

# คัดลอกไฟล์โปรเจกต์และไฟล์ที่เกี่ยวข้อง
COPY . .

# เปิดพอร์ตที่แอปพลิเคชัน Fastify ใช้
EXPOSE 4012

# รันแอปพลิเคชัน Fastify
CMD ["node", "server.js"]
