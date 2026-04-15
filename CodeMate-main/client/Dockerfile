FROM node:18

WORKDIR /app
ENV NODE_OPTIONS="--max_old_space_size=2048"
COPY . .

RUN npm install

ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

RUN npm run build

RUN npm install -g serve

CMD ["serve", "-s", "dist", "-l", "5173"]