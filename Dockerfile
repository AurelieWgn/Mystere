# Image de base
FROM node:18

# Installer Java 17
RUN apt-get update && apt-get install -y openjdk-17-jdk && apt-get clean;

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de package.json et package-lock.json (ou yarn.lock)
COPY package*.json ./

# Installer les dépendances du projet
RUN npm install --legacy-peer-deps

# Copier le reste des fichiers du projet
COPY . .

# Vérifier les versions
RUN java -version
RUN node -v
RUN npm -v

# Lancer l'application 
CMD ["npx", "react-native", "start"]