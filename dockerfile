# Use an official Python runtime as a parent image
FROM node:7.10

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
ADD . /app

# Install any needed packages specified in requirements.txt
RUN npm install
RUN npm install -g supervisor


# Make port 3000 available to the world outside this container
EXPOSE 3000

# Environement Variables
ENV JWT_SECRET this is a test
ENV POSTGRES_HOST localhost
ENV POSTGRES_PORT 5432
ENV POSTGRES_DB authServer
ENV POSTGRES_USER Rob
ENV POSTGRES_PASSWORD 1111
ENV AUTHDEBUG debug

# Run app.py when the container launches
CMD ["npm", "test"]
CMD ["supervisor", "index.js"]