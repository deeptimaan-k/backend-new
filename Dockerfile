# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 5002

# Set environment variables
ENV NODE_ENV=production
ENV MONGO_URL=mongodb+srv://ayush:Last4no.8795@clustersheshya.ppgoe0c.mongodb.net/?retryWrites=true&w=majority&appName=ClusterSheshya
ENV PORT=5002
ENV JWT_SECRET=sheshyjwtsecretkey12345@
ENV ACCESS_TOKEN_SECRET=LD9cv1kBfgRHOGzh9TUkcyqgZAaM0o3DmVkx08MCFRSzMocyO3UtNdDNtoCJ0X0-5nLwK7fdO
ENV ACCESS_TOKEN_EXPIRY=1d
ENV REFRESH_TOKEN_SECRET=CMdDNtowK7fX0-5D9cvMCFRSLHVTUkcyqgZAaIg9GG_OGzh9zMocyO3UtN1kBfLRn3DmVkxdO
ENV REFRESH_TOKEN_EXPIRY=10d
ENV AWS_ACCESS_KEY_ID=AKIAZGMHSBYEGP3H5REQ
ENV AWS_SECRET_ACCESS_KEY=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
ENV AWS_REGION=ap-south-1
ENV AWS_BUCKET_NAME=all-subject-files
ENV RAZORPAY_KEY_ID=rzp_test_iObKMYCDzbK52R
ENV RAZORPAY_KEY_SECRET=zx4PEvenXDhv3kgq7Swb7JAE

# Command to run the app
CMD ["npm", "start"]
