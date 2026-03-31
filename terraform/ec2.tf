# 1. Provide an SSH key pair (You can change this to your actual public key or let Terraform generate one)
resource "tls_private_key" "codemate_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "generated_key" {
  key_name   = "codemate-ssh-key"
  public_key = tls_private_key.codemate_key.public_key_openssh
}

# Fetch the latest Ubuntu 24.04 AMI
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# -------------------------------------------------------------
# BACKEND TIER (Node.js + Socket.io)
# -------------------------------------------------------------
resource "aws_instance" "backend" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  subnet_id     = aws_subnet.public_subnet.id
  vpc_security_group_ids = [aws_security_group.backend_sg.id]
  key_name      = aws_key_pair.generated_key.key_name

  root_block_device {
    volume_size = 14
  }

  tags = {
    Name = "CodeMate-Backend-Tier"
  }

  user_data = <<-EOF
    #!/bin/bash
    set -e
    exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

    # Update and Install Dependencies
    apt-get update
    apt-get install -y docker.io git curl

    # Create 1GB Swap File to prevent Out-Of-Memory limits
    fallocate -l 1G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    
    # Install Docker Compose v2
    mkdir -p /usr/local/lib/docker/cli-plugins
    curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64" -o /usr/local/lib/docker/cli-plugins/docker-compose
    chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
    
    # Start and Enable Docker
    systemctl enable docker
    systemctl start docker

    # Clone Repository
    cd /home/ubuntu
    git clone https://github.com/tushar26vohra/codemate-devops.git app
    cd app/CodeMate-main

    # Create environment variables file for the backend
    cat <<ENV > .env
    MONGO_URI=${var.mongo_uri}
    JWT_SECRET=${var.jwt_secret}
    API_KEY=${var.api_key}
    ENV

    # Start the backend services (Node + Local fallback Mongo)
    docker compose up -d --build backend
  EOF
}

# -------------------------------------------------------------
# FRONTEND TIER (React Vite)
# -------------------------------------------------------------
resource "aws_instance" "frontend" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  subnet_id     = aws_subnet.public_subnet.id
  vpc_security_group_ids = [aws_security_group.frontend_sg.id]
  key_name      = aws_key_pair.generated_key.key_name

  root_block_device {
    volume_size = 14
  }

  tags = {
    Name = "CodeMate-Frontend-Tier"
  }

  # Make the frontend wait for the backend to be created to inject its IP
  depends_on = [aws_instance.backend]

  user_data = <<-EOF
    #!/bin/bash
    set -e
    exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

    # Update and Install Dependencies
    apt-get update
    apt-get install -y docker.io git curl

    # Create 3GB Swap File to prevent Vite 'npm run build' from running out of RAM
    fallocate -l 3G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    
    # Install Docker Compose v2
    mkdir -p /usr/local/lib/docker/cli-plugins
    curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64" -o /usr/local/lib/docker/cli-plugins/docker-compose
    chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
    
    # Start and Enable Docker
    systemctl enable docker
    systemctl start docker

    # Clone Repository
    cd /home/ubuntu
    git clone https://github.com/tushar26vohra/codemate-devops.git app
    cd app/CodeMate-main

    # Fix Node.js Heap Out of Memory crash during Vite build
    sed -i '/WORKDIR \/app/a ENV NODE_OPTIONS="--max_old_space_size=3072"' client/Dockerfile

    # We dynamically pass the backend's newly created Public IP into the Frontend Docker build!
    cat <<ENV > .env
    VITE_BACKEND_URL=http://${aws_instance.backend.public_ip}:5000/
    ENV

    # Generate Vite specific environment file for compile-time
    cat <<ENV > client/.env
    VITE_BACKEND_URL=http://${aws_instance.backend.public_ip}:5000/
    ENV

    # Start the frontend container without triggering the backend dependency
    docker compose up -d --build --no-deps frontend
  EOF
}
