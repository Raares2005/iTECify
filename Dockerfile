FROM mongo:7

# Optional: set default env variables
ENV MONGO_INITDB_ROOT_USERNAME=env.dockerUser
ENV MONGO_INITDB_ROOT_PASSWORD=env.dockerPasword

# Expose MongoDB port
EXPOSE 27017