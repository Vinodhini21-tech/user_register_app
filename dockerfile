# Step 1: Use the official Node.js image as a base image
FROM node:21.3-alpine AS builder

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (if present) into the container
COPY package.json package-lock.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of your application files into the container
COPY . .

# Step 6: Build the Next.js app
RUN npm run build

# Step 7: Use a lightweight image for running the app
FROM node:21.3-alpine AS runner

# Install Docker CLI and kubectl for additional deployment capabilities
RUN apk add --no-cache \
    docker \
    curl \
    bash \
    && curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" \
    && chmod +x kubectl \
    && mv kubectl /usr/local/bin/

# Step 8: Set the working directory in the container
WORKDIR /app

# Step 9: Copy only the necessary files from the builder stage
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Step 10: Expose the port that the Next.js app will run on (default is 3000)
EXPOSE 3000

# Step 11: Start the Next.js app in production mode
CMD ["npm", "start"]
