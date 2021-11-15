# Mango App

## Prerequisites
- Shell
- Docker

## Local

### Start

### Step 1: Start `Mango` locally
```sh
  ./start.sh
```

## Production

### Start

#### Step 1: Login to ACR
```sh
  az acr login --name <ACR_NAME>
```

#### Step 2: Build Containers
```sh
  ./build.sh
```

#### Step 3: Deploy
```sh
  ./start.production.sh
```

### Stop
```sh
  ./stop.production.sh
```
